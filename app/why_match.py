
import os
import google.generativeai as genai
from dotenv import load_dotenv
import logging

load_dotenv()

# Configure Gemini API for Embeddings and Generation
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    logging.error("GEMINI_API_KEY not found. Please set it in your .env file.")
if api_key:
    genai.configure(api_key=api_key)
    GENERATION_MODEL = "gemini-1.5-flash"
else:
    GENERATION_MODEL = None
    logging.warning(
        "Gemini GENERATION_MODEL not set due to missing API_KEY. Explanation generation will not work.")


def generate_match_explanation(mentee_profile: dict, mentor_profile: dict,
                               score_components: dict) -> str:
    """
    Generates a concise explanation (approx. 200 words) for why a mentee and mentor are a good match,
    using Google Gemini, excluding availability.
    """
    if not GENERATION_MODEL:
        return "Explanation generation is disabled due to missing API key."

    # Filter out availability and focus on positively contributing components
    relevant_components = {
        k: v for k, v in score_components.items()
        if 'availability' not in k and v > 0.05 # Still excluding availability, as requested
    }
    # Sort by score in descending order to highlight most impactful factors
    sorted_components = sorted(relevant_components.items(), key=lambda item: item[1], reverse=True)

    match_points = []

    # Existing match points
    if mentee_profile.get('goal_target') and mentor_profile.get('goal_support') and \
            score_components.get('goal_similarity', 0) > 0.1:
        match_points.append(
            f"Mentee seeks '{mentee_profile['goal_target']}' and mentor supports '{mentor_profile['goal_support']}'.")

    if mentee_profile.get('skills_to_develop') and mentor_profile.get('coaching_skills') and \
            score_components.get('skills_match', 0) > 0.1:
        mentee_skills = ", ".join(mentee_profile['skills_to_develop'][:2])
        mentor_coaching = ", ".join(mentor_profile['coaching_skills'][:2])
        match_points.append(
            f"Mentee wants to develop {mentee_skills} skills, which mentor can coach.")

    if mentee_profile.get('current_challenges') and mentor_profile.get('challenges_help') and \
            score_components.get('challenges_match', 0) > 0.1:
        mentee_challenges = ", ".join(mentee_profile['current_challenges'][:2])
        mentor_help = ", ".join(mentor_profile['challenges_help'][:2])
        match_points.append(
            f"Mentee faces challenges like {mentee_challenges}, which mentor can help with.")

    if mentee_profile.get('values') and mentor_profile.get('values') and \
            score_components.get('values_match', 0) > 0.1:
        match_points.append(
            f"They share common values like {', '.join(mentee_profile['values'][:2])}.")

    if mentee_profile.get('origin') and mentor_profile.get('country') and \
            mentee_profile['origin'] == mentor_profile['country'] and score_components.get(
        'country_match', 0) > 0:
        match_points.append(f"Both are from {mentee_profile['origin']}.")

    if mentee_profile.get('feedback_style') and mentor_profile.get('feedback_style') and \
            mentee_profile['feedback_style'] == mentor_profile[
        'feedback_style'] and score_components.get('feedback_style_match', 0) > 0:
        match_points.append(f"They align on feedback style: {mentee_profile['feedback_style']}.")

    if mentee_profile.get('unclear_canadian_landscape') and mentor_profile.get(
            'canadian_landscape_help') and \
            score_components.get('canadian_landscape_match', 0) > 0.1:
        match_points.append(
            f"Mentor can guide on Canadian landscape aspects like {', '.join(mentor_profile['canadian_landscape_help'][:1])}.")

    if mentee_profile.get('barriers_faced') and mentor_profile.get('support_areas') and \
            score_components.get('barriers_support_match', 0) > 0.1:
        match_points.append(
            f"Mentor can support mentee's barriers like {', '.join(mentor_profile['support_areas'][:1])}.")

    if mentee_profile.get('industry') and mentor_profile.get('industry') and \
            score_components.get('industry_match', 0) > 0: # Using 0 as threshold for exact match
        if mentee_profile['industry'] == mentor_profile['industry']:
            match_points.append(f"They are both in the {mentee_profile['industry']} industry.")

    if mentee_profile.get('department') and mentor_profile.get('department') and \
            score_components.get('department_match', 0) > 0: # Using 0 as threshold for exact match
        if mentee_profile['department'] == mentor_profile['department']:
            match_points.append(f"They both work in the {mentee_profile['department']} department.")

    if not match_points:
        prompt_details = "They have complementary profiles."
    else:
        prompt_details = " ".join(match_points)

    component_summary = []
    # Include industry and department in top contributing factors if they have a score
    for comp, score in sorted_components[:5]: # Consider showing top 5, or adjust as needed
        component_summary.append(f"{comp.replace('_', ' ').title()} ({score:.2f})")

    component_string = "; ".join(component_summary)

    prompt = f"""
    Based on the following information, explain in detail why this mentee and mentor are a
    good match. Focus on shared goals, relevant skills the mentor can provide, how the mentor
    addresses the mentee's challenges or values, and professional alignment (industry, department).
    Aim for approximately 200 words.
    Do NOT mention 'availability' or 'time' in your explanation.

    Match Points Summary: {prompt_details}
    Top contributing factors: {component_string}.

    Mentee's Name: {mentee_profile.get('name', 'Mentee')}
    Mentor's Name: {mentor_profile.get('name', 'Mentor')}

    Explanation:
    """

    try:
        model = genai.GenerativeModel(GENERATION_MODEL)
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.4,
                max_output_tokens=300 # Adjusted slightly for 200 words target
            ),
            safety_settings=[
                {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
                {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE"},
                {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE"},
                {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE"},
            ]
        )
        explanation = response.candidates[0].content.parts[0].text.strip()

        # Update the post-processing to truncate by word count if needed, or remove it
        # if you trust the model's token limit. Word-based truncation is more complex
        # than character-based. For now, let's just remove the explicit character truncation
        # but keep the forbidden word replacement.
        explanation = explanation.replace('availability', '').replace('Availability', '').replace(
            'time', '').replace('Time', '')

        # Optional: If you *must* enforce a strict word limit, you'd add logic here
        words = explanation.split()
        if len(words) > 200:
            explanation = " ".join(words[:200]) + "..." # Truncate and add ellipsis

        return explanation
    except Exception as e:
        logging.error(f"Error generating explanation for match: {e}")
        return "Explanation could not be generated."

# import os
# import google.generativeai as genai
# from dotenv import load_dotenv
# import logging
#
# load_dotenv()
#
# # Configure Gemini API for Embeddings and Generation
# api_key = os.getenv("GEMINI_API_KEY")
# if not api_key:
#     logging.error("GEMINI_API_KEY not found. Please set it in your .env file.")
# if api_key:
#     genai.configure(api_key=api_key)
#     GENERATION_MODEL = "gemini-1.5-flash"
# else:
#     GENERATION_MODEL = None
#     logging.warning(
#         "Gemini GENERATION_MODEL not set due to missing API_KEY. Explanation generation will not work.")
#
#
# def generate_match_explanation(mentee_profile: dict, mentor_profile: dict,
#                                score_components: dict) -> str:
#     """
#     Generates a concise explanation (approx. 200 words) for why a mentee and mentor are a good match,
#     using Google Gemini, excluding availability.
#     """
#     if not GENERATION_MODEL:
#         return "Explanation generation is disabled due to missing API key."
#
#     # Filter out availability and focus on positively contributing components
#     relevant_components = {
#         k: v for k, v in score_components.items()
#         if 'availability' not in k and v > 0.05
#     }
#     sorted_components = sorted(relevant_components.items(), key=lambda item: item[1], reverse=True)
#
#     match_points = []
#
#     if mentee_profile.get('goal_target') and mentor_profile.get('goal_support') and \
#             score_components.get('goal_similarity', 0) > 0.1:
#         match_points.append(
#             f"Mentee seeks '{mentee_profile['goal_target']}' and mentor supports '{mentor_profile['goal_support']}'.")
#
#     if mentee_profile.get('skills_to_develop') and mentor_profile.get('coaching_skills') and \
#             score_components.get('skills_match', 0) > 0.1:
#         mentee_skills = ", ".join(mentee_profile['skills_to_develop'][:2])
#         mentor_coaching = ", ".join(mentor_profile['coaching_skills'][:2])
#         match_points.append(
#             f"Mentee wants to develop {mentee_skills} skills, which mentor can coach.")
#
#     if mentee_profile.get('current_challenges') and mentor_profile.get('challenges_help') and \
#             score_components.get('challenges_match', 0) > 0.1:
#         mentee_challenges = ", ".join(mentee_profile['current_challenges'][:2])
#         mentor_help = ", ".join(mentor_profile['challenges_help'][:2])
#         match_points.append(
#             f"Mentee faces challenges like {mentee_challenges}, which mentor can help with.")
#
#     if mentee_profile.get('values') and mentor_profile.get('values') and \
#             score_components.get('values_match', 0) > 0.1:
#         match_points.append(
#             f"They share common values like {', '.join(mentee_profile['values'][:2])}.")
#
#     if mentee_profile.get('origin') and mentor_profile.get('country') and \
#             mentee_profile['origin'] == mentor_profile['country'] and score_components.get(
#         'country_match', 0) > 0:
#         match_points.append(f"Both are from {mentee_profile['origin']}.")
#
#     if mentee_profile.get('feedback_style') and mentor_profile.get('feedback_style') and \
#             mentee_profile['feedback_style'] == mentor_profile[
#         'feedback_style'] and score_components.get('feedback_style_match', 0) > 0:
#         match_points.append(f"They align on feedback style: {mentee_profile['feedback_style']}.")
#
#     if mentee_profile.get('unclear_canadian_landscape') and mentor_profile.get(
#             'canadian_landscape_help') and \
#             score_components.get('canadian_landscape_match', 0) > 0.1:
#         match_points.append(
#             f"Mentor can guide on Canadian landscape aspects like {', '.join(mentor_profile['canadian_landscape_help'][:1])}.")
#
#     if mentee_profile.get('barriers_faced') and mentor_profile.get('support_areas') and \
#             score_components.get('barriers_support_match', 0) > 0.1:
#         match_points.append(
#             f"Mentor can support mentee's barriers like {', '.join(mentor_profile['support_areas'][:1])}.")
#
#     if not match_points:
#         prompt_details = "They have complementary profiles."
#     else:
#         prompt_details = " ".join(match_points)
#
#     component_summary = []
#     for comp, score in sorted_components[:3]:
#         component_summary.append(f"{comp.replace('_', ' ').title()} ({score:.2f})")
#
#     component_string = "; ".join(component_summary)
#
#     # *** CHANGES START HERE ***
#
#     # Update the prompt to ask for words instead of characters and a higher limit
#     prompt = f"""
#     Based on the following information, explain in detail why this mentee and mentor are a good match.
#     Focus on shared goals, relevant skills the mentor can provide, and how the mentor addresses the mentee's challenges or values.
#     Aim for approximately 200 words.
#     Do NOT mention 'availability' or 'time' in your explanation.
#
#     Match Points Summary: {prompt_details}
#     Top contributing factors: {component_string}.
#
#     Mentee's Name: {mentee_profile.get('name', 'Mentee')}
#     Mentor's Name: {mentor_profile.get('name', 'Mentor')}
#
#     Explanation:
#     """
#
#     try:
#         model = genai.GenerativeModel(GENERATION_MODEL)
#         response = model.generate_content(
#             prompt,
#             generation_config=genai.types.GenerationConfig(
#                 temperature=0.4,
#                 # For ~200 words, you'll need closer to 260-300 tokens (200 words / 0.75 words/token = ~267 tokens).
#                 # Setting it to 300-350 to give it a bit of room.
#                 max_output_tokens=300
#             ),
#             safety_settings=[
#                 {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
#                 {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE"},
#                 {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE"},
#                 {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE"},
#             ]
#         )
#         explanation = response.candidates[0].content.parts[0].text.strip()
#
#         # Update the post-processing to truncate by word count if needed, or remove it
#         # if you trust the model's token limit. Word-based truncation is more complex
#         # than character-based. For now, let's just remove the explicit character truncation
#         # but keep the forbidden word replacement.
#         explanation = explanation.replace('availability', '').replace('Availability', '').replace(
#             'time', '').replace('Time', '')
#
#         # Optional: If you *must* enforce a strict word limit, you'd add logic here
#         # words = explanation.split()
#         # if len(words) > 200:
#         #     explanation = " ".join(words[:200]) + "..."
#
#         return explanation
#     except Exception as e:
#         logging.error(f"Error generating explanation for match: {e}")
#         return "Explanation could not be generated."

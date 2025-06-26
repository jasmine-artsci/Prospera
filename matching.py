import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import os
import google.generativeai as genai
from dotenv import load_dotenv
from supabase import create_client, Client
import logging
import why_match

# Load environment variables
load_dotenv()

# Configure Gemini API for Embeddings (GENERATION_MODEL config is now in why_match.py)
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    logging.error("GEMINI_API_KEY not found. Please set it in your .env file.")
    raise ValueError("GEMINI_API_KEY not found. Please set it in your .env file.")
genai.configure(api_key=api_key)

EMBEDDING_MODEL = "models/text-embedding-004"

# --- Supabase Database Configuration ---
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    logging.error("SUPABASE_URL or SUPABASE_KEY not set. Please check your .env file.")
    raise ValueError("SUPABASE_URL or SUPABASE_KEY not set. Please check your .env file.")


# Initialize Supabase Client
def get_supabase() -> Client:
    """
    Create and return a Supabase client using environment variables.
    """
    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        logging.info("Supabase client initialized successfully.")
        return supabase
    except Exception as e:
        logging.error(f"Error initializing Supabase client: {e}")
        raise e


# Initialize client globally or pass it
supabase_client = get_supabase()


def fetch_all_mentors_from_supabase() -> pd.DataFrame:
    """Fetches all mentor profiles from the 'mentors' table in Supabase."""
    try:
        response = supabase_client.from_('mentors').select('*').execute()
        mentors_list = response.data
        if not mentors_list:
            logging.info("No mentors found in Supabase 'mentors' table.")
            return pd.DataFrame()
        return pd.DataFrame(mentors_list)
    except Exception as e:
        logging.error(f"Error fetching mentors from Supabase: {e}")
        return pd.DataFrame()


def fetch_all_mentees_from_supabase() -> pd.DataFrame:
    """Fetches all mentee profiles from the 'mentees' table in Supabase."""
    try:
        response = supabase_client.from_('mentees').select('*').execute()
        mentees_list = response.data
        if not mentees_list:
            logging.info("No mentees found in Supabase 'mentees' table.")
            return pd.DataFrame()
        return pd.DataFrame(mentees_list)
    except Exception as e:
        logging.error(f"Error fetching mentees from Supabase: {e}")
        return pd.DataFrame()


WEIGHTS = {
    'goal_similarity': 0.80,
    'skills_match': 0.85,
    'challenges_match': 0.85,
    'country_match': 0.55,
    'canadian_landscape_match': 0.35,
    'english_level_match': 0.35,
    'preferred_channel_match': 0.05,
    'personality_extraversion': 0.30,
    'personality_conscientiousness': 0.20,
    'personality_emotional_stability': 0.30,
    'personality_openness': 0.20,
    'feedback_style_match': 0.20,
    'availability_match': 0.20,
    'values_match': 0.20,
    'barriers_support_match': 0.55,
    'industry_match': 0.80,
    'department_match': 0.80
}

# Normalize weights to sum to 1.0
total_weight_sum = sum(WEIGHTS.values())
if total_weight_sum > 0:
    WEIGHTS = {k: v / total_weight_sum for k, v in WEIGHTS.items()}
logging.info(f"Normalized Weights (sum={sum(WEIGHTS.values()):.2f}): {WEIGHTS}")


def get_embedding(text):
    """Generates an embedding for the given text using Gemini's text-embedding-004 model."""
    if not text:
        return np.zeros(768)
    try:
        embedding_response = genai.embed_content(model=EMBEDDING_MODEL, content=text)
        return np.array(embedding_response['embedding'])
    except Exception as e:
        logging.warning(f"Error getting embedding for text: '{text[:50]}...'. Error: {e}")
        return np.zeros(768)


def calculate_goal_similarity(mentee_goal: str, mentor_goal: str) -> float:
    mentee_embedding = get_embedding(mentee_goal)
    mentor_embedding = get_embedding(mentor_goal)
    if np.all(mentee_embedding == 0) or np.all(mentor_embedding == 0):
        return 0.0
    return cosine_similarity(mentee_embedding.reshape(1, -1), mentor_embedding.reshape(1, -1))[0][0]


def calculate_jaccard_similarity(set1: list, set2: list) -> float:
    if not set1 or not set2:
        return 0.0
    s1 = set(item.lower() for item in set1)
    s2 = set(item.lower() for item in set2)
    intersection = len(s1.intersection(s2))
    union = len(s1.union(s2))
    return intersection / union if union != 0 else 0.0


def calculate_personality_similarity(mentee_score: int, mentor_score: int,
                                     max_score: int = 5) -> float:
    diff = abs(mentee_score - mentor_score)
    max_diff = max_score - 1
    return 1 - (diff / max_diff) if max_diff != 0 else 1.0


def calculate_exact_match(mentee_val: str, mentor_val: str) -> float:
    # Ensure values are treated as strings before lowercasing
    return 1.0 if str(mentee_val).lower() == str(mentor_val).lower() else 0.0


def calculate_list_overlap(list1: list, list2: list) -> float:
    if not list1 or not list2:
        return 0.0
    s1 = set(item.lower() for item in list1)
    s2 = set(item.lower() for item in list2)
    common_elements = len(s1.intersection(s2))
    # It seems your original intention was common elements / len(s1).
    # If you want common elements / min(len(s1), len(s2)) or / len(s2), adjust here.
    return common_elements / len(s1) if len(s1) > 0 else 0.0


def match_mentee_to_mentors(mentee_profile: dict, mentors_df: pd.DataFrame) -> list:
    matches = []

    for _, mentor in mentors_df.iterrows():
        score_components = {}
        total_weighted_score = 0.0

        # Goal Similarity (using embeddings)
        goal_sim = calculate_goal_similarity(mentee_profile.get('goal_target', ''),
                                             mentor.get('goal_support', ''))
        score_components['goal_similarity'] = goal_sim
        total_weighted_score += goal_sim * WEIGHTS['goal_similarity']

        # Skills Development vs. Coaching Skills (Jaccard)
        skills_match = calculate_jaccard_similarity(mentee_profile.get('skills_to_develop', []),
                                                    mentor.get('coaching_skills', []))
        score_components['skills_match'] = skills_match
        total_weighted_score += skills_match * WEIGHTS['skills_match']

        # Current Challenges vs. Mentor Help Areas (Jaccard)
        challenges_match = calculate_jaccard_similarity(
            mentee_profile.get('current_challenges', []), mentor.get('challenges_help', []))
        score_components['challenges_match'] = challenges_match
        total_weighted_score += challenges_match * WEIGHTS['challenges_match']

        # Values Alignment (Jaccard)
        values_match = calculate_jaccard_similarity(mentee_profile.get('values', []),
                                                    mentor.get('values', []))
        score_components['values_match'] = values_match
        total_weighted_score += values_match * WEIGHTS['values_match']

        # Barriers Faced vs. Support Areas (Jaccard)
        barriers_support_match = calculate_jaccard_similarity(
            mentee_profile.get('barriers_faced', []), mentor.get('support_areas', []))
        score_components['barriers_support_match'] = barriers_support_match
        total_weighted_score += barriers_support_match * WEIGHTS['barriers_support_match']

        # Canadian Landscape Match (Jaccard)
        canadian_landscape_match = calculate_jaccard_similarity(
            mentee_profile.get('unclear_canadian_landscape', []),
            mentor.get('canadian_landscape_help', []))
        score_components['canadian_landscape_match'] = canadian_landscape_match
        total_weighted_score += canadian_landscape_match * WEIGHTS['canadian_landscape_match']

        # Personality Match (Big Five)
        personality_fields = ['extraversion', 'conscientiousness', 'emotional_stability', 'openness']
        personality_score_sum = 0
        for field in personality_fields:
            mentee_score = mentee_profile.get(field, 3) # Default to 3 if missing
            mentor_score = mentor.get(field, 3) # Default to 3 if missing
            sim = calculate_personality_similarity(mentee_score, mentor_score)
            score_components[f'personality_{field}'] = sim
            personality_score_sum += sim * WEIGHTS[f'personality_{field}']
        total_weighted_score += personality_score_sum

        # Country/Origin Match (Exact)
        country_match = calculate_exact_match(mentee_profile.get('origin', ''),
                                              mentor.get('country', ''))
        score_components['country_match'] = country_match
        total_weighted_score += country_match * WEIGHTS['country_match']

        # Preferred Channel Match (Exact)
        channel_match = calculate_exact_match(mentee_profile.get('preferred_channel', ''),
                                              mentor.get('preferred_channel', ''))
        score_components['preferred_channel_match'] = channel_match
        total_weighted_score += channel_match * WEIGHTS['preferred_channel_match']

        # English Level Match (Exact)
        english_match = calculate_exact_match(mentee_profile.get('english_cefr', ''),
                                              mentor.get('english_level', ''))
        score_components['english_level_match'] = english_match
        total_weighted_score += english_match * WEIGHTS['english_level_match']

        # Availability Match (List Overlap)
        availability_match = calculate_list_overlap(mentee_profile.get('availability', []),
                                                    mentor.get('availability', []))
        score_components['availability_match'] = availability_match
        total_weighted_score += availability_match * WEIGHTS['availability_match']

        # Feedback Style Match (Exact)
        feedback_match = calculate_exact_match(mentee_profile.get('feedback_style', ''),
                                               mentor.get('feedback_style', ''))
        score_components['feedback_style_match'] = feedback_match
        total_weighted_score += feedback_match * WEIGHTS['feedback_style_match']

        industry_match = calculate_exact_match(mentee_profile.get('industry', ''),
                                               mentor.get('industry', ''))
        score_components['industry_match'] = industry_match
        total_weighted_score += industry_match * WEIGHTS['industry_match']

        department_match = calculate_exact_match(mentee_profile.get('department', ''),
                                                 mentor.get('department', ''))
        score_components['department_match'] = department_match
        total_weighted_score += department_match * WEIGHTS['department_match']

        matches.append({
            'mentor_id': mentor['id'],
            'mentor_name': mentor.get('name', 'Unknown Mentor'),
            'total_score': total_weighted_score,
            'score_components': score_components
        })

    matches.sort(key=lambda x: x['total_score'], reverse=True)
    return matches


def store_matches_in_supabase(mentee_id: str, matches: list, mentees_df: pd.DataFrame,
                              mentors_df: pd.DataFrame):
    """
    Stores the matching results for a single mentee into the mentee_mentor_matches table.
    Deletes existing matches for the mentee before inserting new ones to prevent duplicates/stale data.
    Now also generates the explanation text using why_match.
    """
    if not matches:
        logging.info(f"No matches to store for mentee ID: {mentee_id}")
        return

    try:
        logging.info(f"Deleting existing matches for mentee ID: {mentee_id}...")
        delete_response = supabase_client.from_('mentee_mentor_matches').delete().eq('mentee_id',
                                                                                     mentee_id).execute()

        if delete_response.data is not None:
            logging.info(f"Successfully deleted existing matches for mentee ID: {mentee_id}.")
        else:
            logging.warning(
                f"Deletion for mentee ID {mentee_id} completed, but response was unexpected."
                f"Response data: {delete_response.data}")

        # Get the full mentee profile once for explanation generation
        current_mentee_profile = mentees_df[mentees_df['id'] == mentee_id].iloc[0].to_dict()

        # Prepare data for insertion
        records_to_insert = []
        for rank, match in enumerate(matches):
            # Get the full mentor profile for explanation generation
            mentor_profile = mentors_df[mentors_df['id'] == match['mentor_id']].iloc[0].to_dict()

            # Generate the explanation text using the imported module
            explanation_text = why_match.generate_match_explanation(
                mentee_profile=current_mentee_profile,  # Pass the full mentee profile
                mentor_profile=mentor_profile,  # Pass the full mentor profile
                score_components=match['score_components']
            )

            records_to_insert.append({
                'mentee_id': mentee_id,
                'mentor_id': match['mentor_id'],
                'match_score': match['total_score'],
                'match_rank': rank + 1,
                'generated_at': pd.Timestamp.now(tz='UTC').isoformat(),
                'score_components': match['score_components'],
                'explanation_text': explanation_text  # Add explanation text
            })

        logging.info(
            f"Inserting {len(records_to_insert)} new matches for mentee ID: {mentee_id}...")
        insert_response = supabase_client.from_('mentee_mentor_matches').insert(
            records_to_insert).execute()

        if insert_response.data:
            logging.info(
                f"Successfully stored {len(insert_response.data)} matches for mentee ID: {mentee_id}.")
        else:
            logging.error(
                f"Error storing matches for mentee ID: {mentee_id}. Insert response data was empty.")

    except Exception as e:
        logging.error(f"Error storing matches for mentee ID {mentee_id}: {e}")

    logging.info("Matching process completed.")


# if __name__ == "__main__":
#     # Configure logging
#     logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
#
#     logging.info("Fetching data from Supabase...")
#
#     mentors_df_supabase = fetch_all_mentors_from_supabase()
#     mentees_df_supabase = fetch_all_mentees_from_supabase()
#
#     if mentors_df_supabase.empty:
#         logging.error(
#             "No mentors found or error fetching mentors from Supabase. Cannot proceed with matching.")
#         exit()
#     if mentees_df_supabase.empty:
#         logging.error(
#             "No mentees found or error fetching mentees from Supabase. Cannot proceed with matching.")
#         exit()
#
#     logging.info(f"Mentors fetched from Supabase: {len(mentors_df_supabase)}")
#     logging.info(f"Mentees fetched from Supabase: {len(mentees_df_supabase)}")
#
#     # Limit to top 3 matches before storing and generating explanations
#     MATCH_LIMIT_PER_MENTEE = 3
#
#     for _, mentee_profile_df_row in mentees_df_supabase.iterrows():
#         mentee_profile = mentee_profile_df_row.to_dict()
#         mentee_id = str(mentee_profile['id'])
#
#         logging.info(
#             f"--- Processing Mentee: {mentee_profile.get('name', 'Unnamed Mentee')} (ID: {mentee_id}) ---")
#
#         try:
#             all_matches_for_mentee = match_mentee_to_mentors(mentee_profile, mentors_df_supabase)
#
#             # Apply the limit here
#             top_matches_for_mentee = all_matches_for_mentee[:MATCH_LIMIT_PER_MENTEE]
#
#             if not top_matches_for_mentee:
#                 logging.info(f"No top matches found for mentee ID: {mentee_id}.")
#                 continue
#
#             # Pass both dataframes to store_matches_in_supabase for explanation generation
#             store_matches_in_supabase(mentee_id, top_matches_for_mentee, mentees_df_supabase,
#                                       mentors_df_supabase)
#             logging.info(
#                 f"Successfully processed and stored top {len(top_matches_for_mentee)} matches for mentee ID: {mentee_id}")
#
#         except Exception as e:
#             logging.error(f"Error processing mentee ID {mentee_id}: {e}")

# if __name__ == "__main__":
#     print("\n--- Fetching data from Supabase ---")
#
#     mentors_df_supabase = fetch_all_mentors_from_supabase()
#     mentees_df_supabase = fetch_all_mentees_from_supabase()
#
#     if mentors_df_supabase.empty:
#         print("No mentors found or error fetching mentors from Supabase. Cannot proceed with matching.")
#         exit()
#     if mentees_df_supabase.empty:
#         print("No mentees found or error fetching mentees from Supabase. Cannot proceed with matching.")
#         exit()
#
#     print(f"\nMentors fetched from Supabase ({len(mentors_df_supabase)}):")
#     print(mentors_df_supabase[['name', 'goal_support']].head())
#     print(f"\nMentees fetched from Supabase ({len(mentees_df_supabase)}):")
#     print(mentees_df_supabase[['name', 'goal_target']].head())
#
#
#     mentee_names_to_test = ['Alex Wong', 'Priya Nair', 'Luis Herrera', 'Fatima Khan', 'Carlos Silva']
#
#     for mentee_name in mentee_names_to_test:
#         mentee_profiles = mentees_df_supabase[mentees_df_supabase['name'] == mentee_name]
#
#         if not mentee_profiles.empty:
#             mentee_profile = mentee_profiles.iloc[0].to_dict()
#             mentee_id = str(mentee_profile['id']) # Get the mentee's actual UUID
#
#             print(f"\n--- Matching Mentee from Supabase: {mentee_profile.get('name', 'Unnamed Mentee')} (ID: {mentee_id}) ---")
#             supabase_matches = match_mentee_to_mentors(mentee_profile, mentors_df_supabase)
#
#             for match in supabase_matches:
#                 print(f"Mentor: {match['mentor_name']}, Score: {match['total_score']:.2f}")
#                 # print(f"  Components: {match['score_components']}") # Uncomment for detailed scores
#
#             # --- THIS IS THE KEY CALL ---
#             store_matches_in_supabase(mentee_id, supabase_matches)
#
#         else:
#             print(f"Mentee with name '{mentee_name}' not found in Supabase data.")

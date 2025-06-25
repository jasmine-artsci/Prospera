import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import os
import google.generativeai as genai
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv()

# Configure Gemini API for Embeddings
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY not found. Please set it in your .env file.")
genai.configure(api_key=api_key)

EMBEDDING_MODEL = "models/text-embedding-004"

# --- Supabase Database Configuration ---
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("SUPABASE_URL or SUPABASE_KEY not set. Please check your .env file.")


# Initialize Supabase Client
def get_supabase() -> Client:
    """
    Create and return a Supabase client using environment variables.
    """
    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("Supabase client initialized successfully.")
        return supabase
    except Exception as e:
        print(f"Error initializing Supabase client: {e}")
        raise e


# Initialize client globally or pass it
supabase_client = get_supabase()


def fetch_all_mentors_from_supabase() -> pd.DataFrame:
    """Fetches all mentor profiles from the 'mentors' table in Supabase."""
    try:
        # Use the Supabase client to query the 'mentors' table
        response = supabase_client.from_('mentors').select('*').execute()
        # The 'data' attribute contains the list of dictionaries
        mentors_list = response.data
        if not mentors_list:
            print("No mentors found in Supabase 'mentors' table.")
            return pd.DataFrame()
        return pd.DataFrame(mentors_list)
    except Exception as e:
        print(f"Error fetching mentors from Supabase: {e}")
        return pd.DataFrame()


def fetch_all_mentees_from_supabase() -> pd.DataFrame:
    """Fetches all mentee profiles from the 'mentees' table in Supabase."""
    try:
        response = supabase_client.from_('mentees').select('*').execute()
        mentees_list = response.data
        if not mentees_list:
            print("No mentees found in Supabase 'mentees' table.")
            return pd.DataFrame()
        return pd.DataFrame(mentees_list)
    except Exception as e:
        print(f"Error fetching mentees from Supabase: {e}")
        return pd.DataFrame()


# Define Weights (same as before)
WEIGHTS = {
    'goal_similarity': 0.45,
    'skills_match': 0.40,
    'challenges_match': 0.35,
    'country_match': 0.20,
    'canadian_landscape_match': 0.10,
    'english_level_match': 0.05,
    'preferred_channel_match': 0.05,
    'personality_extraversion': 0.02,
    'personality_conscientiousness': 0.02,
    'personality_emotional_stability': 0.02,
    'personality_openness': 0.02,
    'feedback_style_match': 0.05,
    'availability_match': 0.20,
    'values_match': 0.10,
    'barriers_support_match': 0.15
}

total_weight_sum = sum(WEIGHTS.values())
if total_weight_sum > 0:
    WEIGHTS = {k: v / total_weight_sum for k, v in WEIGHTS.items()}
print(f"Normalized Weights (sum={sum(WEIGHTS.values()):.2f}): {WEIGHTS}")

# --- All your matching algorithm functions (unchanged) ---
# (These functions remain exactly the same as in the previous version)
def get_embedding(text):
    """Generates an embedding for the given text using Gemini's text-embedding-004 model."""
    if not text:
        return np.zeros(768)
    try:
        embedding_response = genai.embed_content(model=EMBEDDING_MODEL, content=text)
        return np.array(embedding_response['embedding'])
    except Exception as e:
        print(f"Error getting embedding for text: '{text[:50]}...'. Error: {e}")
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

def calculate_personality_similarity(mentee_score: int, mentor_score: int, max_score: int = 5) -> float:
    diff = abs(mentee_score - mentor_score)
    max_diff = max_score - 1
    return 1 - (diff / max_diff) if max_diff != 0 else 1.0

def calculate_exact_match(mentee_val: str, mentor_val: str) -> float:
    return 1.0 if str(mentee_val).lower() == str(mentor_val).lower() else 0.0

def calculate_list_overlap(list1: list, list2: list) -> float:
    if not list1 or not list2:
        return 0.0
    s1 = set(item.lower() for item in list1)
    s2 = set(item.lower() for item in list2)
    common_elements = len(s1.intersection(s2))
    return common_elements / len(s1) if len(s1) > 0 else 0.0

# --- Main Matching Function (takes DataFrame from Supabase) ---
def match_mentee_to_mentors(mentee_profile: dict, mentors_df: pd.DataFrame) -> list:
    # (This function remains exactly the same as in the previous version,
    # it just receives data fetched by the new Supabase functions)
    matches = []

    for _, mentor in mentors_df.iterrows():
        score_components = {}
        total_weighted_score = 0.0

        goal_sim = calculate_goal_similarity(mentee_profile.get('goal_target', ''), mentor.get('goal_support', ''))
        score_components['goal_similarity'] = goal_sim
        total_weighted_score += goal_sim * WEIGHTS['goal_similarity']

        skills_match = calculate_jaccard_similarity(mentee_profile.get('skills_to_develop', []), mentor.get('coaching_skills', []))
        score_components['skills_match'] = skills_match
        total_weighted_score += skills_match * WEIGHTS['skills_match']

        challenges_match = calculate_jaccard_similarity(mentee_profile.get('current_challenges', []), mentor.get('challenges_help', []))
        score_components['challenges_match'] = challenges_match
        total_weighted_score += challenges_match * WEIGHTS['challenges_match']

        values_match = calculate_jaccard_similarity(mentee_profile.get('values', []), mentor.get('values', []))
        score_components['values_match'] = values_match
        total_weighted_score += values_match * WEIGHTS['values_match']

        barriers_support_match = calculate_jaccard_similarity(mentee_profile.get('barriers_faced', []), mentor.get('support_areas', []))
        score_components['barriers_support_match'] = barriers_support_match
        total_weighted_score += barriers_support_match * WEIGHTS['barriers_support_match']

        canadian_landscape_match = calculate_jaccard_similarity(mentee_profile.get('unclear_canadian_landscape', []), mentor.get('canadian_landscape_help', []))
        score_components['canadian_landscape_match'] = canadian_landscape_match
        total_weighted_score += canadian_landscape_match * WEIGHTS['canadian_landscape_match']

        personality_fields = ['extraversion', 'conscientiousness', 'emotional_stability', 'openness']
        personality_score_sum = 0
        for field in personality_fields:
            mentee_score = mentee_profile.get(field, 3)
            mentor_score = mentor.get(field, 3)
            sim = calculate_personality_similarity(mentee_score, mentor_score)
            score_components[f'personality_{field}'] = sim
            personality_score_sum += sim * WEIGHTS[f'personality_{field}']
        total_weighted_score += personality_score_sum

        country_match = calculate_exact_match(mentee_profile.get('origin', ''), mentor.get('country', ''))
        score_components['country_match'] = country_match
        total_weighted_score += country_match * WEIGHTS['country_match']

        channel_match = calculate_exact_match(mentee_profile.get('preferred_channel', ''), mentor.get('preferred_channel', ''))
        score_components['preferred_channel_match'] = channel_match
        total_weighted_score += channel_match * WEIGHTS['preferred_channel_match']

        english_match = calculate_exact_match(mentee_profile.get('english_cefr', ''), mentor.get('english_level', ''))
        score_components['english_level_match'] = english_match
        total_weighted_score += english_match * WEIGHTS['english_level_match']

        availability_match = calculate_list_overlap(mentee_profile.get('availability', []), mentor.get('availability', []))
        score_components['availability_match'] = availability_match
        total_weighted_score += availability_match * WEIGHTS['availability_match']

        feedback_match = calculate_exact_match(mentee_profile.get('feedback_style', ''), mentor.get('feedback_style', ''))
        score_components['feedback_style_match'] = feedback_match
        total_weighted_score += feedback_match * WEIGHTS['feedback_style_match']

        matches.append({
            'mentor_id': mentor['id'],
            'mentor_name': mentor.get('name', 'Unknown Mentor'),
            'total_score': total_weighted_score,
            'score_components': score_components
        })

    matches.sort(key=lambda x: x['total_score'], reverse=True)
    return matches

# --- Example Usage (Now fetching from Supabase using supabase-py) ---
if __name__ == "__main__":
    print("\n--- Fetching data from Supabase ---")

    # Fetch all mentors and mentees once at the beginning
    mentors_df_supabase = fetch_all_mentors_from_supabase()
    mentees_df_supabase = fetch_all_mentees_from_supabase() # NEW: Fetch all mentees

    if mentors_df_supabase.empty:
        print("No mentors found or error fetching mentors from Supabase. Cannot proceed with matching.")
        exit()
    if mentees_df_supabase.empty:
        print("No mentees found or error fetching mentees from Supabase. Cannot proceed with matching.")
        exit()

    print(f"\nMentors fetched from Supabase ({len(mentors_df_supabase)}):")
    print(mentors_df_supabase[['name', 'goal_support']].head())
    print(f"\nMentees fetched from Supabase ({len(mentees_df_supabase)}):")
    print(mentees_df_supabase[['name', 'goal_target']].head())


    # List of mentee names to test
    mentee_names_to_test = ['Alex Wong', 'Priya Nair', 'Luis Herrera']

    for mentee_name in mentee_names_to_test:
        # Filter the fetched mentees DataFrame by name
        mentee_profiles = mentees_df_supabase[mentees_df_supabase['name'] == mentee_name]

        if not mentee_profiles.empty:
            # Get the first matching profile (assuming names are unique or you want the first one)
            mentee_profile = mentee_profiles.iloc[0].to_dict()

            print(f"\n--- Matching Mentee from Supabase: {mentee_profile.get('name', 'Unnamed Mentee')} (ID: {mentee_profile.get('id', 'N/A')}) ---")
            supabase_matches = match_mentee_to_mentors(mentee_profile, mentors_df_supabase)
            for match in supabase_matches:
                print(f"Mentor: {match['mentor_name']}, Score: {match['total_score']:.2f}")
                # print(f"  Components: {match['score_components']}") # Uncomment for detailed scores
        else:
            print(f"Mentee with name '{mentee_name}' not found in Supabase data.")

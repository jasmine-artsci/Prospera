import os
from fastapi import FastAPI, HTTPException, APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any
from fastapi.middleware.cors import CORSMiddleware
from fastapi import BackgroundTasks
import app.matching as matching 

from dotenv import load_dotenv  # ✅ Add this
load_dotenv()  # ✅ Load environment variables before other imports

from app import matching  # Now this works
# if you're using why_match.py as well later, import that too
app = FastAPI()

# router = APIRouter()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # or ["*"] to allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MenteeProfile(BaseModel):
    id: str
    name: str
    goal_target: str
    skills_to_develop: List[str]
    current_challenges: List[str]
    values: List[str]
    barriers_faced: List[str]
    unclear_canadian_landscape: List[str]
    origin: str
    feedback_style: str
    industry: str
    department: str
    preferred_channel: str
    english_cefr: str
    extraversion: int
    conscientiousness: int
    emotional_stability: int
    openness: int
    availability: List[str]

@app.post("/match")
def match_mentee(mentee: MenteeProfile):
    print("IN MATCH")
    mentors_df = matching.fetch_all_mentors_from_supabase()
    if mentors_df.empty:
        raise HTTPException(status_code=404, detail="No mentors found in Supabase.")

    results = matching.match_mentee_to_mentors(mentee.dict(), mentors_df)
    return {"matches": results[:3]}  # Return top 3 matches


@app.post("/run-matching")
def run_matching(background_tasks: BackgroundTasks):
    print("IN RUN MATCHING")
    # background_tasks.add_task(matching.run_matching_for_all_mentees)
    result = matching.run_matching_for_all_mentees()  # Create this function inside matching.py
    return {"status": "started", "result": result}
from pydantic import BaseModel
from typing import List, Dict

class AnalyzeRequest(BaseModel):
    text: str

class AnalyzeResponse(BaseModel):
    extractedSkills: List[str]
    entities: Dict[str, List[str]]
    readabilityScore: float

class SemanticMatchRequest(BaseModel):
    resumeText: str
    jobDescription: str

class SemanticMatchResponse(BaseModel):
    semanticJobMatch: float  # 0-100
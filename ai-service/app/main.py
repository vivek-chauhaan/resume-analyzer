from fastapi import FastAPI, HTTPException
from app.config import settings
from app.models.loader import load_models
from app.schemas import AnalyzeRequest, AnalyzeResponse, SemanticMatchRequest, SemanticMatchResponse
from app.services.skill_extractor import extract_entities, extracted_skills
from app.services.semantic_match import semantic_match
from app.services.readability import readability_score

app = FastAPI(
    title="Resume Analyzer - AI Microservice",
    description="Internal-only FastAPI service for free/local NLP scoring. Never exposed to the browser.",
    version="0.2.0",
)

_models_ready = False


@app.on_event("startup")
def on_startup() -> None:
    global _models_ready
    load_models()
    _models_ready = True
    print(f"[ai-service] started on port {settings.port}, models loaded: {_models_ready}")


@app.get("/health")
def health():
    return {
        "success": True,
        "data": {"status": "ok", "modelsLoaded": _models_ready},
        "message": "AI microservice is healthy",
    }


@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(payload: AnalyzeRequest):
    if not payload.text or not payload.text.strip():
        raise HTTPException(status_code=422, detail="text must not be empty")

    entities = extract_entities(payload.text)
    return AnalyzeResponse(
        extractedSkills=extracted_skills(payload.text),
        entities=entities,
        readabilityScore=readability_score(payload.text),
    )


@app.post("/semantic-match", response_model=SemanticMatchResponse)
def semantic_match_endpoint(payload: SemanticMatchRequest):
    if not payload.resumeText or not payload.jobDescription:
        raise HTTPException(status_code=422, detail="resumeText and jobDescription are both required")

    score = semantic_match(payload.resumeText, payload.jobDescription)
    return SemanticMatchResponse(semanticJobMatch=score)
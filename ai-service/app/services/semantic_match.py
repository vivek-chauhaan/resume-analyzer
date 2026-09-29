from sentence_transformers import util
from app.models.loader import get_embedding_model


def semantic_match(resume_text: str, job_description: str) -> float:
    """Returns a 0-100 semantic similarity score between resume and job description."""
    model = get_embedding_model()

    embeddings = model.encode([resume_text, job_description], convert_to_tensor=True)
    similarity = util.cos_sim(embeddings[0], embeddings[1]).item()

    # cosine similarity is roughly [-1, 1] in practice usually [0, 1] for this model;
    # clamp before scaling so a rare negative value can't produce a negative score
    clamped = max(0.0, min(1.0, similarity))
    return round(clamped * 100, 2)
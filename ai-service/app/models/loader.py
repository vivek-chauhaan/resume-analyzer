import spacy
from sentence_transformers import SentenceTransformer
from app.config import settings

nlp = None                # holds the loaded spaCy model
embedding_model = None    # holds the loaded SentenceTransformer model


def load_models() -> None:
    """Called once from main.py's @app.on_event("startup").

    Loading these inside a request handler is the #1 perf mistake here —
    each load takes seconds; per-request it would make every analysis crawl.
    """
    global nlp, embedding_model

    print(f"[ai-service] loading spaCy model: {settings.spacy_model} ...")
    nlp = spacy.load(settings.spacy_model)

    print(f"[ai-service] loading embedding model: {settings.model_name} ...")
    embedding_model = SentenceTransformer(settings.model_name)

    print("[ai-service] models loaded.")


def get_nlp():
    if nlp is None:
        raise RuntimeError("spaCy model not loaded — load_models() must run at startup")
    return nlp


def get_embedding_model():
    if embedding_model is None:
        raise RuntimeError("Embedding model not loaded — load_models() must run at startup")
    return embedding_model
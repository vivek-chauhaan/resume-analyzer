import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    port: int = int(os.getenv("PORT", "8001"))
    model_name: str = os.getenv("MODEL_NAME", "all-MiniLM-L6-v2")
    spacy_model: str = os.getenv("SPACY_MODEL", "en_core_web_sm")
    log_level: str = os.getenv("LOG_LEVEL", "info")


settings = Settings()

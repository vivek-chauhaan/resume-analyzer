import pytest
from app.models.loader import load_models


@pytest.fixture(scope="session", autouse=True)
def _load_models_once():
    load_models()
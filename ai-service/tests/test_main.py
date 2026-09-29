from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True
    assert body["data"]["status"] == "ok"


def test_analyze_endpoint_rejects_empty_text():
    response = client.post("/analyze", json={"text": "   "})
    assert response.status_code == 422


def test_analyze_endpoint_returns_expected_shape():
    response = client.post("/analyze", json={"text": "Skilled in Python, React, and AWS."})
    assert response.status_code == 200
    body = response.json()
    assert "extractedSkills" in body
    assert "entities" in body
    assert "readabilityScore" in body


def test_semantic_match_endpoint_requires_both_fields():
    response = client.post("/semantic-match", json={"resumeText": "some text", "jobDescription": ""})
    assert response.status_code == 422


def test_semantic_match_endpoint_returns_a_score():
    response = client.post(
        "/semantic-match",
        json={"resumeText": "Python developer", "jobDescription": "Looking for a Python developer"},
    )
    assert response.status_code == 200
    body = response.json()
    assert 0.0 <= body["semanticJobMatch"] <= 100.0
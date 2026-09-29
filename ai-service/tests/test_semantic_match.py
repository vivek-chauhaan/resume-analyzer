from app.services.semantic_match import semantic_match


def test_identical_text_scores_near_100():
    text = "Experienced software engineer skilled in Python and React."
    score = semantic_match(text, text)
    assert score > 95.0


def test_unrelated_text_scores_lower_than_identical_text():
    resume = "Experienced software engineer skilled in Python, React, and cloud infrastructure."
    unrelated_job = "Seeking a professional chef with expertise in French pastry and baking."
    related_job = "Looking for a backend engineer with Python and cloud experience."

    unrelated_score = semantic_match(resume, unrelated_job)
    related_score = semantic_match(resume, related_job)

    assert related_score > unrelated_score


def test_score_is_within_valid_range():
    score = semantic_match("some resume text", "some job description")
    assert 0.0 <= score <= 100.0
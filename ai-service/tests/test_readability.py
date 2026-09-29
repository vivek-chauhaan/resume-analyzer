from app.services.readability import readability_score


def test_empty_text_returns_zero():
    assert readability_score("") == 0.0
    assert readability_score("   ") == 0.0


def test_simple_text_returns_a_reasonable_score():
    text = "This is a simple sentence. It is easy to read. Short words help."
    score = readability_score(text)
    assert 0.0 <= score <= 100.0
    assert score > 50.0  # short, simple sentences should read as fairly easy


def test_score_is_clamped_to_valid_range():
    # Deliberately dense, jargon-heavy text can push flesch_reading_ease negative
    dense = "Notwithstanding heretofore-mentioned juxtapositional interdependencies. " * 5
    score = readability_score(dense)
    assert 0.0 <= score <= 100.0
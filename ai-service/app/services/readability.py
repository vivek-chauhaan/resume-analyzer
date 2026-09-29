import textstat


def readability_score(text: str) -> float:
    """Returns a 0-100 readability score derived from Flesch Reading Ease.

    Flesch Reading Ease is roughly 0-100 already (higher = easier to read),
    but can go outside that range on very short/unusual text, so we clamp it.
    """
    if not text or not text.strip():
        return 0.0

    raw_score = textstat.flesch_reading_ease(text)
    return round(max(0.0, min(100.0, raw_score)), 2)
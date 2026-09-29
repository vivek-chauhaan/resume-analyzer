from app.models.loader import get_nlp

def extract_entities(text: str) -> dict:
    """Returns organizations and noun phrases found in the resume text.

    - organizations: companies, tools, and platforms spaCy tags as ORG
    - noun_phrases: candidate skill/tech phrases (capped at 30 to keep the
      response small — this is a signal for the frontend chips, not a full dump)
    """
    nlp = get_nlp()
    doc = nlp(text)

    organizations = list({ent.text.strip() for ent in doc.ents if ent.label_ == "ORG"})
    noun_phrases = list({chunk.text.lower().strip() for chunk in doc.noun_chunks})[:30]

    return {
        "organizations": organizations,
        "noun_phrases": noun_phrases,
    }


def extracted_skills(text: str) -> list:
    """Flattened list used directly for aiInsights.extractedSkills on the Express side."""
    entities = extract_entities(text)
    # Noun phrases are the more skill-like signal; orgs are kept separate in `entities`
    return entities["noun_phrases"]
from app.services.skill_extractor import extract_entities, extracted_skills


def test_extract_entities_returns_expected_keys():
    result = extract_entities("I worked at Google using Python and React.")
    assert "organizations" in result
    assert "noun_phrases" in result
    assert isinstance(result["organizations"], list)
    assert isinstance(result["noun_phrases"], list)


def test_noun_phrases_are_capped_at_thirty():
    text = " ".join([f"skill number {i}" for i in range(60)])
    result = extract_entities(text)
    assert len(result["noun_phrases"]) <= 30


def test_extracted_skills_matches_noun_phrases():
    text = "I have strong experience with React and Node.js."
    assert extracted_skills(text) == extract_entities(text)["noun_phrases"]
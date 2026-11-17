from __future__ import annotations

import json
import unittest
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PERSON_ID = "https://augak.github.io/kastineaugak.github.io/#person"


class JsonLdParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self._inside = False
        self._buffer: list[str] = []
        self.blocks: list[dict] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        if tag == "script" and values.get("type") == "application/ld+json":
            self._inside = True
            self._buffer = []

    def handle_data(self, data: str) -> None:
        if self._inside:
            self._buffer.append(data)

    def handle_endtag(self, tag: str) -> None:
        if tag == "script" and self._inside:
            raw = "".join(self._buffer).strip()
            if raw:
                self.blocks.append(json.loads(raw))
            self._inside = False
            self._buffer = []


def read_json_ld(filename: str) -> list[dict]:
    parser = JsonLdParser()
    parser.feed((ROOT / filename).read_text(encoding="utf-8"))
    parser.close()
    # JSON-LD entities may be top-level nodes or members of an @graph.
    entities: list[dict] = []
    for block in parser.blocks:
        graph = block.get("@graph")
        if isinstance(graph, list):
            entities.extend(item for item in graph if isinstance(item, dict))
        else:
            entities.append(block)
    return entities


class PersonalSchemaTests(unittest.TestCase):
    def test_homepage_has_complete_person_entity(self) -> None:
        blocks = read_json_ld("index.html")
        people = [item for item in blocks if item.get("@type") == "Person"]
        self.assertEqual(len(people), 1)
        person = people[0]
        self.assertEqual(person.get("@id"), PERSON_ID)
        self.assertEqual(person.get("name"), "Kastine Augak")
        self.assertIn("Kamulindwa Augustine", person.get("alternateName", []))
        self.assertTrue(person.get("image"))
        self.assertTrue(person.get("jobTitle"))
        self.assertTrue(person.get("knowsAbout"))
        self.assertTrue(person.get("worksFor"))
        self.assertTrue(person.get("sameAs"))
        links = person["sameAs"]
        self.assertEqual(len(links), len(set(links)))
        self.assertTrue(all(link.startswith("https://") for link in links))

    def test_about_profile_references_same_person_entity(self) -> None:
        blocks = read_json_ld("about.html")
        profiles = [item for item in blocks if item.get("@type") == "ProfilePage"]
        self.assertEqual(len(profiles), 1)
        person = profiles[0].get("mainEntity", {})
        self.assertEqual(person.get("@id"), PERSON_ID)

    def test_ventures_page_references_the_canonical_person(self) -> None:
        blocks = read_json_ld("ventures.html")
        pages = [item for item in blocks if item.get("@type") == "CollectionPage"]
        self.assertEqual(len(pages), 1)
        self.assertEqual(pages[0].get("about", {}).get("@id"), PERSON_ID)

    def test_all_json_ld_blocks_are_valid_json(self) -> None:
        for filename in ("index.html", "about.html", "ventures.html"):
            with self.subTest(filename=filename):
                self.assertTrue(read_json_ld(filename))


if __name__ == "__main__":
    unittest.main()

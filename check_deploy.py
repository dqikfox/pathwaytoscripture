#!/usr/bin/env python3
"""Validate the generated static deployment bundle."""

from __future__ import annotations

import json
import re
import sys
import zipfile
from pathlib import Path

BASE = Path(__file__).resolve().parent
OUT = BASE / "godaddy-html"
ZIP = BASE / "godaddy-html-deploy.zip"
PAGES_FILE = BASE / "static_pages.json"
CANONICAL_BASE = "https://pathwaytoscripture.org"
LOCAL_ASSET_PATTERN = re.compile(r"""(?:href|src)=["'](/[^"'#?]+)""")


def fail(message: str) -> None:
    print(f"ERROR: {message}", file=sys.stderr)
    raise SystemExit(1)


def expect(condition: bool, message: str) -> None:
    if not condition:
        fail(message)


def read_text(path: Path) -> str:
    expect(path.exists(), f"Missing file: {path.relative_to(BASE)}")
    return path.read_text(encoding="utf-8")


def main() -> None:
    expect(OUT.exists(), "Missing godaddy-html output directory. Run 'python build_site.py' first.")
    expect(PAGES_FILE.exists(), "Missing static_pages.json. Run 'python build_site.py' first.")
    expect(ZIP.exists(), "Missing godaddy-html-deploy.zip. Run 'python build_site.py' first.")

    pages = json.loads(PAGES_FILE.read_text(encoding="utf-8"))
    zip_entries: set[str] = set()
    with zipfile.ZipFile(ZIP) as zf:
        zip_entries = set(zf.namelist())

    sitemap = read_text(OUT / "sitemap.xml")
    robots = read_text(OUT / "robots.txt")
    manifest = json.loads(read_text(OUT / "manifest.json"))

    expect(manifest.get("start_url") == "/index.html", "manifest.json must keep start_url set to /index.html")
    expect("Sitemap: https://pathwaytoscripture.org/sitemap.xml" in robots, "robots.txt must reference the production sitemap")

    checked_files = 0
    for filename, metadata in pages.items():
        page_path = OUT / filename
        html = read_text(page_path)
        checked_files += 1

        expected_title = f"<title>{metadata['title']} – Pathway to Scripture</title>"
        expected_description = f'<meta name="description" content="{metadata["meta"]}">'
        expected_canonical = f'<link rel="canonical" href="{CANONICAL_BASE}/{filename}">'

        expect(expected_title in html, f"{filename} is missing the expected <title>")
        expect(expected_description in html, f"{filename} is missing the expected meta description")
        expect(expected_canonical in html, f"{filename} is missing the expected canonical URL")
        expect('<script type="application/ld+json">' in html, f"{filename} is missing JSON-LD metadata")
        expect(filename in zip_entries, f"{filename} is missing from godaddy-html-deploy.zip")
        expect(f"<loc>{CANONICAL_BASE}/{filename}</loc>" in sitemap, f"{filename} is missing from sitemap.xml")

        for asset_path in sorted(set(LOCAL_ASSET_PATTERN.findall(html))):
            if asset_path == "/":
                continue
            resolved = OUT / asset_path.lstrip("/")
            expect(resolved.exists(), f"{filename} references missing asset {asset_path}")
            expect(asset_path.lstrip("/") in zip_entries, f"{filename} references {asset_path}, but it is missing from the ZIP")

    print(f"Deployment bundle check passed: {checked_files} pages, manifest, robots, sitemap, and ZIP contents are consistent.")


if __name__ == "__main__":
    main()

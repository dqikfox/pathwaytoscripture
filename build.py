#!/usr/bin/env python3
"""Build static HTML site for Pathway to Scripture."""
import os, zipfile

BASE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(BASE, "godaddy-html")

# Add custom build steps here if content becomes markdown-driven
print(f"Build output directory: {OUT}")
print("Static pages already generated. Run this script after editing content files.")

ZIP = os.path.join(BASE, "godaddy-html-deploy.zip")
if os.path.exists(ZIP):
    os.remove(ZIP)

with zipfile.ZipFile(ZIP, "w", zipfile.ZIP_DEFLATED) as zf:
    for root, dirs, files in os.walk(OUT):
        for fname in files:
            fpath = os.path.join(root, fname)
            arcname = os.path.relpath(fpath, OUT)
            zf.write(fpath, arcname)

print(f"Created {ZIP} ({os.path.getsize(ZIP) / 1024 / 1024:.2f} MB)")

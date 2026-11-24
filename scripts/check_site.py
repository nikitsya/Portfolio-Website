#!/usr/bin/env python3
"""Check local HTML links, assets and fragment identifiers without dependencies."""

import os
import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit


ROOT = Path(__file__).resolve().parents[1]


class Document(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.identifiers = set()
        self.references = []
        self.errors = []
        self.feed(source)
        self.close()

    def handle_starttag(self, tag, attributes):
        attributes = dict(attributes)
        line = self.getpos()[0]
        identifier = attributes.get("id")
        if identifier:
            if identifier in self.identifiers:
                self.errors.append((line, f"Duplicate id: {identifier}"))
            self.identifiers.add(identifier)
        for name in ("href", "src", "data-navigation-src"):
            if attributes.get(name) is not None:
                self.references.append((line, attributes[name]))
        if tag == "object" and attributes.get("data"):
            self.references.append((line, attributes["data"]))


def source_files():
    for directory, folders, files in os.walk(ROOT):
        folders[:] = sorted(name for name in folders
                            if not name.startswith(".") and name != "node_modules")
        for name in sorted(files):
            path = Path(directory) / name
            if path.suffix in {".html", ".css"}:
                yield path


def check_reference(source, reference, documents):
    url = urlsplit(reference)
    if url.scheme or url.netloc:
        return None

    path = unquote(url.path)
    if not path:
        target = source
    elif path.startswith("/"):
        target = ROOT / path.lstrip("/")
    else:
        target = source.parent / path
    target = target.resolve()
    if not target.is_relative_to(ROOT):
        return f"Reference leaves the project folder: {reference}"
    if target.is_dir():
        target /= "index.html"
    if not target.is_file():
        return f"Missing local file: {reference}"

    fragment = unquote(url.fragment).split(":~:text=", 1)[0]
    if fragment and target in documents:
        if fragment not in documents[target].identifiers:
            return f"Missing fragment identifier: {reference}"
    return None


def main():
    files = {path: path.read_text(encoding="utf-8") for path in source_files()}
    documents = {path: Document(text) for path, text in files.items()
                 if path.suffix == ".html"}
    errors = []
    reference_count = 0
    for path, text in files.items():
        if path in documents:
            document = documents[path]
            errors.extend((path, line, message) for line, message in document.errors)
            references = document.references
        else:
            text = re.sub(r"/\*.*?\*/", lambda match: "\n" * match[0].count("\n"),
                          text, flags=re.DOTALL)
            references = [(text.count("\n", 0, match.start()) + 1,
                           match[1].strip().strip("\"'"))
                          for match in re.finditer(r"url\(\s*([^)]*?)\s*\)", text)]
        for line, reference in references:
            message = check_reference(path, reference, documents)
            reference_count += 1
            if message:
                errors.append((path, line, message))

    for path, line, message in errors:
        print(f"{path.relative_to(ROOT)}:{line}: {message}", file=sys.stderr)
    if errors:
        print(f"Found {len(errors)} error(s).", file=sys.stderr)
        return 1
    print(f"Checked {len(documents)} HTML files and {reference_count} references. No errors.")
    return 0


if __name__ == "__main__":
    sys.exit(main())

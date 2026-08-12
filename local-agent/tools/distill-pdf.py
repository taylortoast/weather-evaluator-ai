#!/usr/bin/env python
import argparse
import json
import re
from pathlib import Path


def slug(value):
    text = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return text or "reference"


def extract_pages(pdf_path):
    try:
        import pdfplumber

        with pdfplumber.open(pdf_path) as pdf:
            for index, page in enumerate(pdf.pages, start=1):
                yield index, page.extract_text(x_tolerance=1, y_tolerance=3) or ""
        return
    except Exception as pdfplumber_error:
        try:
            from pypdf import PdfReader

            reader = PdfReader(str(pdf_path))
            for index, page in enumerate(reader.pages, start=1):
                yield index, page.extract_text() or ""
            return
        except Exception as pypdf_error:
            raise SystemExit(
                "Could not extract PDF text. Install pdfplumber or pypdf.\n"
                f"pdfplumber: {pdfplumber_error}\n"
                f"pypdf: {pypdf_error}"
            )


def clean_page(text):
    lines = [re.sub(r"\s+", " ", line).strip() for line in text.splitlines()]
    return "\n".join(line for line in lines if line).strip()


def upsert_manifest(course_dir, item):
    manifest_path = course_dir / "reference-manifest.json"
    try:
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
        if not isinstance(manifest, list):
            manifest = []
    except FileNotFoundError:
        manifest = []
    manifest = [existing for existing in manifest if existing.get("id") != item["id"]]
    manifest.append(item)
    manifest.sort(key=lambda value: value.get("title", "").lower())
    manifest_path.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")


def infer_objective(pdf_path):
    match = re.search(r"(?:obj|objective)[-_ ]*([a-z]?\d+[a-z]?)", pdf_path.stem, re.IGNORECASE)
    return match.group(1).upper() if match else ""


def normalize_objective(value):
    text = (value or "").strip()
    if not text:
        return ""
    return re.sub(r"^([A-Z]?\d+[A-Z]?)\.\s*", r"\1 - ", text, flags=re.IGNORECASE).strip().upper()


def main():
    default_course_dir = Path(__file__).resolve().parents[1] / "course"
    parser = argparse.ArgumentParser(description="Distill a PDF into scoped markdown for the local evaluator.")
    parser.add_argument("pdf", type=Path)
    parser.add_argument("--course-dir", type=Path, default=default_course_dir)
    parser.add_argument("--title")
    parser.add_argument("--id")
    parser.add_argument("--objective", help="Objective code or label, for example 2B or \"2B - Objective title\". If omitted, the tool infers it from names like *-obj-2b.pdf.")
    parser.add_argument("--out", type=Path)
    args = parser.parse_args()

    pdf_path = args.pdf.resolve()
    if not pdf_path.exists():
        raise SystemExit(f"PDF not found: {pdf_path}")

    course_dir = args.course_dir.resolve()
    references_dir = course_dir / "references"
    references_dir.mkdir(parents=True, exist_ok=True)

    reference_id = args.id or slug(pdf_path.stem)
    title = args.title or pdf_path.stem
    objective = normalize_objective(args.objective or infer_objective(pdf_path))
    if not objective:
        raise SystemExit("Objective is required. Pass --objective 2B or use a filename like course-curriculum-text-obj-2b.pdf.")
    out_path = (args.out or references_dir / f"{reference_id}.md").resolve()

    chunks = [f"# {title}", "", f"Source: {pdf_path.name}", ""]
    pages_written = 0
    blank_pages = 0
    for page_number, text in extract_pages(pdf_path):
        cleaned = clean_page(text)
        if not cleaned:
            blank_pages += 1
            continue
        chunks.extend([f"## Page {page_number}", "", cleaned, ""])
        pages_written += 1

    if pages_written == 0:
        raise SystemExit(f"No extractable text found in {pdf_path.name}. OCR may be required.")

    out_path.write_text("\n".join(chunks).rstrip() + "\n", encoding="utf-8")
    upsert_manifest(course_dir, {
        "id": reference_id,
        "title": title,
        "objective": objective,
        "source": pdf_path.name,
        "path": out_path.relative_to(course_dir).as_posix(),
        "pages": pages_written,
        "blankPages": blank_pages
    })
    print(f"Wrote {out_path}")
    print(f"Pages with text: {pages_written}; blank pages skipped: {blank_pages}")


if __name__ == "__main__":
    main()

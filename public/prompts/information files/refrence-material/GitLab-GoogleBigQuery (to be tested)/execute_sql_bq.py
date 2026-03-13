import os
import sys
import subprocess
import re
import logging
from google.cloud import bigquery
from google.api_core.exceptions import BadRequest

# Setup logging
logging.basicConfig(
    filename="executed_sql.log",
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)

BASE_DIR = "vaultspeedcode/"

def get_changed_sql_files(base: str, head: str):
    result = subprocess.run(
        ["git", "diff", "--name-status", f"{base}..{head}"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        check=True,
        text=True,
    )

    files = []
    for line in result.stdout.splitlines():
        parts = line.split("\t")
        if len(parts) >= 2:
            status, filepath = parts[0], parts[1]
            if (
                status in ("A", "M")
                and filepath.endswith(".sql")
                and filepath.startswith(BASE_DIR)
            ):
                files.append(filepath)

    # Keep your ordering logic (DDL first, then by folder depth/name)
    return sorted(files, key=lambda x: (
        0 if "/DDL/" in x else 1,
        x.split("/")[2] if len(x.split("/")) > 2 else "",
        x
    ))

def strip_comments(sql_script: str) -> str:
    sql_script = re.sub(r"/\*.*?\*/", "", sql_script, flags=re.DOTALL)
    sql_script = re.sub(r"--.*", "", sql_script)
    return sql_script.strip()

def is_procedure(sql_script: str) -> bool:
    # BigQuery supports CREATE [OR REPLACE] PROCEDURE. Treat procedures as a single script.
    return re.search(r"CREATE\s+(OR\s+REPLACE\s+)?PROCEDURE\b", sql_script, re.IGNORECASE) is not None

def execute_sql_file(file_path: str, client: bigquery.Client, location: str | None = None):
    with open(file_path, "r", encoding="utf-8") as f:
        sql_script = f.read()

    sql_script = strip_comments(sql_script)
    if not sql_script:
        logging.info(f"Skipping empty SQL after comment stripping: {file_path}")
        return

    logging.info(f"Executing SQL file: {file_path}")

    # Safer for BigQuery: submit the whole file as one script job.
    # This avoids naive splitting issues with procedures / scripting / BEGIN...END blocks.
    try:
        job = client.query(sql_script, location=location)
        job.result()  # wait + raise on error
        logging.info(f"SUCCESS: {file_path} (job_id={job.job_id})")
    except BadRequest as e:
        logging.error(f"FAILED: {file_path}")
        if getattr(e, "errors", None):
            for err in e.errors[:10]:
                logging.error(err)
        raise

def main():
    base = sys.argv[1]
    head = sys.argv[2]

    files = get_changed_sql_files(base, head)
    if not files:
        print("No new or modified SQL files found.")
        return

    project_id = os.environ["GCP_PROJECT_ID"]
    location = os.environ.get("BQ_LOCATION")  # e.g. "EU" or "US"

    client = bigquery.Client(project=project_id)

    for file in files:
        print(f"Executing: {file}")
        execute_sql_file(file, client, location=location)

if __name__ == "__main__":
    main()

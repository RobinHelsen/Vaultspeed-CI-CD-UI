import os
import sys
import subprocess
import re
import logging
import snowflake.connector

# Setup logging
logging.basicConfig(
    filename='executed_sql.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

BASE_DIR = "vaultspeedcode/"

def get_changed_sql_files(base, head):
    result = subprocess.run(
        ["git", "diff", "--name-status", f"{base}..{head}"],
        stdout=subprocess.PIPE,
        check=True,
        text=True
    )
    print(result)
    files = []
    for line in result.stdout.splitlines():
        parts = line.split('\t')
        if len(parts) >= 2:
            status, filepath = parts[0], parts[1]
            if (
                status in ('A', 'M') and
                filepath.endswith(".sql") and
                filepath.startswith(BASE_DIR)
            ):
                files.append(filepath)
    return sorted(files, key=lambda x: (
        0 if "/DDL/" in x else 1,
        x.split("/")[2] if len(x.split("/")) > 2 else "",
        x
    ))

def clean_sql_statements(sql_script):
    sql_script = re.sub(r"/\*.*?\*/", "", sql_script, flags=re.DOTALL)
    sql_script = re.sub(r"--.*", "", sql_script)
    if 'CREATE OR REPLACE PROCEDURE' in sql_script:
        statements = [sql_script]
    else:
       statements = [stmt.strip() for stmt in sql_script.split(';') if stmt.strip()]
    return statements
    
def execute_sql_file(file_path, connection):
    with open(file_path, "r") as file:
        sql_script = file.read()
    statements = clean_sql_statements(sql_script)
    with connection.cursor() as cursor:
        for statement in statements:
            logging.info(f"Executing SQL from {file_path}:\n{statement}\n")
            cursor.execute(statement)

def main():
    base = sys.argv[1]
    head = sys.argv[2]
  
    print(base)
    print(head)
    files = get_changed_sql_files(base, head)
    if not files:
        print("No new or modified SQL files found.")
        return

    ctx = snowflake.connector.connect(
        user=os.environ["SNOWFLAKE_USER"],
        password=os.environ["SNOWFLAKE_PASSWORD"],
        account=os.environ["SNOWFLAKE_ACCOUNT"],
        warehouse=os.environ["SNOWFLAKE_WAREHOUSE"],
        database=os.environ["SNOWFLAKE_DATABASE"],
        schema=os.environ["SNOWFLAKE_SCHEMA"]
    )
    try:
        for file in files:
            print(f"Executing: {file}")
            execute_sql_file(file, ctx)
    finally:
        ctx.close()

if __name__ == "__main__":
    main()
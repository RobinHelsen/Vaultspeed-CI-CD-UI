# BigQuery SQL Deployment via GitLab CI

## Overview

This repository contains a GitLab CI pipeline and a Python script that **automatically deploys changed SQL files to Google BigQuery**.

The deployment process:

* Detects **new or modified `.sql` files** between two Git commits
* Executes only those changed files
* Runs **DDL before non-DDL SQL**
* Stops immediately if any SQL execution fails
* Is designed for **controlled environment deployments** (e.g. `uat`, `prod`)

This approach enables safe, incremental SQL deployments similar to database migration tooling, without re-running unchanged scripts.

---

## How it works

### High-level flow

1. GitLab CI triggers on a branch (e.g. `uat`)
2. The pipeline compares:

   * `$CI_COMMIT_BEFORE_SHA` → previous commit
   * `$CI_COMMIT_SHA` → current commit
3. The Python script:

   * Finds added (`A`) or modified (`M`) `.sql` files
   * Filters to files under `vaultspeedcode/`
   * Sorts them so **DDL runs first**
4. Each SQL file is executed against **Google BigQuery**
5. Execution stops on the first error

---

## SQL file selection logic

Only files that meet **all** of the following criteria are executed:

* File extension is `.sql`
* Git status is **Added** or **Modified**
* File path starts with:

```text
vaultspeedcode/
```

### Execution order

Files are sorted to ensure correct dependency handling:

1. Files in a `/DDL/` folder are executed first
2. Then remaining files
3. Secondary sorting by folder depth and filename

This allows tables, views, and procedures to exist before dependent objects are deployed.

---

## SQL execution behavior

* SQL comments (`--` and `/* */`) are stripped before execution
* Each SQL file is submitted to BigQuery as **one script job**
* This supports:

  * DDL
  * DML
  * `CREATE OR REPLACE PROCEDURE`
  * BigQuery scripting (`BEGIN … END`)

If BigQuery returns any error, the pipeline fails immediately.

---

## Repository structure (example)

```text
.
├── execute_sql_bq.py
├── requirements.txt
├── .gitlab-ci.yml
├── vaultspeedcode/
│   ├── DDL/
│   │   └── create_tables.sql
│   ├── views/
│   │   └── my_view.sql
│   └── procedures/
│       └── my_proc.sql
└── README.md
```

---

## Prerequisites

### 1. Google Cloud service account

Create a service account with at least:

* `BigQuery Job User`
* `BigQuery Data Editor` (or more restrictive, depending on your needs)

Download the **JSON key file**.

---

### 2. GitLab CI/CD variables

In **GitLab → Settings → CI/CD → Variables**, configure the following:

| Variable name              | Description                                   |
| -------------------------- | --------------------------------------------- |
| `GCP_SA_KEY_JSON`          | Full contents of the service account JSON key |
| `GCP_PROJECT_ID`           | Google Cloud project ID                       |
| `BQ_LOCATION` *(optional)* | BigQuery location (`EU` or `US`)              |

**Recommendations**

* Mark `GCP_SA_KEY_JSON` as **Masked**
* Mark environment-specific variables as **Protected**

---

## Pipeline configuration

### `.gitlab-ci.yml`

The pipeline:

* Runs in a Python container
* Authenticates using `GOOGLE_APPLICATION_CREDENTIALS`
* Executes the Python deployment script

The job is triggered only on the `uat` branch by default:

```yaml
rules:
  - if: '$CI_COMMIT_BRANCH == "uat"'
```

You can duplicate the job for `prod`, `dev`, etc. with different variables.

---

## Running locally (optional)

You can test the script locally if you have:

* Git
* Python 3.10+
* BigQuery access

```bash
export GCP_PROJECT_ID=my-project
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/sa.json

python execute_sql_bq.py <base_commit> <head_commit>
```

Example:

```bash
python execute_sql_bq.py origin/main HEAD
```

---

## Logging

* All executed SQL statements are logged to:

```text
executed_sql.log
```

This file is useful for:

* Auditing
* Debugging failed deployments
* Verifying execution order

---

## Why this approach

This setup provides:

* ✅ Incremental deployments
* ✅ Deterministic execution order
* ✅ Environment-controlled releases
* ✅ Full Git history traceability
* ✅ No external migration framework required

It is especially suitable for:

* Analytics / DWH SQL repositories
* VaultSpeed-generated SQL
* BigQuery-centric data platforms

---

## Extending the solution

Common enhancements:

* Environment-specific datasets via variables
* SQL templating (`${ENV}`, `${DATASET}`)
* Manual approval gates for production
* Dry-run mode using BigQuery job configuration


/**
 * ======================================================================
 * CONFIGURATION FILE — Edit this file to add/remove stack options,
 * enterprise problems, and guideline results.
 * ======================================================================
 *
 * HOW TO ADD A NEW COMBINATION:
 *   1. Add any new option values to the arrays below (dataPlatforms, cicdTools, etc.)
 *   2. Add a new entry in the `guidelines` array with the matching key and your content.
 *   3. The app will pick it up automatically.
 *
 * GUIDELINE MATCHING:
 *   - `key` uses the pattern:  dataPlatform|cicdTool|orchestrationTool
 *   - `problems` is an array of problem IDs this guideline addresses.
 *   - `level` is "beginner" | "intermediate" | "advanced"
 *   - The resolver picks the FIRST guideline whose key + problems + level match.
 *   - A wildcard "*" in any key segment matches everything.
 */

// ─── Dropdown options ────────────────────────────────────────────────
export const dataPlatforms = [
  { value: 'snowflake', label: 'Snowflake' },
  { value: 'databricks', label: 'Databricks' },
  { value: 'bigquery', label: 'Google BigQuery' },
  { value: 'redshift', label: 'Amazon Redshift' },
  { value: 'synapse', label: 'Azure Synapse' },
  { value: 'postgres', label: 'PostgreSQL' },
]

export const cicdTools = [
  { value: 'github', label: 'GitHub Actions' },
  { value: 'gitlab', label: 'GitLab CI/CD' },
  { value: 'azure_devops', label: 'Azure DevOps' },
  { value: 'jenkins', label: 'Jenkins' },
  { value: 'bitbucket', label: 'Bitbucket Pipelines' },
]

export const orchestrationTools = [
  { value: 'airflow', label: 'Apache Airflow' },
  { value: 'prefect', label: 'Prefect' },
  { value: 'dagster', label: 'Dagster' },
  { value: 'adf', label: 'Azure Data Factory' },
  { value: 'step_functions', label: 'AWS Step Functions' },
  { value: 'none', label: 'None / Manual' },
]

// ─── Enterprise problems (checkboxes — user can select multiple) ─────
export const enterpriseProblems = [
  { id: 'multi_env', label: 'Multi-environment promotion (Dev → Staging → Prod)' },
  { id: 'rollback', label: 'Rollback & disaster recovery' },
  { id: 'secrets', label: 'Secrets / credentials management' },
  { id: 'compliance', label: 'Audit & compliance requirements' },
  { id: 'parallel_dev', label: 'Parallel development / branching strategy' },
  { id: 'testing', label: 'Automated testing of data pipelines' },
  { id: 'drift', label: 'Schema drift detection' },
  { id: 'performance', label: 'Performance & cost optimization' },
]

// ─── Experience levels ───────────────────────────────────────────────
export const experienceLevels = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
]

// ─── Guidelines database ────────────────────────────────────────────
// Each entry describes a recommended CI/CD setup.
//
// `key`      : "dataPlatform|cicdTool|orchestrationTool"  — use "*" for wildcard
// `problems` : array of problem IDs this guideline addresses (empty = any)
// `level`    : "beginner" | "intermediate" | "advanced" | "*"
// `title`    : short title shown in the result panel
// `steps`    : array of step strings (rendered as an ordered list)
// `notes`    : optional extra notes shown below the steps
//
export const guidelines = [
  // ── Snowflake + GitHub + Airflow ──────────────────────────────────
  {
    key: 'snowflake|github|airflow',
    problems: [],
    level: '*',
    title: 'Snowflake CI/CD with GitHub Actions & Airflow',
    steps: [
      'Store your VaultSpeed-generated DDL/DML scripts in a GitHub repository, organised by layer (staging, business vault, etc.).',
      'Create a GitHub Actions workflow (.github/workflows/deploy.yml) that triggers on push to main or via manual dispatch.',
      'Use the Snowflake CLI (SnowSQL) inside the workflow to deploy changes to the target Snowflake environment.',
      'Store Snowflake credentials as GitHub Secrets (SNOWFLAKE_ACCOUNT, SNOWFLAKE_USER, SNOWFLAKE_PASSWORD, SNOWFLAKE_ROLE, SNOWFLAKE_WAREHOUSE).',
      'Set up an Airflow DAG that calls VaultSpeed load tasks in dependency order after deployment completes.',
      'Add a post-deployment validation step that runs COUNT(*) / checksum queries to verify data integrity.',
    ],
    notes:
      'For multi-environment promotion, duplicate the workflow with environment-specific secrets (e.g. SNOWFLAKE_ACCOUNT_DEV vs SNOWFLAKE_ACCOUNT_PROD) and use GitHub Environments with approval gates.',
  },

  // ── Snowflake + GitHub — beginner ─────────────────────────────────
  {
    key: 'snowflake|github|*',
    problems: [],
    level: 'beginner',
    title: 'Getting Started: Snowflake + GitHub Actions (Beginner)',
    steps: [
      "Install Git and create a free GitHub account if you don't have one.",
      'Export your VaultSpeed project scripts and push them to a new GitHub repository.',
      'In GitHub, go to Settings → Secrets and add your Snowflake connection details.',
      'Copy the starter workflow template from the VaultSpeed docs into .github/workflows/deploy.yml.',
      'Push a small change and watch the Actions tab — the workflow should deploy it to your Snowflake dev environment.',
      'Once comfortable, add a second job in the workflow for your staging/prod environment.',
    ],
    notes:
      'Tip: Start with a single environment and a single VaultSpeed flow group before scaling up.',
  },

  // ── Databricks + GitLab + Airflow ────────────────────────────────
  {
    key: 'databricks|gitlab|airflow',
    problems: [],
    level: '*',
    title: 'Databricks CI/CD with GitLab CI & Airflow',
    steps: [
      'Organise your VaultSpeed-generated notebooks/SQL scripts in a GitLab repository.',
      'Create a .gitlab-ci.yml pipeline with stages: validate → deploy → orchestrate.',
      'Use the Databricks CLI or REST API in the deploy stage to push notebooks/jobs to the target workspace.',
      'Store Databricks tokens and workspace URLs as GitLab CI/CD variables (masked).',
      'Configure an Airflow connection to Databricks using the DatabricksSubmitRunOperator.',
      'Add integration tests that run a small sample load and verify row counts.',
    ],
    notes:
      'Consider Databricks Asset Bundles for declarative deployment of jobs and pipelines.',
  },

  // ── Wildcard fallback: any stack with multi-env problem ───────────
  {
    key: '*|*|*',
    problems: ['multi_env'],
    level: '*',
    title: 'Multi-Environment Promotion Strategy',
    steps: [
      'Define at least three environments: Development, Staging/QA, and Production.',
      'Use separate credentials and connection details per environment, stored as CI/CD secrets.',
      'Implement a branching strategy (e.g. GitFlow or trunk-based) where merges to specific branches trigger deployments to the matching environment.',
      'Add manual approval gates before production deployments.',
      'Generate VaultSpeed code once and promote the same artefacts through each environment to ensure consistency.',
      'Run automated regression tests in Staging before promoting to Production.',
    ],
    notes:
      'This is a general pattern — your specific CI/CD tool and data platform will determine the exact syntax.',
  },

  // ── Wildcard fallback: any stack with rollback problem ────────────
  {
    key: '*|*|*',
    problems: ['rollback'],
    level: '*',
    title: 'Rollback & Disaster Recovery Guideline',
    steps: [
      'Tag every successful deployment in your Git repository (e.g. deploy-2025-01-15-001).',
      'Keep a migration log table in your data platform that records each deployed script and timestamp.',
      "Write a rollback script that can re-apply the previous tagged version's DDL/DML.",
      'Test rollback procedures in a non-production environment at least once per quarter.',
      'Set up alerts for deployment failures so the team can react quickly.',
    ],
    notes:
      'For data-platform-specific rollback (e.g. Snowflake Time Travel, Databricks Delta time travel), add platform-specific steps here.',
  },

  // ── Wildcard fallback: secrets management problem ─────────────────
  {
    key: '*|*|*',
    problems: ['secrets'],
    level: '*',
    title: 'Secrets & Credentials Management Guideline',
    steps: [
      'Never commit credentials to your repository — use .gitignore to exclude config files.',
      "Store secrets in your CI/CD platform's built-in secret store (GitHub Secrets, GitLab CI Variables, Azure DevOps Variable Groups, etc.).",
      'For production workloads, consider a dedicated vault (HashiCorp Vault, AWS Secrets Manager, Azure Key Vault).',
      'Rotate credentials on a regular schedule and after any team member leaves.',
      'Use service accounts / service principals rather than personal credentials for automation.',
    ],
    notes:
      'Audit access to secrets regularly. Most vault solutions offer access logging out of the box.',
  },

  // ── Problem Example 1 (placeholder) ──────────────────────────────
  {
    key: '*|*|*',
    problems: ['compliance'],
    level: '*',
    title: 'Problem Example 1 — Audit & Compliance',
    steps: [
      'Placeholder step 1: Define your compliance framework (SOC 2, GDPR, HIPAA, etc.).',
      'Placeholder step 2: Enable audit logging in your data platform.',
      'Placeholder step 3: Configure your CI/CD pipeline to produce deployment manifests.',
      'Placeholder step 4: Store manifests in an immutable audit trail.',
    ],
    notes:
      "TODO: Fill in with your organisation's specific compliance requirements.",
  },

  // ── Problem Example 2 (placeholder) ──────────────────────────────
  {
    key: '*|*|*',
    problems: ['parallel_dev'],
    level: '*',
    title: 'Problem Example 2 — Parallel Development / Branching',
    steps: [
      'Placeholder step 1: Choose a branching strategy (GitFlow, trunk-based, feature branches).',
      'Placeholder step 2: Configure VaultSpeed project exports per branch.',
      'Placeholder step 3: Set up isolated development environments per branch.',
      "Placeholder step 4: Merge and resolve conflicts using your CI/CD tool's merge pipeline.",
    ],
    notes:
      'TODO: Add detailed branching strategy guidance per CI/CD tool.',
  },

  // ── Problem Example 3 (placeholder) ──────────────────────────────
  {
    key: '*|*|*',
    problems: ['testing'],
    level: '*',
    title: 'Problem Example 3 — Automated Testing',
    steps: [
      'Placeholder step 1: Define test categories (unit, integration, regression, data quality).',
      'Placeholder step 2: Write SQL-based data quality checks.',
      'Placeholder step 3: Integrate checks into your CI/CD pipeline as a test stage.',
      'Placeholder step 4: Block production deployment if tests fail.',
    ],
    notes:
      'TODO: Add platform-specific testing frameworks (dbt tests, Great Expectations, etc.).',
  },

  // ── Problem Example 4 (placeholder) ──────────────────────────────
  {
    key: '*|*|*',
    problems: ['drift'],
    level: '*',
    title: 'Problem Example 4 — Schema Drift Detection',
    steps: [
      'Placeholder step 1: Capture expected schema as a baseline snapshot.',
      'Placeholder step 2: Before each deployment, diff current schema against baseline.',
      'Placeholder step 3: Alert or block if unexpected drift is detected.',
      'Placeholder step 4: Update baseline after intentional schema changes.',
    ],
    notes:
      'TODO: Add tooling recommendations per data platform.',
  },

  // ── Problem Example 5 (placeholder) ──────────────────────────────
  {
    key: '*|*|*',
    problems: ['performance'],
    level: '*',
    title: 'Problem Example 5 — Performance & Cost Optimization',
    steps: [
      'Placeholder step 1: Establish baseline query performance metrics.',
      'Placeholder step 2: Add warehouse/cluster sizing recommendations to your deployment config.',
      'Placeholder step 3: Monitor query costs post-deployment.',
      'Placeholder step 4: Auto-scale or schedule compute resources based on workload patterns.',
    ],
    notes:
      'TODO: Add data-platform-specific cost optimization techniques.',
  },

  // ── Ultimate fallback ─────────────────────────────────────────────
  {
    key: '*|*|*',
    problems: [],
    level: '*',
    title: 'General CI/CD Setup Guideline',
    steps: [
      'Export your VaultSpeed-generated scripts (DDL, DML, orchestration) into a version-controlled repository.',
      'Configure your CI/CD tool to detect changes in the repository and trigger a deployment pipeline.',
      'Structure your pipeline into stages: Validate → Deploy → Test → Promote.',
      "Store all credentials in your CI/CD tool's secret management system.",
      'If using an orchestration tool, trigger data loads after successful deployment.',
      'Add notifications (Slack, email, Teams) for pipeline success and failure.',
    ],
    notes:
      'This is a generic guideline. Select a more specific data platform, CI/CD tool, and orchestration tool above for tailored recommendations.',
  },
]

// ─── Stack Rankings ──────────────────────────────────────────────────
// Used in "Search best stack" mode.
// Each entry is a stack combination with a numeric score per problem.
// Higher score = better fit. You can later replace scores with real
// feasibility data.
//
// `dataPlatform`, `cicdTool`, `orchestrationTool` — must match values above.
// `problemScores` — object mapping problem IDs to a score (1–10).
//   A missing problem ID means this stack has no opinion on that problem.
//
export const stackRankings = [
  {
    dataPlatform: 'snowflake',
    cicdTool: 'github',
    orchestrationTool: 'airflow',
    problemScores: {
      multi_env: 9,
      rollback: 8,
      secrets: 7,
      compliance: 7,
      parallel_dev: 8,
      testing: 7,
      drift: 6,
      performance: 8,
    },
  },
  {
    dataPlatform: 'snowflake',
    cicdTool: 'azure_devops',
    orchestrationTool: 'adf',
    problemScores: {
      multi_env: 8,
      rollback: 7,
      secrets: 9,
      compliance: 9,
      parallel_dev: 7,
      testing: 6,
      drift: 7,
      performance: 7,
    },
  },
  {
    dataPlatform: 'snowflake',
    cicdTool: 'gitlab',
    orchestrationTool: 'airflow',
    problemScores: {
      multi_env: 8,
      rollback: 7,
      secrets: 8,
      compliance: 7,
      parallel_dev: 9,
      testing: 7,
      drift: 6,
      performance: 7,
    },
  },
  {
    dataPlatform: 'databricks',
    cicdTool: 'github',
    orchestrationTool: 'airflow',
    problemScores: {
      multi_env: 8,
      rollback: 7,
      secrets: 7,
      compliance: 6,
      parallel_dev: 8,
      testing: 8,
      drift: 7,
      performance: 9,
    },
  },
  {
    dataPlatform: 'databricks',
    cicdTool: 'gitlab',
    orchestrationTool: 'dagster',
    problemScores: {
      multi_env: 7,
      rollback: 7,
      secrets: 7,
      compliance: 6,
      parallel_dev: 8,
      testing: 8,
      drift: 8,
      performance: 8,
    },
  },
  {
    dataPlatform: 'databricks',
    cicdTool: 'azure_devops',
    orchestrationTool: 'adf',
    problemScores: {
      multi_env: 8,
      rollback: 6,
      secrets: 9,
      compliance: 8,
      parallel_dev: 7,
      testing: 7,
      drift: 7,
      performance: 8,
    },
  },
  {
    dataPlatform: 'bigquery',
    cicdTool: 'github',
    orchestrationTool: 'airflow',
    problemScores: {
      multi_env: 7,
      rollback: 6,
      secrets: 7,
      compliance: 7,
      parallel_dev: 7,
      testing: 7,
      drift: 6,
      performance: 7,
    },
  },
  {
    dataPlatform: 'redshift',
    cicdTool: 'github',
    orchestrationTool: 'step_functions',
    problemScores: {
      multi_env: 7,
      rollback: 6,
      secrets: 8,
      compliance: 7,
      parallel_dev: 6,
      testing: 6,
      drift: 5,
      performance: 7,
    },
  },
  {
    dataPlatform: 'synapse',
    cicdTool: 'azure_devops',
    orchestrationTool: 'adf',
    problemScores: {
      multi_env: 8,
      rollback: 7,
      secrets: 9,
      compliance: 9,
      parallel_dev: 7,
      testing: 6,
      drift: 7,
      performance: 7,
    },
  },
  {
    dataPlatform: 'postgres',
    cicdTool: 'gitlab',
    orchestrationTool: 'airflow',
    problemScores: {
      multi_env: 6,
      rollback: 7,
      secrets: 6,
      compliance: 5,
      parallel_dev: 7,
      testing: 7,
      drift: 6,
      performance: 5,
    },
  },
  {
    dataPlatform: 'postgres',
    cicdTool: 'jenkins',
    orchestrationTool: 'airflow',
    problemScores: {
      multi_env: 6,
      rollback: 6,
      secrets: 5,
      compliance: 5,
      parallel_dev: 6,
      testing: 6,
      drift: 5,
      performance: 5,
    },
  },
  {
    dataPlatform: 'snowflake',
    cicdTool: 'bitbucket',
    orchestrationTool: 'prefect',
    problemScores: {
      multi_env: 7,
      rollback: 6,
      secrets: 6,
      compliance: 6,
      parallel_dev: 7,
      testing: 7,
      drift: 6,
      performance: 7,
    },
  },
]

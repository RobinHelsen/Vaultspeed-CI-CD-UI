/**
 * ======================================================================
 * CONFIGURATION FILE — Edit this file to add/remove stack options,
 * enterprise constraints, delivery complications, and stack rankings.
 * ======================================================================
 *
 * The AI prompt is assembled from:
 *   1. public/prompts/context.txt  — baseline VaultSpeed product context
 *   2. public/prompts/rules.txt    — generation rules
 *   3. Stack selection from dropdowns below
 *   4. Checked constraints & complications from the arrays below
 *   5. Free-text "Additional context" from the UI
 *
 * Stack rankings (used in "Find best stack" mode) are still configured
 * here — edit the stackRankings array below.
 */

// ─── Dropdown options ────────────────────────────────────────────────
export const dataPlatforms = [
  { value: 'snowflake', label: 'Snowflake' },
  { value: 'databricks', label: 'Databricks' },
  { value: 'bigquery', label: 'Google BigQuery' },
  { value: 'redshift', label: 'Amazon Redshift' },
  { value: 'synapse', label: 'Azure Synapse' },
  { value: 'postgres', label: 'PostgreSQL' },
  { value: 'oracle', label: 'Oracle' },
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

// ─── Enterprise Constraints (checkboxes) ─────────────────────────────
export const enforcedStack = [
  { id: 'must_use_AWS', label: 'Must use AWS' },
  { id: 'must_use_databricks', label: 'Must use Databricks' },
  { id: 'must_use_snowflake', label: 'Must use Snowflake' },
  { id: 'must_use_microsoft', label: 'Must use Microsoft' }
]

export const largeScaleIssues = [
  { id: 'no_bundle_awareness', label: 'No bundle awareness in Git' },
  { id: 'delta_generation_complexity', label: 'Delta generation complexity' },
  { id: 'missing_default_pipelines', label: 'No default CI/CD pipelines' },
  { id: 'deployment_order_dependency_risks', label: 'Deployment order and dependency risks' },
  { id: 'error_handling_gaps', label: 'Error handling gaps' },
  { id: 'fmc_deployment_complexity', label: 'FMC deployment complexity' },
  { id: 'no_custom_code_hooks', label: 'No hooks for custom code' },
  { id: 'dbt_cloud_deployment', label: 'dbt Cloud deployment' },
  { id: 'template_studio_impact', label: 'Template Studio impact' },
]

export const deliveryComplications = [
  { id: 'diff_team_orch', label: 'Different team owns orchestration' },
  { id: 'diff_team_db', label: 'Different team owns database deployment' },
  { id: 'naming_conflicts', label: 'Shared platform with naming conflicts' },
  { id: 'diff_auth_methods', label: 'Multiple environments with different authentication methods' },
  { id: 'no_jdbc', label: 'No direct JDBC deployment allowed' },
  { id: 'git_only_promotion', label: 'Git-only promotion required' },
  { id: 'custom_runner', label: 'Custom deployment runner required' },
]

export const enterpriseConstraints = [
  { id: 'approval_gates', label: 'Manual approval gates required' },
  { id: 'separation_duties', label: 'Separation of duties required' },
  { id: 'prod_restricted', label: 'Production access restricted' },
  { id: 'private_network', label: 'Private networking only' },
  { id: 'external_secrets', label: 'Secrets must remain external' },
  { id: 'audit_trail', label: 'Audit trail required' },
  { id: 'rollback_required', label: 'Rollback required' },
  { id: 'change_window', label: 'Change window required' },
]

// ─── Delivery Complications (checkboxes) ─────────────────────────────


// ─── Stack Rankings ──────────────────────────────────────────────────
// Used in "Search best stack" mode.
// Each entry is a stack combination with a numeric score per problem.
// Higher score = better fit. Problem IDs come from both
// enterpriseConstraints and deliveryComplications above.
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
      approval_gates: 8, separation_duties: 7, prod_restricted: 7, private_network: 5,
      external_secrets: 8, audit_trail: 7, rollback_required: 8, change_window: 6,
      diff_team_orch: 7, diff_team_db: 6, naming_conflicts: 7, diff_auth_methods: 7,
      no_jdbc: 8, git_only_promotion: 9, custom_runner: 7,
    },
  },
  {
    dataPlatform: 'snowflake',
    cicdTool: 'azure_devops',
    orchestrationTool: 'adf',
    problemScores: {
      approval_gates: 9, separation_duties: 9, prod_restricted: 9, private_network: 8,
      external_secrets: 9, audit_trail: 9, rollback_required: 7, change_window: 8,
      diff_team_orch: 6, diff_team_db: 7, naming_conflicts: 7, diff_auth_methods: 8,
      no_jdbc: 7, git_only_promotion: 7, custom_runner: 8,
    },
  },
  {
    dataPlatform: 'snowflake',
    cicdTool: 'gitlab',
    orchestrationTool: 'airflow',
    problemScores: {
      approval_gates: 8, separation_duties: 7, prod_restricted: 7, private_network: 6,
      external_secrets: 8, audit_trail: 7, rollback_required: 7, change_window: 6,
      diff_team_orch: 7, diff_team_db: 6, naming_conflicts: 7, diff_auth_methods: 7,
      no_jdbc: 8, git_only_promotion: 9, custom_runner: 8,
    },
  },
  {
    dataPlatform: 'databricks',
    cicdTool: 'github',
    orchestrationTool: 'airflow',
    problemScores: {
      approval_gates: 8, separation_duties: 7, prod_restricted: 7, private_network: 6,
      external_secrets: 7, audit_trail: 6, rollback_required: 7, change_window: 6,
      diff_team_orch: 7, diff_team_db: 7, naming_conflicts: 6, diff_auth_methods: 7,
      no_jdbc: 9, git_only_promotion: 9, custom_runner: 7,
    },
  },
  {
    dataPlatform: 'databricks',
    cicdTool: 'gitlab',
    orchestrationTool: 'dagster',
    problemScores: {
      approval_gates: 7, separation_duties: 7, prod_restricted: 7, private_network: 6,
      external_secrets: 7, audit_trail: 6, rollback_required: 7, change_window: 6,
      diff_team_orch: 8, diff_team_db: 7, naming_conflicts: 6, diff_auth_methods: 7,
      no_jdbc: 9, git_only_promotion: 9, custom_runner: 8,
    },
  },
  {
    dataPlatform: 'databricks',
    cicdTool: 'azure_devops',
    orchestrationTool: 'adf',
    problemScores: {
      approval_gates: 9, separation_duties: 8, prod_restricted: 8, private_network: 8,
      external_secrets: 9, audit_trail: 8, rollback_required: 6, change_window: 7,
      diff_team_orch: 6, diff_team_db: 7, naming_conflicts: 7, diff_auth_methods: 8,
      no_jdbc: 8, git_only_promotion: 7, custom_runner: 8,
    },
  },
  {
    dataPlatform: 'bigquery',
    cicdTool: 'github',
    orchestrationTool: 'airflow',
    problemScores: {
      approval_gates: 7, separation_duties: 6, prod_restricted: 7, private_network: 5,
      external_secrets: 7, audit_trail: 7, rollback_required: 6, change_window: 5,
      diff_team_orch: 7, diff_team_db: 6, naming_conflicts: 6, diff_auth_methods: 6,
      no_jdbc: 8, git_only_promotion: 8, custom_runner: 6,
    },
  },
  {
    dataPlatform: 'redshift',
    cicdTool: 'github',
    orchestrationTool: 'step_functions',
    problemScores: {
      approval_gates: 7, separation_duties: 7, prod_restricted: 7, private_network: 7,
      external_secrets: 8, audit_trail: 7, rollback_required: 6, change_window: 6,
      diff_team_orch: 5, diff_team_db: 6, naming_conflicts: 5, diff_auth_methods: 7,
      no_jdbc: 7, git_only_promotion: 7, custom_runner: 6,
    },
  },
  {
    dataPlatform: 'synapse',
    cicdTool: 'azure_devops',
    orchestrationTool: 'adf',
    problemScores: {
      approval_gates: 9, separation_duties: 9, prod_restricted: 9, private_network: 9,
      external_secrets: 9, audit_trail: 9, rollback_required: 7, change_window: 8,
      diff_team_orch: 6, diff_team_db: 7, naming_conflicts: 7, diff_auth_methods: 8,
      no_jdbc: 7, git_only_promotion: 7, custom_runner: 8,
    },
  },
  {
    dataPlatform: 'postgres',
    cicdTool: 'gitlab',
    orchestrationTool: 'airflow',
    problemScores: {
      approval_gates: 6, separation_duties: 5, prod_restricted: 6, private_network: 5,
      external_secrets: 6, audit_trail: 5, rollback_required: 7, change_window: 5,
      diff_team_orch: 6, diff_team_db: 6, naming_conflicts: 5, diff_auth_methods: 5,
      no_jdbc: 5, git_only_promotion: 8, custom_runner: 7,
    },
  },
  {
    dataPlatform: 'postgres',
    cicdTool: 'jenkins',
    orchestrationTool: 'airflow',
    problemScores: {
      approval_gates: 6, separation_duties: 5, prod_restricted: 5, private_network: 6,
      external_secrets: 5, audit_trail: 5, rollback_required: 6, change_window: 5,
      diff_team_orch: 6, diff_team_db: 5, naming_conflicts: 5, diff_auth_methods: 5,
      no_jdbc: 5, git_only_promotion: 6, custom_runner: 8,
    },
  },
  {
    dataPlatform: 'snowflake',
    cicdTool: 'bitbucket',
    orchestrationTool: 'prefect',
    problemScores: {
      approval_gates: 7, separation_duties: 6, prod_restricted: 6, private_network: 5,
      external_secrets: 6, audit_trail: 6, rollback_required: 6, change_window: 5,
      diff_team_orch: 7, diff_team_db: 6, naming_conflicts: 6, diff_auth_methods: 6,
      no_jdbc: 7, git_only_promotion: 8, custom_runner: 6,
    },
  },
]

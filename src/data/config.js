/**
 * ======================================================================
 * CONFIGURATION FILE — Edit this file to add/remove stack options,
 * enterprise constraints, delivery complications, and stack rankings.
 * ======================================================================
 *
 * The AI prompt is assembled from:
 *   1. public/prompts/1.general/           — baseline context files (always loaded)
 *   2. public/prompts/2.stackContext/      — stack-specific context (matched by dropdown combo)
 *   3. public/prompts/3.largeScaleIssues/  — selected large-scale issue files
 *   4. public/prompts/4.enterpriseContraints/ — selected enterprise constraint files
 *   5. public/prompts/5.deliveryComplications/ — selected delivery complication files
 *   6. Free-text "Additional context" from the UI
 *
 * Each selectable option has a `promptFile` property that references
 * the .txt file whose content will be included in the assembled prompt.
 *
 * Stack rankings (used in "Find best stack" mode) are still configured
 * here — edit the stackRankings array below.
 */

// ─── General prompt files (always included) ──────────────────────────
export const generalPromptFiles = [
  '/prompts/1.general/1.context_vaultspeed_basics.txt',
  '/prompts/1.general/2.context_vaultspeed_cicd_generator.txt',
  '/prompts/1.general/3.context_vaulspeed_disclaimer.txt',
]

// ─── Dropdown options ────────────────────────────────────────────────
export const dataPlatforms = [
  { value: 'snowflake', label: 'Snowflake' },
  { value: 'databricks', label: 'Databricks' },
  { value: 'google_bigquery', label: 'Google BigQuery' },
  { value: 'amazon_redshift', label: 'Amazon Redshift' },
  { value: 'azure_synapse', label: 'Azure Synapse' },
  { value: 'microsoft_sql_server', label: 'Microsoft SQL Server' },
  { value: 'oracle', label: 'Oracle' },
  { value: 'singlestore', label: 'SingleStore' },
  { value: 'fabric', label: 'Fabric' },
]

export const cicdTools = [
  { value: 'github', label: 'GitHub' },
  { value: 'gitlab', label: 'GitLab' },
  { value: 'azure_devops', label: 'Azure DevOps' },
  { value: 'azure_devops_plus_schemachange', label: 'Azure DevOps + Schemachange' },
  { value: 'google_cloud_build', label: 'Google Cloud Build' },
  { value: 'dataops_live', label: 'DataOps.live' },
  { value: 'git', label: 'Git' },
  { value: 'odi', label: 'ODI' },
  { value: 'other', label: 'Other' },
  { value: 'other_plus_schemachange', label: 'Other + Schemachange' },
  { value: 'no_ci_cd', label: 'No CI/CD' },
  { value: 'unspecified', label: 'Unspecified' },
]

export const orchestrationTools = [
  { value: 'airflow', label: 'Apache Airflow' },
  { value: 'airflow_cloud_composer', label: 'Airflow (Cloud Composer)' },
  { value: 'azure_data_factory', label: 'Azure Data Factory' },
  { value: 'adf_synapse_pipelines', label: 'ADF / Synapse Pipelines' },
  { value: 'native_databricks_plus_airflow', label: 'Native Databricks + Airflow' },
  { value: 'talend', label: 'Talend' },
  { value: 'generic_fmc_snowflake', label: 'Generic FMC (Snowflake)' },
  { value: 'generic_fmc_dbt', label: 'Generic FMC (dbt)' },
  { value: 'custom_fmc', label: 'Custom FMC' },
  { value: 'odi', label: 'ODI' },
  { value: 'other', label: 'Other' },
  { value: 'unspecified', label: 'Unspecified' },
]

// ─── Enforced Stack (checkboxes) ─────────────────────────────────────
export const enforcedStack = [
  { id: 'must_use_AWS', label: 'Must use AWS' },
  { id: 'must_use_databricks', label: 'Must use Databricks' },
  { id: 'must_use_snowflake', label: 'Must use Snowflake' },
  { id: 'must_use_microsoft', label: 'Must use Microsoft' },
]

// ─── Large-Scale Issues (checkboxes) ─────────────────────────────────
export const largeScaleIssues = [
  { id: 'no_bundle_awareness', label: 'No bundle awareness in Git', promptFile: '/prompts/3.largeScaleIssues/1.problem_no_bundle_awareness.txt' },
  { id: 'delta_generation_complexity', label: 'Delta generation complexity', promptFile: '/prompts/3.largeScaleIssues/2.problem_delta_generation_complexity.txt' },
  { id: 'deployment_order_dependency_risks', label: 'Deployment order and dependency risks', promptFile: '/prompts/3.largeScaleIssues/3.problem_deployment_order_dependency_risks.txt' },
  { id: 'error_handling_gaps', label: 'Error handling gaps', promptFile: '/prompts/3.largeScaleIssues/4.problem_error_handling_gaps.txt' },
  { id: 'no_custom_code_hooks', label: 'No hooks for custom code', promptFile: '/prompts/3.largeScaleIssues/5.problem_no_custom_code_hooks.txt' },
  { id: 'fmc_deployment_complexity', label: 'FMC deployment complexity', promptFile: '/prompts/3.largeScaleIssues/6.problem_fmc_deployment_complexity.txt' },
  { id: 'template_studio_impact', label: 'Template Studio impact', promptFile: '/prompts/3.largeScaleIssues/7.problem_template_studio_impact.txt' },
  { id: 'dbt_cloud_deployment', label: 'dbt Cloud deployment', promptFile: '/prompts/3.largeScaleIssues/8.problem_dbt_cloud_deployment.txt' },
]

// ─── Delivery Complications (checkboxes) ─────────────────────────────
export const deliveryComplications = [
  { id: 'diff_team_orch', label: 'Different team owns orchestration', promptFile: '/prompts/5.deliveryComplications/complication_diff_team_orch.txt' },
  { id: 'diff_team_db', label: 'Different team owns database deployment', promptFile: '/prompts/5.deliveryComplications/complication_diff_team_db.txt' },
  { id: 'naming_conflicts', label: 'Shared platform with naming conflicts', promptFile: '/prompts/5.deliveryComplications/complication_naming_conflicts.txt' },
  { id: 'diff_auth_methods', label: 'Multiple environments with different authentication methods', promptFile: '/prompts/5.deliveryComplications/complication_diff_auth_methods.txt' },
  { id: 'no_jdbc', label: 'No direct JDBC deployment allowed', promptFile: '/prompts/5.deliveryComplications/complication_no_jdbc.txt' },
  { id: 'git_only_promotion', label: 'Git-only promotion required', promptFile: '/prompts/5.deliveryComplications/complication_git_only_promotion.txt' },
  { id: 'custom_runner', label: 'Custom deployment runner required', promptFile: '/prompts/5.deliveryComplications/complication_custom_runner.txt' },
]

// ─── Enterprise Constraints (checkboxes) ─────────────────────────────
export const enterpriseConstraints = [
  { id: 'approval_gates', label: 'Manual approval gates required', promptFile: '/prompts/4.enterpriseContraints/constraint_manual_approvals_required.txt' },
  { id: 'separation_duties', label: 'Separation of duties required', promptFile: '/prompts/4.enterpriseContraints/constraint_separation_of_duties_required.txt' },
  { id: 'prod_restricted', label: 'Production access restricted', promptFile: '/prompts/4.enterpriseContraints/constraint_prod_access_restricted.txt' },
  { id: 'private_network', label: 'Private networking only', promptFile: '/prompts/4.enterpriseContraints/constraint_private_network_only.txt' },
  { id: 'external_secrets', label: 'Secrets must remain external', promptFile: '/prompts/4.enterpriseContraints/constraint_external_secrets_required.txt' },
  { id: 'audit_trail', label: 'Audit trail required', promptFile: '/prompts/4.enterpriseContraints/constraint_audit_trail_required.txt' },
  { id: 'change_window', label: 'Change window required', promptFile: '/prompts/4.enterpriseContraints/constraint_change_window_required.txt' },
  { id: 'artifact_repository', label: 'Artifact repository required', promptFile: '/prompts/4.enterpriseContraints/constraint_artifact_repository_required.txt' },
  { id: 'compliance_controls', label: 'Compliance controls required', promptFile: '/prompts/4.enterpriseContraints/constraint_compliance_controls_required.txt' },
  { id: 'customer_managed_keys', label: 'Customer-managed key use', promptFile: '/prompts/4.enterpriseContraints/constraint_customer_managed_key_use.txt' },
  { id: 'drift_detection', label: 'Drift detection required', promptFile: '/prompts/4.enterpriseContraints/constraint_drift_detection_required.txt' },
  { id: 'environment_separation', label: 'Environment separation required', promptFile: '/prompts/4.enterpriseContraints/constraint_environment_separation_required.txt' },
  { id: 'external_identity', label: 'External identity required', promptFile: '/prompts/4.enterpriseContraints/constraint_external_identity_required.txt' },
  { id: 'gitops', label: 'GitOps required', promptFile: '/prompts/4.enterpriseContraints/constraint_gitops_required.txt' },
  { id: 'immutable_artifacts', label: 'Immutable artifacts required', promptFile: '/prompts/4.enterpriseContraints/constraint_immutable_artifacts_required.txt' },
  { id: 'least_privilege', label: 'Least privilege required', promptFile: '/prompts/4.enterpriseContraints/constraint_least_privilege_required.txt' },
  { id: 'manual_prod_release', label: 'Manual production release required', promptFile: '/prompts/4.enterpriseContraints/constraint_manual_prod_release_required.txt' },
  { id: 'multi_team_shared_platform', label: 'Multi-team shared platform', promptFile: '/prompts/4.enterpriseContraints/constraint_multi_team_shared_platform.txt' },
  { id: 'no_direct_db_connectivity', label: 'No direct database connectivity', promptFile: '/prompts/4.enterpriseContraints/constraint_no_direct_database_connectivity.txt' },
  { id: 'no_internet_builds', label: 'No internet builds', promptFile: '/prompts/4.enterpriseContraints/constraint_no_internet_builds.txt' },
  { id: 'policy_as_code', label: 'Policy as code required', promptFile: '/prompts/4.enterpriseContraints/constraint_policy_as_code_required.txt' },
  { id: 'retention_controls', label: 'Retention controls required', promptFile: '/prompts/4.enterpriseContraints/constraint_retention_controls_required.txt' },
  { id: 'runner_egress_restricted', label: 'Runner egress restricted', promptFile: '/prompts/4.enterpriseContraints/constraint_runner_egress_restricted.txt' },
  { id: 'self_hosted_runners', label: 'Self-hosted runners required', promptFile: '/prompts/4.enterpriseContraints/constraint_self_hosted_runners_required.txt' },
]


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

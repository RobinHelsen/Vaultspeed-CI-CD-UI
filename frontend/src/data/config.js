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

// ─── Stack Context Combinations (from 2.stackContext filenames) ─────
// Format: "dataPlatform__cicdTool__orchestrationTool"
export const stackContextKeys = [
  'amazon_redshift__unspecified__unspecified',
  'azure_synapse__azure_devops__adf_synapse_pipelines',
  'azure_synapse__azure_devops__azure_data_factory',
  'azure_synapse__github__azure_data_factory',
  'databricks__azure_devops__azure_data_factory',
  'databricks__other__native_databricks_plus_airflow',
  'databricks__unspecified__unspecified',
  'fabric__azure_devops__azure_data_factory',
  'fabric__unspecified__adf',
  'google_bigquery__gitlab__airflow_cloud_composer',
  'google_bigquery__google_cloud_build__airflow',
  'microsoft_sql_server__azure_devops__azure_data_factory',
  'microsoft_sql_server__github__azure_data_factory',
  'microsoft_sql_server__no_ci_cd__talend',
  'microsoft_sql_server__unspecified__airflow',
  'microsoft_sql_server__unspecified__unspecified',
  'oracle__git__talend',
  'oracle__github__airflow',
  'oracle__odi__odi',
  'singlestore__github__airflow',
  'snowflake__azure_devops__azure_data_factory',
  'snowflake__azure_devops__talend',
  'snowflake__azure_devops_plus_schemachange__airflow',
  'snowflake__dataops_live__other',
  'snowflake__github__azure_data_factory',
  'snowflake__github__generic_fmc_snowflake',
  'snowflake__github__other',
  'snowflake__gitlab__airflow',
  'snowflake__gitlab__generic_fmc_snowflake',
  'snowflake__no_ci_cd__airflow',
  'snowflake__no_ci_cd__custom_fmc',
  'snowflake__other__other',
  'snowflake__other_plus_schemachange__generic_fmc_dbt',
  'snowflake__unspecified__airflow',
]

// ─── Enforced Stack Parts (checkboxes) ───────────────────────────────
// Users can enforce one or more specific parts of the stack.
// `part` can be: dataPlatform | cicdTool | orchestrationTool
export const enforcedStack = [
  { id: 'enforce_data_amazon_redshift', label: 'Use Amazon Redshift', part: 'dataPlatform', value: 'amazon_redshift' },
  { id: 'enforce_data_snowflake', label: 'Use Snowflake', part: 'dataPlatform', value: 'snowflake' },
  { id: 'enforce_data_databricks', label: 'Use Databricks', part: 'dataPlatform', value: 'databricks' },
  { id: 'enforce_data_google_bigquery', label: 'Use Google BigQuery', part: 'dataPlatform', value: 'google_bigquery' },
  { id: 'enforce_data_azure_synapse', label: 'Use Azure Synapse', part: 'dataPlatform', value: 'azure_synapse' },
  { id: 'enforce_data_sql_server', label: 'Use Microsoft SQL Server', part: 'dataPlatform', value: 'microsoft_sql_server' },
  { id: 'enforce_data_oracle', label: 'Use Oracle', part: 'dataPlatform', value: 'oracle' },
  { id: 'enforce_data_singlestore', label: 'Use SingleStore', part: 'dataPlatform', value: 'singlestore' },
  { id: 'enforce_data_fabric', label: 'Use Fabric', part: 'dataPlatform', value: 'fabric' },

  { id: 'enforce_cicd_github', label: 'Use GitHub', part: 'cicdTool', value: 'github' },
  { id: 'enforce_cicd_gitlab', label: 'Use GitLab', part: 'cicdTool', value: 'gitlab' },
  { id: 'enforce_cicd_google_cloud_build', label: 'Use Google Cloud Build', part: 'cicdTool', value: 'google_cloud_build' },
  { id: 'enforce_cicd_azure_devops', label: 'Use Azure DevOps', part: 'cicdTool', value: 'azure_devops' },
  { id: 'enforce_cicd_azure_devops_plus_schemachange', label: 'Use Azure DevOps + Schemachange', part: 'cicdTool', value: 'azure_devops_plus_schemachange' },
  { id: 'enforce_cicd_dataops_live', label: 'Use DataOps.live', part: 'cicdTool', value: 'dataops_live' },
  { id: 'enforce_cicd_git', label: 'Use Git', part: 'cicdTool', value: 'git' },
  { id: 'enforce_cicd_odi', label: 'Use ODI', part: 'cicdTool', value: 'odi' },
  { id: 'enforce_cicd_no_ci_cd', label: 'Use No CI/CD', part: 'cicdTool', value: 'no_ci_cd' },
  { id: 'enforce_cicd_other', label: 'Use Other CI/CD', part: 'cicdTool', value: 'other' },
  { id: 'enforce_cicd_other_plus_schemachange', label: 'Use Other + Schemachange', part: 'cicdTool', value: 'other_plus_schemachange' },

  { id: 'enforce_orch_adf', label: 'Use Azure Data Factory', part: 'orchestrationTool', value: 'azure_data_factory' },
  { id: 'enforce_orch_airflow', label: 'Use Airflow', part: 'orchestrationTool', value: 'airflow' },
  { id: 'enforce_orch_talend', label: 'Use Talend', part: 'orchestrationTool', value: 'talend' },
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
  { id: 'diff_team_orch', label: 'Different team owns orchestration', promptFile: '/prompts/5.deliveryComplications/1.complication_diff_team_orch.txt' },
  { id: 'diff_team_db', label: 'Different team owns database deployment', promptFile: '/prompts/5.deliveryComplications/2.complication_diff_team_db.txt' },
  { id: 'naming_conflicts', label: 'Shared platform with naming conflicts', promptFile: '/prompts/5.deliveryComplications/3.complication_naming_conflicts.txt' },
  { id: 'diff_auth_methods', label: 'Multiple environments with different authentication methods', promptFile: '/prompts/5.deliveryComplications/4.complication_diff_auth_methods.txt' },
  { id: 'no_jdbc', label: 'No direct JDBC deployment allowed', promptFile: '/prompts/5.deliveryComplications/5.complication_no_jdbc.txt' },
  { id: 'git_only_promotion', label: 'Git-only promotion required', promptFile: '/prompts/5.deliveryComplications/6.complication_git_only_promotion.txt' },
  { id: 'custom_runner', label: 'Custom deployment runner required', promptFile: '/prompts/5.deliveryComplications/7.complication_custom_runner.txt' },
]

// ─── Performance Priorities (search-only filters) ───────────────────
export const performancePriorities = [
  { id: 'downtime_important', label: 'Downtime is important' },
  { id: 'speed_important', label: 'General speed is important' },
  { id: 'reliability_important', label: 'Reliability is important' },
  { id: 'throughput_important', label: 'High throughput is important' },
  { id: 'fast_pipeline_feedback_important', label: 'Fast pipeline feedback is important' },
  { id: 'high_deployment_frequency_important', label: 'High deployment frequency is important' },
  { id: 'low_query_latency_important', label: 'Low query latency is important' },
  { id: 'scalability_important', label: 'Scalability is important' },
  { id: 'cost_efficiency_important', label: 'Cost efficiency is important' },
]



// ─── Enterprise Constraints (checkboxes) ─────────────────────────────
export const enterpriseConstraints = [
  { id: 'approval_gates', label: 'Manual approval gates required', promptFile: '/prompts/4.enterpriseContraints/1.constraint_manual_approvals_required.txt' },
  { id: 'separation_duties', label: 'Separation of duties required', promptFile: '/prompts/4.enterpriseContraints/2.constraint_separation_of_duties_required.txt' },
  { id: 'prod_restricted', label: 'Production access restricted', promptFile: '/prompts/4.enterpriseContraints/3.constraint_prod_access_restricted.txt' },
  { id: 'private_network', label: 'Private networking only', promptFile: '/prompts/4.enterpriseContraints/4.constraint_private_network_only.txt' },
  { id: 'external_secrets', label: 'Secrets must remain external', promptFile: '/prompts/4.enterpriseContraints/5.constraint_external_secrets_required.txt' },
  { id: 'audit_trail', label: 'Audit trail required', promptFile: '/prompts/4.enterpriseContraints/6.constraint_audit_trail_required.txt' },
  { id: 'change_window', label: 'Change window required', promptFile: '/prompts/4.enterpriseContraints/7.constraint_change_window_required.txt' },
  { id: 'artifact_repository', label: 'Artifact repository required', promptFile: '/prompts/4.enterpriseContraints/8.constraint_artifact_repository_required.txt' },
  { id: 'compliance_controls', label: 'Compliance controls required', promptFile: '/prompts/4.enterpriseContraints/9.constraint_compliance_controls_required.txt' },
  { id: 'customer_managed_keys', label: 'Customer-managed key use', promptFile: '/prompts/4.enterpriseContraints/10.constraint_customer_managed_key_use.txt' },
  { id: 'drift_detection', label: 'Drift detection required', promptFile: '/prompts/4.enterpriseContraints/11.constraint_drift_detection_required.txt' },
  { id: 'environment_separation', label: 'Environment separation required', promptFile: '/prompts/4.enterpriseContraints/12.constraint_environment_separation_required.txt' },
  { id: 'external_identity', label: 'External identity required', promptFile: '/prompts/4.enterpriseContraints/13.constraint_external_identity_required.txt' },
  { id: 'gitops', label: 'GitOps required', promptFile: '/prompts/4.enterpriseContraints/14.constraint_gitops_required.txt' },
  { id: 'immutable_artifacts', label: 'Immutable artifacts required', promptFile: '/prompts/4.enterpriseContraints/15.constraint_immutable_artifacts_required.txt' },
  { id: 'least_privilege', label: 'Least privilege required', promptFile: '/prompts/4.enterpriseContraints/16.constraint_least_privilege_required.txt' },
  { id: 'manual_prod_release', label: 'Manual production release required', promptFile: '/prompts/4.enterpriseContraints/17.constraint_manual_prod_release_required.txt' },
  { id: 'multi_team_shared_platform', label: 'Multi-team shared platform', promptFile: '/prompts/4.enterpriseContraints/18.constraint_multi_team_shared_platform.txt' },
  { id: 'no_direct_db_connectivity', label: 'No direct database connectivity', promptFile: '/prompts/4.enterpriseContraints/19.constraint_no_direct_database_connectivity.txt' },
  { id: 'no_internet_builds', label: 'No internet builds', promptFile: '/prompts/4.enterpriseContraints/20.constraint_no_internet_builds.txt' },
  { id: 'policy_as_code', label: 'Policy as code required', promptFile: '/prompts/4.enterpriseContraints/21.constraint_policy_as_code_required.txt' },
  { id: 'retention_controls', label: 'Retention controls required', promptFile: '/prompts/4.enterpriseContraints/22.constraint_retention_controls_required.txt' },
  { id: 'runner_egress_restricted', label: 'Runner egress restricted', promptFile: '/prompts/4.enterpriseContraints/23.constraint_runner_egress_restricted.txt' },
  { id: 'self_hosted_runners', label: 'Self-hosted runners required', promptFile: '/prompts/4.enterpriseContraints/24.constraint_self_hosted_runners_required.txt' },
]




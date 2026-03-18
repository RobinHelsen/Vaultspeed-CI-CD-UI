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
  { id: 'enforce_data_snowflake', label: 'Use Snowflake', part: 'dataPlatform', value: 'snowflake' },
  { id: 'enforce_data_databricks', label: 'Use Databricks', part: 'dataPlatform', value: 'databricks' },
  { id: 'enforce_data_azure_synapse', label: 'Use Azure Synapse', part: 'dataPlatform', value: 'azure_synapse' },
  { id: 'enforce_data_sql_server', label: 'Use Microsoft SQL Server', part: 'dataPlatform', value: 'microsoft_sql_server' },
  { id: 'enforce_cicd_azure_devops', label: 'Use Azure DevOps', part: 'cicdTool', value: 'azure_devops' },
  { id: 'enforce_cicd_github', label: 'Use GitHub', part: 'cicdTool', value: 'github' },
  { id: 'enforce_cicd_gitlab', label: 'Use GitLab', part: 'cicdTool', value: 'gitlab' },
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


// ─── Stack Rankings ──────────────────────────────────────────────────
// Used in "Search best stack" mode.
// Each entry is a stack combination with a numeric score per problem.
// Higher score = better fit. Problem IDs come from both
// enterpriseConstraints and deliveryComplications above.
//
// Base per-combo scores (sparse by design).
// Key format: "dataPlatform__cicdTool__orchestrationTool"
// This replaces verbose full objects and integrates directly with stackContextKeys.
export const stackRankingBaseByCombo = {
  snowflake__github__airflow: {
    approval_gates: 8,
    separation_duties: 7,
    external_secrets: 8,
    audit_trail: 7,
    no_jdbc: 8,
    git_only_promotion: 9,
  },
  snowflake__azure_devops__azure_data_factory: {
    approval_gates: 9,
    separation_duties: 9,
    private_network: 8,
    audit_trail: 9,
    no_jdbc: 7,
  },
  snowflake__gitlab__airflow: {
    approval_gates: 8,
    separation_duties: 7,
    no_jdbc: 8,
    git_only_promotion: 9,
  },
  databricks__azure_devops__azure_data_factory: {
    approval_gates: 9,
    separation_duties: 8,
    private_network: 8,
    external_secrets: 9,
    custom_runner: 8,
  },
  google_bigquery__gitlab__airflow_cloud_composer: {
    approval_gates: 7,
    separation_duties: 6,
    no_jdbc: 8,
    git_only_promotion: 8,
  },
  azure_synapse__azure_devops__azure_data_factory: {
    approval_gates: 9,
    separation_duties: 9,
    private_network: 9,
    audit_trail: 9,
  },
  microsoft_sql_server__gitlab__airflow: {
    approval_gates: 6,
    separation_duties: 5,
    no_jdbc: 5,
    git_only_promotion: 8,
  },
}

function stackComboKey(stack) {
  return `${stack.dataPlatform}__${stack.cicdTool}__${stack.orchestrationTool}`
}

function clampScore(value) {
  return Math.max(1, Math.min(10, Math.round(value)))
}

function seededScore(comboKey, problemId) {
  // Deterministic pseudo-random score in [4..10] for placeholder tuning.
  let hash = 0
  const seed = `${comboKey}|${problemId}`
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 33 + seed.charCodeAt(i)) % 1000003
  }
  return 4 + (hash % 7)
}

const scoringProblemIds = [
  ...largeScaleIssues.map((x) => x.id),
  ...enterpriseConstraints.map((x) => x.id),
  ...deliveryComplications.map((x) => x.id),
]

// ─── Composable Ranking Model ────────────────────────────────────────
// Final score per problem is built as:
//   legacyBaseOrSeeded + dataPlatformAdjustment + cicdAdjustment + orchestrationAdjustment + comboAdjustment
//
// This lets you tune each variable independently without rewriting entire combo objects.

export const stackRankingAdjustmentsByDataPlatform = {
  snowflake: { git_only_promotion: 1, no_jdbc: 1 },
  databricks: { no_jdbc: 1 },
  azure_synapse: { approval_gates: 1, private_network: 1, separation_duties: 1 },
  microsoft_sql_server: { approval_gates: -1, external_secrets: -1 },
}

export const stackRankingAdjustmentsByCicdTool = {
  github: { git_only_promotion: 1 },
  gitlab: { git_only_promotion: 1 },
  azure_devops: { approval_gates: 1, separation_duties: 1, audit_trail: 1 },
  no_ci_cd: { audit_trail: -2, approval_gates: -2 },
}

export const stackRankingAdjustmentsByOrchestrationTool = {
  airflow: { diff_team_orch: 1 },
  azure_data_factory: { approval_gates: 1, separation_duties: 1 },
  talend: { custom_runner: 1 },
}

// Optional fine-grained per-combination adjustments.
// Key format: "dataPlatform__cicdTool__orchestrationTool"
export const stackRankingAdjustmentsByCombo = {
  snowflake__github__azure_data_factory: { git_only_promotion: 1 },
  azure_synapse__azure_devops__azure_data_factory: { approval_gates: 1, audit_trail: 1 },
}

const baseByCombo = new Map(Object.entries(stackRankingBaseByCombo))

export const stackRankings = stackContextKeys.map((comboKey) => {
  const [dataPlatform, cicdTool, orchestrationTool] = comboKey.split('__')
  const baseScores = baseByCombo.get(comboKey) || {}

  const dataPlatformAdjustments = stackRankingAdjustmentsByDataPlatform[dataPlatform] || {}
  const cicdAdjustments = stackRankingAdjustmentsByCicdTool[cicdTool] || {}
  const orchestrationAdjustments = stackRankingAdjustmentsByOrchestrationTool[orchestrationTool] || {}
  const comboAdjustments = stackRankingAdjustmentsByCombo[comboKey] || {}

  const problemScores = {}
  for (const problemId of scoringProblemIds) {
    const baseScore = baseScores[problemId] ?? seededScore(comboKey, problemId)
    const adjustedScore =
      baseScore +
      (dataPlatformAdjustments[problemId] || 0) +
      (cicdAdjustments[problemId] || 0) +
      (orchestrationAdjustments[problemId] || 0) +
      (comboAdjustments[problemId] || 0)

    problemScores[problemId] = clampScore(adjustedScore)
  }

  return {
    dataPlatform,
    cicdTool,
    orchestrationTool,
    problemScores,
  }
})

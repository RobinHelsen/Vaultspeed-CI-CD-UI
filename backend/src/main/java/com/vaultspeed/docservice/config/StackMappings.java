package com.vaultspeed.docservice.config;

import java.util.Map;

/**
 * Maps each stack element value to a documentation provider and search query.
 * Provider values: "microsoft_learn", "context7", or null (no docs needed).
 */
public final class StackMappings {

    private StackMappings() {}

    public record QueryInfo(String provider, String topic, String query) {}

    // ─── Data Platform mappings ──────────────────────────────────────

    public static final Map<String, QueryInfo> PLATFORM = Map.ofEntries(
            Map.entry("azure_synapse",        new QueryInfo("microsoft_learn", "Azure Synapse Analytics", "Azure Synapse Analytics CI/CD deployment pipelines")),
            Map.entry("microsoft_sql_server",  new QueryInfo("microsoft_learn", "Microsoft SQL Server", "SQL Server database deployment CI/CD DevOps")),
            Map.entry("fabric",               new QueryInfo("microsoft_learn", "Microsoft Fabric", "Microsoft Fabric deployment CI/CD pipelines git integration")),
            Map.entry("snowflake",            new QueryInfo("context7", "Snowflake", "Snowflake CI/CD deployment schemachange database change management")),
            Map.entry("databricks",           new QueryInfo("context7", "Databricks", "Databricks CI/CD deployment workflows asset bundles")),
            Map.entry("google_bigquery",      new QueryInfo("context7", "Google BigQuery", "BigQuery CI/CD deployment dataset management")),
            Map.entry("amazon_redshift",      new QueryInfo("context7", "Amazon Redshift", "Amazon Redshift CI/CD deployment database migrations")),
            Map.entry("oracle",               new QueryInfo("context7", "Oracle Database", "Oracle database CI/CD deployment Liquibase Flyway")),
            Map.entry("singlestore",          new QueryInfo("context7", "SingleStore", "SingleStore CI/CD deployment database pipelines"))
    );

    // ─── CI/CD Tool mappings ─────────────────────────────────────────

    public static final Map<String, QueryInfo> CICD = Map.ofEntries(
            Map.entry("azure_devops",                   new QueryInfo("microsoft_learn", "Azure DevOps Pipelines", "Azure DevOps pipelines YAML CI/CD build release")),
            Map.entry("azure_devops_plus_schemachange",  new QueryInfo("microsoft_learn", "Azure DevOps + Schemachange", "Azure DevOps pipelines schemachange Snowflake database migrations")),
            Map.entry("github",                         new QueryInfo("context7", "GitHub Actions", "GitHub Actions CI/CD workflows database deployment")),
            Map.entry("gitlab",                         new QueryInfo("context7", "GitLab CI/CD", "GitLab CI/CD pipelines database deployment")),
            Map.entry("google_cloud_build",             new QueryInfo("context7", "Google Cloud Build", "Google Cloud Build CI/CD triggers deployment")),
            Map.entry("dataops_live",                   new QueryInfo("context7", "DataOps.live", "DataOps.live Snowflake CI/CD automation")),
            Map.entry("git",                            new QueryInfo("context7", "Git", "Git branching strategy database CI/CD workflow")),
            Map.entry("odi",                            new QueryInfo("context7", "Oracle Data Integrator", "Oracle Data Integrator ODI CI/CD deployment")),
            Map.entry("other",                          new QueryInfo("context7", "CI/CD Tools", "CI/CD pipeline database deployment automation")),
            Map.entry("other_plus_schemachange",        new QueryInfo("context7", "Schemachange", "Schemachange database migration CI/CD"))
    );

    // ─── Orchestration Tool mappings ─────────────────────────────────

    public static final Map<String, QueryInfo> ORCHESTRATION = Map.ofEntries(
            Map.entry("azure_data_factory",             new QueryInfo("microsoft_learn", "Azure Data Factory", "Azure Data Factory CI/CD deployment ARM templates pipelines")),
            Map.entry("adf_synapse_pipelines",          new QueryInfo("microsoft_learn", "ADF / Synapse Pipelines", "Azure Data Factory Synapse pipelines CI/CD deployment")),
            Map.entry("airflow",                        new QueryInfo("context7", "Apache Airflow", "Apache Airflow DAGs CI/CD deployment orchestration")),
            Map.entry("airflow_cloud_composer",         new QueryInfo("context7", "Cloud Composer (Airflow)", "Google Cloud Composer Airflow DAG deployment CI/CD")),
            Map.entry("native_databricks_plus_airflow", new QueryInfo("context7", "Databricks + Airflow", "Databricks Airflow orchestration CI/CD notebooks jobs")),
            Map.entry("talend",                         new QueryInfo("context7", "Talend", "Talend CI/CD deployment job export automation")),
            Map.entry("generic_fmc_snowflake",          new QueryInfo("context7", "Snowflake FMC", "Snowflake stored procedures tasks streams flow management")),
            Map.entry("generic_fmc_dbt",                new QueryInfo("context7", "dbt", "dbt CI/CD deployment models orchestration")),
            Map.entry("odi",                            new QueryInfo("context7", "Oracle Data Integrator", "Oracle Data Integrator ODI orchestration deployment"))
    );
}

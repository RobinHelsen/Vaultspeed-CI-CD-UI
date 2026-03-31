/**
 * Fetches and parses the two CSV matrix files at runtime.
 *
 * Problem matrix:  0 = no issue, 1 = worst issue
 * Performance matrix: 1 = good at it, 0 = lacking
 *
 * Returns structured data keyed by stack combo key (dataPlatform__cicdTool__orchestrationTool).
 */

import { largeScaleIssues, enterpriseConstraints, deliveryComplications, performancePriorities } from './config'

const PROBLEM_CSV_PATH = '/prompts/information files/stack-info/stack problem info matrix.csv'
const PERFORMANCE_CSV_PATH = '/prompts/information files/stack-info/stack performance info matrix.csv'

/**
 * Parse a CSV string into an array of rows (each row is an array of strings).
 */
function parseCsv(text) {
  return text
    .trim()
    .split('\n')
    .map((line) => line.split(',').map((cell) => cell.trim()))
}

/**
 * Convert the human-readable stack name from CSV ("Databricks | Other | Native Databricks + Airflow")
 * into a combo key ("databricks__other__native_databricks_plus_airflow").
 */
function stackNameToComboKey(stackName) {
  const parts = stackName.split('|').map((p) => p.trim())
  if (parts.length !== 3) return null
  return parts
    .map((part) =>
      part
        .toLowerCase()
        .replace(/[()]/g, '')
        .replace(/\s*[\/]\s*/g, '_')
        .replace(/[\s-]+/g, '_')
        .replace(/\+/g, 'plus')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '')
    )
    .join('__')
}

/**
 * Build a mapping from CSV problem column headers to config problem IDs.
 *
 * CSV headers look like:
 *   "LCI - 1A", "LCI - 2B", ... (Large-scale issues — number = file order)
 *   "EC - 1", "EC - 2", ...      (Enterprise constraints)
 *   "DC - 1", "DC - 2", ...      (Delivery complications)
 *
 * The number in the header corresponds to the 1-based index in the config array.
 */
function buildProblemHeaderMap(headers) {
  const map = {}
  for (const header of headers) {
    const lciMatch = header.match(/^LCI\s*-\s*(\d+)/)
    const ecMatch = header.match(/^EC\s*-\s*(\d+)/)
    const dcMatch = header.match(/^DC\s*-\s*(\d+)/)

    if (lciMatch) {
      const idx = parseInt(lciMatch[1], 10) - 1
      if (idx >= 0 && idx < largeScaleIssues.length) {
        map[header] = largeScaleIssues[idx].id
      }
    } else if (ecMatch) {
      const idx = parseInt(ecMatch[1], 10) - 1
      if (idx >= 0 && idx < enterpriseConstraints.length) {
        map[header] = enterpriseConstraints[idx].id
      }
    } else if (dcMatch) {
      const idx = parseInt(dcMatch[1], 10) - 1
      if (idx >= 0 && idx < deliveryComplications.length) {
        map[header] = deliveryComplications[idx].id
      }
    }
  }
  return map
}

/**
 * Load and parse the problem matrix CSV.
 * Returns: { [comboKey]: { [problemId]: number (0-1) } }
 */
async function loadProblemMatrix() {
  const resp = await fetch(PROBLEM_CSV_PATH)
  if (!resp.ok) throw new Error(`Failed to load problem matrix: ${resp.status}`)
  const text = await resp.text()
  const rows = parseCsv(text)
  if (rows.length < 2) return {}

  const headers = rows[0] // #, stack, LCI - 1A, LCI - 2B, ...
  const headerMap = buildProblemHeaderMap(headers.slice(2))
  const dataHeaders = headers.slice(2)

  const result = {}
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i]
    if (row.length < 3) continue
    const stackName = row[1]
    const comboKey = stackNameToComboKey(stackName)
    if (!comboKey) continue

    const scores = {}
    for (let j = 0; j < dataHeaders.length; j++) {
      const problemId = headerMap[dataHeaders[j]]
      if (problemId) {
        scores[problemId] = parseFloat(row[j + 2]) || 0
      }
    }
    result[comboKey] = scores
  }
  return result
}

/**
 * Load and parse the performance matrix CSV.
 * Returns: { [comboKey]: { [performanceId]: number (0-1) } }
 */
async function loadPerformanceMatrix() {
  const resp = await fetch(PERFORMANCE_CSV_PATH)
  if (!resp.ok) throw new Error(`Failed to load performance matrix: ${resp.status}`)
  const text = await resp.text()
  const rows = parseCsv(text)
  if (rows.length < 2) return {}

  const headers = rows[0] // #, stack, downtime_important, speed_important, ...
  const dataHeaders = headers.slice(2)

  // Performance headers already match the performancePriorities IDs directly
  const validIds = new Set(performancePriorities.map((p) => p.id))

  const result = {}
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i]
    if (row.length < 3) continue
    const stackName = row[1]
    const comboKey = stackNameToComboKey(stackName)
    if (!comboKey) continue

    const scores = {}
    for (let j = 0; j < dataHeaders.length; j++) {
      const headerId = dataHeaders[j]
      if (validIds.has(headerId)) {
        scores[headerId] = parseFloat(row[j + 2]) || 0
      }
    }
    result[comboKey] = scores
  }
  return result
}

/**
 * Load both CSV files and return the combined matrix data.
 * Call once at app startup.
 */
export async function loadMatrixData() {
  const [problemMatrix, performanceMatrix] = await Promise.all([
    loadProblemMatrix(),
    loadPerformanceMatrix(),
  ])
  return { problemMatrix, performanceMatrix }
}

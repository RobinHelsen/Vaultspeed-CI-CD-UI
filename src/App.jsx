import { useState, useMemo, useCallback, useEffect } from 'react'
import ModeSelector from './components/ModeSelector'
import Dropdown from './components/Dropdown'
import MultiSelectDropdown from './components/MultiSelectDropdown'
import ExtraInfoInput from './components/ExtraInfoInput'
import GeneratedGuide from './components/GeneratedGuide'
import StackSearchResults from './components/StackSearchResults'
import { dataPlatforms, cicdTools, orchestrationTools, enterpriseConstraints, deliveryComplications, enforcedStack, largeScaleIssues, performancePriorities } from './data/config'
import { resolveStackRankings, getEnforcedFeasibilityError } from './data/stackResolver'
import { generateGuide } from './data/promptBuilder'
import { loadMatrixData } from './data/csvLoader'

export default function App() {
  const [mode, setMode] = useState('') // '' | 'known' | 'search'
  const [dataPlatform, setDataPlatform] = useState('')
  const [cicdTool, setCicdTool] = useState('')
  const [orchestrationTool, setOrchestrationTool] = useState('')
  const [constraints, setConstraints] = useState([])
  const [complications, setComplications] = useState([])
  const [enforced, setEnforced] = useState([])
  const [performanceNeeds, setPerformanceNeeds] = useState([])
  const [largeScale, setLargeScale] = useState([])
  const [extraInfo, setExtraInfo] = useState('')

  // CSV matrix data (loaded once on mount)
  const [matrixData, setMatrixData] = useState({ problemMatrix: {}, performanceMatrix: {} })

  useEffect(() => {
    loadMatrixData().then(setMatrixData).catch((err) => console.error('Failed to load CSV matrices:', err))
  }, [])

  // API result state (shared by both flows) — persisted in localStorage
  const [guideContent, setGuideContent] = useState(() => {
    try { return localStorage.getItem('vs_guideContent') || '' } catch { return '' }
  })
  const [guideLoading, setGuideLoading] = useState(false)
  const [guideError, setGuideError] = useState(() => {
    try { return localStorage.getItem('vs_guideError') || '' } catch { return '' }
  })

  // Persist guide content & error to localStorage whenever they change
  useEffect(() => {
    try {
      if (guideContent) localStorage.setItem('vs_guideContent', guideContent)
      else localStorage.removeItem('vs_guideContent')
    } catch { /* storage unavailable */ }
  }, [guideContent])

  useEffect(() => {
    try {
      if (guideError) localStorage.setItem('vs_guideError', guideError)
      else localStorage.removeItem('vs_guideError')
    } catch { /* storage unavailable */ }
  }, [guideError])

  // Explicit clear action — the only way to discard the cached result
  function clearGuide() {
    setGuideContent('')
    setGuideError('')
  }

  // Merge selected issue groups used by the stack ranker
  const allSelected = useMemo(() => [...largeScale, ...constraints, ...complications], [largeScale, constraints, complications])

  const enforcedError = useMemo(() => getEnforcedFeasibilityError(enforced), [enforced])
  const hasAnySearchFilter = useMemo(
    () => enforced.length > 0 || allSelected.length > 0 || performanceNeeds.length > 0,
    [enforced, allSelected, performanceNeeds]
  )

  // "Find best stack" results (driven by CSV matrix data)
  const stackResults = useMemo(
    () => (enforcedError ? [] : resolveStackRankings(allSelected, enforced, performanceNeeds, matrixData)),
    [allSelected, enforced, performanceNeeds, enforcedError, matrixData]
  )

  const isComplete = dataPlatform && cicdTool && orchestrationTool

  function handleModeChange(newMode) {
    setMode(newMode)
    setDataPlatform('')
    setCicdTool('')
    setOrchestrationTool('')
    setConstraints([])
    setComplications([])
    setEnforced([])
    setPerformanceNeeds([])
    setLargeScale([])
    setExtraInfo('')
  }

  // Shared function to call the prompt builder + Anthropic API — used by both flows
  const callGenerateGuide = useCallback(async (overrides = {}) => {
    const dp = overrides.dataPlatform || dataPlatform
    const ci = overrides.cicdTool || cicdTool
    const orch = overrides.orchestrationTool || orchestrationTool
    const cons = overrides.constraints || constraints
    const comps = overrides.complications || complications
    const ls = overrides.largeScale || largeScale

    setGuideContent('')
    setGuideError('')
    setGuideLoading(true)

    try {
      // Pass dropdown values (used for stack file lookup) and IDs (used for prompt file lookup)
      const content = await generateGuide({
        dataPlatform: dp,
        cicdTool: ci,
        orchestrationTool: orch,
        constraints: cons,
        complications: comps,
        largeScale: ls,
        extraInfo: overrides.extraInfo ?? extraInfo,
      })
      setGuideContent(content)
    } catch (err) {
      setGuideError(err.message)
    } finally {
      setGuideLoading(false)
    }
  }, [dataPlatform, cicdTool, orchestrationTool, constraints, complications, enforced, largeScale, extraInfo])

  return (
    <div className="app">
      <header className="app-header">
        <h1>VaultSpeed CI/CD Setup Guide</h1>
        <p className="subtitle">Configure your stack below and get a tailored CI/CD setup guideline.</p>
      </header>

      <main className="app-main">
        {/* ── Mode selector ─────────────────────────────── */}
        <section className="selector-section">
          <h2>How would you like to start?</h2>
          <ModeSelector mode={mode} onChange={handleModeChange} />
        </section>

        {/* ══════════════════════════════════════════════════
            MODE: "I know my stack"
            ══════════════════════════════════════════════════ */}
        {mode === 'known' && (
          <>
            <section className="selector-section">
              <h2>1. Choose Your Stack</h2>
              <div className="selector-row">
                <Dropdown
                  label="Data Platform"
                  options={dataPlatforms}
                  value={dataPlatform}
                  onChange={setDataPlatform}
                  placeholder="Select data platform..."
                />
                <Dropdown
                  label="CI/CD Tool"
                  options={cicdTools}
                  value={cicdTool}
                  onChange={setCicdTool}
                  placeholder="Select CI/CD tool..."
                />
                <Dropdown
                  label="Orchestration Tool"
                  options={orchestrationTools}
                  value={orchestrationTool}
                  onChange={setOrchestrationTool}
                  placeholder="Select orchestration tool..."
                />
              </div>
            </section>

            <section className="selector-section">
              <h2>2. Large-Scale Issues</h2>
              <MultiSelectDropdown
                label="Select the large-scale issues that apply"
                options={largeScaleIssues}
                selected={largeScale}
                onChange={setLargeScale}
              />
            </section>

            <section className="selector-section">
              <h2>3. Enterprise Constraints</h2>
              <MultiSelectDropdown
                label="Select the constraints that apply"
                options={enterpriseConstraints}
                selected={constraints}
                onChange={setConstraints}
              />
            </section>

            <section className="selector-section">
              <h2>4. Delivery Complications</h2>
              <MultiSelectDropdown
                label="Select the complications that apply"
                options={deliveryComplications}
                selected={complications}
                onChange={setComplications}
              />
            </section>

            <section className="selector-section">
              <h2>5. Other Relevant Context</h2>
              <ExtraInfoInput value={extraInfo} onChange={setExtraInfo} />
            </section>

            <section className="result-section">
              <h2>Generated CI/CD Setup Guide</h2>
              {isComplete && (
                <div className="guide-actions">
                  <button
                    className="generate-button"
                    onClick={() => callGenerateGuide()}
                    disabled={guideLoading}
                  >
                    {guideLoading ? 'Generating...' : 'Generate Guide'}
                  </button>
                  {(guideContent || guideError) && !guideLoading && (
                    <button
                      className="clear-button"
                      onClick={clearGuide}
                    >
                      Clear Prompt
                    </button>
                  )}
                </div>
              )}
              {(guideContent || guideLoading || guideError) ? (
                <>
                  {!isComplete && (guideContent || guideError) && !guideLoading && (
                    <div className="guide-actions">
                      <button
                        className="clear-button"
                        onClick={clearGuide}
                      >
                        Clear Prompt
                      </button>
                    </div>
                  )}
                  <GeneratedGuide content={guideContent} loading={guideLoading} error={guideError} />
                </>
              ) : !isComplete && (
                <div className="result-panel empty">
                  <p>
                    Complete the stack selection above to generate your guide.
                    {!dataPlatform && ' \u2192 Pick a data platform.'}
                    {!cicdTool && ' \u2192 Pick a CI/CD tool.'}
                    {!orchestrationTool && ' \u2192 Pick an orchestration tool.'}
                  </p>
                </div>
              )}
            </section>
          </>
        )}

        {/* ══════════════════════════════════════════════════
            MODE: "Find the best stack"
            ══════════════════════════════════════════════════ */}
        {mode === 'search' && (
          <>
            <section className="selector-section">
              <h2>1. Enforced Stack Parts</h2>
              <MultiSelectDropdown
                label="Select any enforced stack requirements"
                options={enforcedStack}
                selected={enforced}
                onChange={setEnforced}
              />
            </section>

            <section className="selector-section">
              <h2>2. Large-Scale Issues</h2>
              <MultiSelectDropdown
                label="Select the large-scale issues that apply"
                options={largeScaleIssues}
                selected={largeScale}
                onChange={setLargeScale}
              />
            </section>

            <section className="selector-section">
              <h2>3. Enterprise Constraints</h2>
              <MultiSelectDropdown
                label="Select the constraints that apply"
                options={enterpriseConstraints}
                selected={constraints}
                onChange={setConstraints}
              />
            </section>

            <section className="selector-section">
              <h2>4. Delivery Complications</h2>
              <MultiSelectDropdown
                label="Select the complications that apply"
                options={deliveryComplications}
                selected={complications}
                onChange={setComplications}
              />
            </section>

            <section className="selector-section">
              <h2>5. Performance Priorities</h2>
              <MultiSelectDropdown
                label="Select performance priorities for stack filtering"
                options={performancePriorities}
                selected={performanceNeeds}
                onChange={setPerformanceNeeds}
              />
            </section>

            <section className="result-section">
              <h2>Recommended Stacks (Best &rarr; Worst)</h2>
              <p className="hint-text">Use these results to decide your stack, then switch to "I know my stack" to generate the guide.</p>
              <StackSearchResults
                results={stackResults}
                selectedProblems={allSelected}
                emptyMessage={enforcedError || (!hasAnySearchFilter ? 'Select at least one filter to see stack recommendations.' : '')}
              />
            </section>
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>VaultSpeed CI/CD Guide Tool</p>
      </footer>
    </div>
  )
}

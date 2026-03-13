import { useState, useMemo, useCallback } from 'react'
import ModeSelector from './components/ModeSelector'
import Dropdown from './components/Dropdown'
import MultiSelectDropdown from './components/MultiSelectDropdown'
import ExtraInfoInput from './components/ExtraInfoInput'
import GeneratedGuide from './components/GeneratedGuide'
import StackSearchResults from './components/StackSearchResults'
import { dataPlatforms, cicdTools, orchestrationTools, enterpriseConstraints, deliveryComplications, enforcedStack, largeScaleIssues } from './data/config'
import { resolveStackRankings } from './data/stackResolver'
import { generateGuide } from './data/openai'

export default function App() {
  const [mode, setMode] = useState('') // '' | 'known' | 'search'
  const [dataPlatform, setDataPlatform] = useState('')
  const [cicdTool, setCicdTool] = useState('')
  const [orchestrationTool, setOrchestrationTool] = useState('')
  const [constraints, setConstraints] = useState([])
  const [complications, setComplications] = useState([])
  const [enforced, setEnforced] = useState([])
  const [largeScale, setLargeScale] = useState([])
  const [extraInfo, setExtraInfo] = useState('')

  // API result state (shared by both flows)
  const [guideContent, setGuideContent] = useState('')
  const [guideLoading, setGuideLoading] = useState(false)
  const [guideError, setGuideError] = useState('')

  // Merge both checkbox groups for the stack ranker
  const allSelected = useMemo(() => [...constraints, ...complications], [constraints, complications])

  // "Find best stack" results (rankings are still hardcoded)
  const stackResults = useMemo(
    () => resolveStackRankings(allSelected),
    [allSelected]
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
    setLargeScale([])
    setExtraInfo('')
    setGuideContent('')
    setGuideError('')
  }

  // Shared function to call OpenAI — used by both flows
  const callGenerateGuide = useCallback(async (overrides = {}) => {
    const dp = overrides.dataPlatform || dataPlatform
    const ci = overrides.cicdTool || cicdTool
    const orch = overrides.orchestrationTool || orchestrationTool
    const cons = overrides.constraints || constraints
    const comps = overrides.complications || complications
    const enf = overrides.enforced || enforced
    const ls = overrides.largeScale || largeScale

    // Resolve labels for the prompt
    const dpLabel = dataPlatforms.find((o) => o.value === dp)?.label || dp
    const ciLabel = cicdTools.find((o) => o.value === ci)?.label || ci
    const orchLabel = orchestrationTools.find((o) => o.value === orch)?.label || orch
    const constraintLabels = cons.map((id) => enterpriseConstraints.find((c) => c.id === id)?.label || id)
    const complicationLabels = comps.map((id) => deliveryComplications.find((c) => c.id === id)?.label || id)
    const enforcedLabels = enf.map((id) => enforcedStack.find((c) => c.id === id)?.label || id)
    const largeScaleLabels = ls.map((id) => largeScaleIssues.find((c) => c.id === id)?.label || id)

    setGuideContent('')
    setGuideError('')
    setGuideLoading(true)

    try {
      const content = await generateGuide({
        dataPlatform: dpLabel,
        cicdTool: ciLabel,
        orchestrationTool: orchLabel,
        constraints: constraintLabels,
        complications: complicationLabels,
        enforced: enforcedLabels,
        largeScale: largeScaleLabels,
        extraInfo: overrides.extraInfo ?? extraInfo,
      })
      setGuideContent(content)
    } catch (err) {
      setGuideError(err.message)
    } finally {
      setGuideLoading(false)
    }
  }, [dataPlatform, cicdTool, orchestrationTool, constraints, complications, enforced, largeScale, extraInfo])

  // Called when user clicks a stack card in "Find best stack" mode
  function handleStackSelect(stack) {
    setDataPlatform(stack.dataPlatform)
    setCicdTool(stack.cicdTool)
    setOrchestrationTool(stack.orchestrationTool)

    callGenerateGuide({
      dataPlatform: stack.dataPlatform,
      cicdTool: stack.cicdTool,
      orchestrationTool: stack.orchestrationTool,
      constraints,
      complications,
      enforced,
      largeScale,
    })
  }

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
              <h2>2. Enforced Stack</h2>
              <MultiSelectDropdown
                label="Select any enforced stack requirements"
                options={enforcedStack}
                selected={enforced}
                onChange={setEnforced}
              />
            </section>

            <section className="selector-section">
              <h2>3. Large-Scale Issues</h2>
              <MultiSelectDropdown
                label="Select the large-scale issues that apply"
                options={largeScaleIssues}
                selected={largeScale}
                onChange={setLargeScale}
              />
            </section>

            <section className="selector-section">
              <h2>4. Enterprise Constraints</h2>
              <MultiSelectDropdown
                label="Select the constraints that apply"
                options={enterpriseConstraints}
                selected={constraints}
                onChange={setConstraints}
              />
            </section>

            <section className="selector-section">
              <h2>5. Delivery Complications</h2>
              <MultiSelectDropdown
                label="Select the complications that apply"
                options={deliveryComplications}
                selected={complications}
                onChange={setComplications}
              />
            </section>

            <section className="selector-section">
              <h2>6. Other Relevant Context</h2>
              <ExtraInfoInput value={extraInfo} onChange={setExtraInfo} />
            </section>

            <section className="result-section">
              <h2>Generated CI/CD Setup Guide</h2>
              {isComplete ? (
                <>
                  <button
                    className="generate-button"
                    onClick={() => callGenerateGuide()}
                    disabled={guideLoading}
                  >
                    {guideLoading ? 'Generating...' : 'Generate Guide'}
                  </button>
                  <GeneratedGuide content={guideContent} loading={guideLoading} error={guideError} />
                </>
              ) : (
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
              <h2>1. Enforced Stack</h2>
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
              <h2>5. Other Relevant Context</h2>
              <ExtraInfoInput value={extraInfo} onChange={setExtraInfo} />
            </section>

            <section className="result-section">
              <h2>Recommended Stacks (Best &rarr; Worst)</h2>
              <p className="hint-text">Click a stack to generate its CI/CD setup guide.</p>
              <StackSearchResults
                results={stackResults}
                selectedProblems={allSelected}
                onSelectStack={handleStackSelect}
              />
            </section>

            {/* Show generated guide below the stack list once a stack is clicked */}
            {(guideContent || guideLoading || guideError) && (
              <section className="result-section">
                <h2>Generated CI/CD Setup Guide</h2>
                <GeneratedGuide content={guideContent} loading={guideLoading} error={guideError} />
              </section>
            )}
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>VaultSpeed CI/CD Guide Tool</p>
      </footer>
    </div>
  )
}

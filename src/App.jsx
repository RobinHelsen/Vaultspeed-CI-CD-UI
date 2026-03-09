import { useState, useMemo } from 'react'
import ModeSelector from './components/ModeSelector'
import Dropdown from './components/Dropdown'
import MultiSelectDropdown from './components/MultiSelectDropdown'
import LevelSelector from './components/LevelSelector'
import GuidelineResult from './components/GuidelineResult'
import StackSearchResults from './components/StackSearchResults'
import { dataPlatforms, cicdTools, orchestrationTools, enterpriseProblems, experienceLevels } from './data/config'
import { resolveGuidelines } from './data/resolver'
import { resolveStackRankings } from './data/stackResolver'

export default function App() {
  const [mode, setMode] = useState('') // '' | 'known' | 'search'
  const [dataPlatform, setDataPlatform] = useState('')
  const [cicdTool, setCicdTool] = useState('')
  const [orchestrationTool, setOrchestrationTool] = useState('')
  const [problems, setProblems] = useState([])
  const [level, setLevel] = useState('')

  // "I know my stack" results
  const guidelineResults = useMemo(
    () => resolveGuidelines({ dataPlatform, cicdTool, orchestrationTool, problems, level }),
    [dataPlatform, cicdTool, orchestrationTool, problems, level]
  )

  // "Find best stack" results
  const stackResults = useMemo(
    () => resolveStackRankings(problems),
    [problems]
  )

  const isComplete = dataPlatform && cicdTool && orchestrationTool && level

  function handleModeChange(newMode) {
    setMode(newMode)
    // Reset selections when switching modes
    setDataPlatform('')
    setCicdTool('')
    setOrchestrationTool('')
    setProblems([])
    setLevel('')
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
                  placeholder="Select data platform…"
                />
                <Dropdown
                  label="CI/CD Tool"
                  options={cicdTools}
                  value={cicdTool}
                  onChange={setCicdTool}
                  placeholder="Select CI/CD tool…"
                />
                <Dropdown
                  label="Orchestration Tool"
                  options={orchestrationTools}
                  value={orchestrationTool}
                  onChange={setOrchestrationTool}
                  placeholder="Select orchestration tool…"
                />
              </div>
            </section>

            <section className="selector-section">
              <h2>2. Enterprise Problems</h2>
              <MultiSelectDropdown
                label="Select the problems you want addressed"
                options={enterpriseProblems}
                selected={problems}
                onChange={setProblems}
              />
            </section>

            <section className="selector-section">
              <h2>3. Experience Level</h2>
              <LevelSelector
                levels={experienceLevels}
                value={level}
                onChange={setLevel}
              />
            </section>

            <section className="result-section">
              <h2>Recommended CI/CD Setup</h2>
              {isComplete ? (
                <GuidelineResult guidelines={guidelineResults} />
              ) : (
                <div className="result-panel empty">
                  <p>
                    Complete all selections above to generate your guideline.
                    {!dataPlatform && ' → Pick a data platform.'}
                    {!cicdTool && ' → Pick a CI/CD tool.'}
                    {!orchestrationTool && ' → Pick an orchestration tool.'}
                    {!level && ' → Choose your experience level.'}
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
              <h2>1. What problems do you need to solve?</h2>
              <MultiSelectDropdown
                label="Select enterprise problems"
                options={enterpriseProblems}
                selected={problems}
                onChange={setProblems}
              />
            </section>

            <section className="result-section">
              <h2>Recommended Stacks (Best → Worst)</h2>
              <StackSearchResults results={stackResults} selectedProblems={problems} />
            </section>
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>VaultSpeed CI/CD Guide Tool &middot; Customize <code>src/data/config.js</code> to add new stacks, problems, and guidelines.</p>
      </footer>
    </div>
  )
}

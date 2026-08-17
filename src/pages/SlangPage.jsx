import GamesHeader from '../components/GamesHeader'
import BottomStrip from '../components/BottomStrip'

const DEFINITION = `Coffee badging refers to the act or practice of working on-site for a short, perfunctory amount of time, and then returning to work from home. Coffee badge is also used as a verb.`

const EXAMPLE_ONE = `I hear some managers pushing back to office as much more beneficial for productivity and morale than work from home, yet seem to only be able to monitor it through badge scans at office locations, and struggling to respond to the coffee badging.`

const EXAMPLE_TWO = `Amazon cracks down on \`coffee badging' employees by tracking individual hours spent in the office`

function SlangPage() {
  return (
    <div className="slang-page">
      <GamesHeader active="slang" />
      <main className="slang-main">
        <div className="slang-card">
          <h1 className="slang-word">coffee badging</h1>
          <p className="slang-part-of-speech">noun</p>
          <p className="slang-tagline">working on-site for a short time before returning to work from home</p>

          <h2 className="slang-section">What does coffee badging mean?</h2>
          <p className="slang-body">{DEFINITION}</p>

          <h2 className="slang-section">Examples of coffee badging</h2>
          <p className="slang-body">{EXAMPLE_ONE}</p>
          <p className="slang-body">{EXAMPLE_TWO}</p>
        </div>
      </main>
      <BottomStrip />
    </div>
  )
}

export default SlangPage
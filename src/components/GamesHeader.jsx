import { Link } from 'react-router-dom'

function GamesHeader({ active = 'games' }) {
  const isGames = active === 'games'
  const isWotd = active === 'wotd'
  const isGrammar = active === 'grammar'
  const isSlang = active === 'slang'
  return (
    <header className="header games-header">
      <Link to="/" aria-label="Go to home" className="logo-link">
        <img src="/jru-logo.png" alt="JRU Logo" className="logo logo-inline" />
      </Link>

      <div className="header-search">
        <input type="text" placeholder="Look up a word" aria-label="Look up a word" />
        <span className="header-search-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <line x1="16.5" y1="16.5" x2="21" y2="21" />
          </svg>
        </span>
      </div>

      <nav className="nav nav-inline">
        <Link to="/games" className={isGames ? 'nav-pill' : 'nav-link'}>
          Games &amp; Quizzes
        </Link>
        <Link to="/wotd" className={isWotd ? 'nav-pill' : 'nav-link'}>
          Word of the Day
        </Link>
        <Link to="/grammar" className={isGrammar ? 'nav-pill' : 'nav-link'}>
          Grammar
        </Link>
        <Link to="/slang" className={isSlang ? 'nav-pill' : 'nav-link'}>
          Slang
        </Link>
      </nav>

      <Link to="/camera" aria-label="Camera gesture sensor" className="camera-icon-link">
        <img src="/camera-icon.png" alt="Camera" className="camera-icon" />
      </Link>
    </header>
  )
}

export default GamesHeader
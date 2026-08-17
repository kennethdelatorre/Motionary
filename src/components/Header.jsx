import { Link } from "react-router-dom";

const NAV_LEFT = [
  { label: "Games & Quizzes", to: "/games" },
  { label: "Word of the Day", to: "/wotd" },
];
const NAV_RIGHT = [
  { label: "Grammar", to: "/grammar" },
  { label: "Slang", to: "/slang" },
];

function Header() {
  return (
    <header className="header">
      <nav className="nav nav-left">
        {NAV_LEFT.map(({ label, to }) => (
          <Link key={label} to={to} className="nav-link">
            {label}
          </Link>
        ))}
      </nav>

      <Link to="/" aria-label="Go to home" className="logo-link">
        <img src="/jru-logo.png" alt="JRU Logo" className="logo" />
      </Link>

      <nav className="nav nav-right">
        {NAV_RIGHT.map(({ label, to }) => (
          <Link key={label} to={to} className="nav-link">
            {label}
          </Link>
        ))}
      </nav>

      <Link
        to="/camera"
        aria-label="Camera gesture sensor"
        className="camera-icon-link"
      >
        <img src="/camera-icon.png" alt="Camera" className="camera-icon" />
      </Link>
    </header>
  );
}

export default Header;

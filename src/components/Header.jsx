import { Link } from "react-router-dom";

const NAV = [
  { label: "Games & Quizzes", to: "/games" },
  { label: "Word of the Day", to: "/wotd" },
  { label: "Grammar", to: "/grammar" },
  { label: "Slang", to: "/slang" },
];

function Header() {
  return (
    <header className="header">
      <Link to="/" aria-label="Go to home" className="logo-link">
        <img src="/jru-logo.png" alt="JRU Logo" className="logo" />
      </Link>

      <nav className="nav">
        {NAV.map(({ label, to }) => (
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

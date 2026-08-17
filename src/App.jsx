import Header from './components/Header'
import SearchBar from './components/SearchBar'
import TabRow from './components/TabRow'
import './App.css'

function App() {
  return (
    <div className="landing">
      <Header />
      <main className="hero-section">
        <p className="hero-tagline">An Encyclopedia made by Students for Students</p>
        <SearchBar />
        <TabRow />
      </main>
    </div>
  )
}

export default App
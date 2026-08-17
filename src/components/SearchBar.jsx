import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

function SearchBar() {
  const location = useLocation()
  const inputRef = useRef(null)

  useEffect(() => {
    if (location.state && location.state.focusSearch) {
      inputRef.current?.focus()
    }
  }, [location])

  return (
    <div className="searchbar">
      <input ref={inputRef} type="text" placeholder="Look up a word" aria-label="Look up a word" />
    </div>
  )
}

export default SearchBar
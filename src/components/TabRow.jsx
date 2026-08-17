import { useState } from 'react'

const TABS = ['Dictionary', 'TheSaurus', 'AI Search']

function TabRow() {
  const [active, setActive] = useState('Dictionary')

  return (
    <div className="tab-row">
      {TABS.map((label) => (
        <button
          key={label}
          type="button"
          className={`tab${active === label ? ' tab-active' : ''}`}
          onClick={() => setActive(label)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

export default TabRow
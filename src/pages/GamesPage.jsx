import { useCallback, useEffect, useRef, useState } from 'react'
import GamesHeader from '../components/GamesHeader'
import BottomStrip from '../components/BottomStrip'
import { ANSWERS, VALID_GUESSES } from '../data/words'

const WORD_LENGTH = 5
const MAX_ATTEMPTS = 6

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK'],
]

const TILE_COLORS = {
  correct: '#227917',
  present: '#E2AF08',
  absent: '#383838',
  empty: '#383838',
}

const WORDLE_TILES = [
  { letter: 'W', color: '#227917' },
  { letter: 'O', color: '#227917' },
  { letter: 'R', color: '#E2AF08', textColor: '#fff' },
  { letter: 'D', color: '#227917' },
  { letter: 'L', color: '#227917' },
  { letter: 'E', color: '#383838' },
]

function pickAnswer() {
  return ANSWERS[Math.floor(Math.random() * ANSWERS.length)]
}

function evaluateGuess(guess, answer) {
  const result = Array(WORD_LENGTH).fill('absent')
  const answerChars = answer.toUpperCase().split('')
  const used = Array(WORD_LENGTH).fill(false)

  guess.split('').forEach((char, i) => {
    if (answerChars[i] === char) {
      result[i] = 'correct'
      used[i] = true
    }
  })

  guess.split('').forEach((char, i) => {
    if (result[i] === 'correct') return
    const matchIndex = answerChars.findIndex((c, j) => c === char && !used[j])
    if (matchIndex !== -1) {
      result[i] = 'present'
      used[matchIndex] = true
    }
  })

  return result
}

function GamesPage() {
  const [answer, setAnswer] = useState(pickAnswer)
  const [guesses, setGuesses] = useState([])
  const [current, setCurrent] = useState('')
  const [gameOver, setGameOver] = useState(false)
  const [message, setMessage] = useState('')
  const [keyStates, setKeyStates] = useState({})
  const inputRef = useRef(null)

  const resetGame = useCallback(() => {
    setAnswer(pickAnswer())
    setGuesses([])
    setCurrent('')
    setGameOver(false)
    setMessage('')
    setKeyStates({})
  }, [])

  const submitGuess = useCallback(
    (word) => {
      if (gameOver) return
      const guess = word.toUpperCase()
      if (guess.length !== WORD_LENGTH) return
      if (!VALID_GUESSES.has(guess.toLowerCase())) {
        setMessage('Not in the dictionary — try again!')
        return
      }

      const feedback = evaluateGuess(guess, answer)
      const newGuesses = [...guesses, { word: guess, feedback }]
      setGuesses(newGuesses)
      setCurrent('')
      setMessage('')

      const updatedKeys = { ...keyStates }
      guess.split('').forEach((char, i) => {
        const status = feedback[i]
        const rank = { correct: 2, present: 1, absent: 0 }
        if (!updatedKeys[char] || rank[status] > rank[updatedKeys[char]]) {
          updatedKeys[char] = status
        }
      })
      setKeyStates(updatedKeys)

      if (guess === answer.toUpperCase()) {
        setGameOver(true)
        setMessage('You guessed it!')
      } else if (newGuesses.length >= MAX_ATTEMPTS) {
        setGameOver(true)
        setMessage(`The word was ${answer.toUpperCase()}`)
      }
    },
    [answer, gameOver, guesses, keyStates],
  )

  const handleKeyPress = useCallback(
    (key) => {
      if (gameOver) return
      if (key === 'ENTER') {
        submitGuess(current)
      } else if (key === 'BACK' || key === 'Backspace') {
        setCurrent((prev) => prev.slice(0, -1))
      } else if (/^[A-Za-z]$/.test(key)) {
        setCurrent((prev) => (prev.length < WORD_LENGTH ? prev + key.toUpperCase() : prev))
      }
    },
    [current, gameOver, submitGuess],
  )

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Backspace') {
        handleKeyPress('Backspace')
      } else if (event.key === 'Enter') {
        handleKeyPress('ENTER')
      } else if (/^[A-Za-z]$/.test(event.key)) {
        handleKeyPress(event.key)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleKeyPress])

  const renderBoard = () => {
    const rows = []
    for (let r = 0; r < MAX_ATTEMPTS; r += 1) {
      const cells = []
      const isCurrentRow = r === guesses.length && !gameOver
      for (let c = 0; c < WORD_LENGTH; c += 1) {
        let letter = ''
        let state = 'empty'
        if (guesses[r]) {
          letter = guesses[r].word[c]
          state = guesses[r].feedback[c]
        } else if (isCurrentRow && current[c]) {
          letter = current[c]
        }
        const hasFeedback = state === 'correct' || state === 'present' || state === 'absent'
        cells.push(
          <div
            key={c}
            className={`tile tile-${state}${isCurrentRow ? ' tile-current' : ''}`}
            style={{
              backgroundColor: TILE_COLORS[state],
              animationDelay: hasFeedback ? `${c * 0.15}s` : undefined,
            }}
          >
            {letter}
          </div>,
        )
      }
      rows.push(
        <div key={r} className="game-row">
          {cells}
        </div>,
      )
    }
    return rows
  }

  return (
    <div className="games-page">
      <GamesHeader active="games" />
      <main className="games-main">
        <div className="wordle-logo" aria-label="WORDLE">
          {WORDLE_TILES.map((tile) => (
            <span
              key={tile.letter}
              className="wordle-tile"
              style={{ backgroundColor: tile.color, color: tile.textColor }}
            >
              {tile.letter}
            </span>
          ))}
        </div>

        <h1 className="games-title">Guess the Word!</h1>
        <p className="games-subtitle">Get 6 chances to guess a 5-letter word.</p>

        <div className="wordle-board" ref={inputRef}>
          {renderBoard()}
        </div>

        {message && <div className="game-message">{message}</div>}

        {gameOver && (
          <button type="button" className="play-again" onClick={resetGame}>
            Play Again
          </button>
        )}

        <div className="keyboard">
          {KEYBOARD_ROWS.map((row, i) => (
            <div key={i} className="keyboard-row">
              {row.map((key) => {
                const isWide = key === 'ENTER' || key === 'BACK'
                const state = keyStates[key]
                return (
                  <button
                    key={key}
                    type="button"
                    className={`key${isWide ? ' key-wide' : ''}${state ? ` key-${state}` : ''}`}
                    onClick={() => handleKeyPress(key)}
                    style={state ? { backgroundColor: TILE_COLORS[state] } : undefined}
                  >
                    {key === 'BACK' ? '⌫' : key}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </main>
      <BottomStrip />
    </div>
  )
}

export default GamesPage
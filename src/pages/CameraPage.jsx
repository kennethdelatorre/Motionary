import { useEffect, useRef, useState } from 'react'
import GamesHeader from '../components/GamesHeader'
import BottomStrip from '../components/BottomStrip'
import { subscribe, attachVideo, startCamera } from '../lib/cameraSession'

const GESTURE_MAP = [
  { name: '1 finger up', action: 'Games & Quizzes' },
  { name: '2 fingers up', action: 'Word of the Day' },
  { name: '3 fingers up', action: 'Grammar' },
  { name: '4 fingers up', action: 'Slang' },
  { name: 'Open palm (5 fingers)', action: 'Search a word / Home' },
  { name: 'Fist (no fingers)', action: 'Camera page' },
]

function CameraPage() {
  const videoRef = useRef(null)
  const [snapshot, setSnapshot] = useState({ status: 'starting', gesture: '', error: '' })

  useEffect(() => {
    const unsubscribe = subscribe((next) => {
      setSnapshot(next)
      if (videoRef.current) attachVideo(videoRef.current)
    })
    startCamera()
    return unsubscribe
  }, [])

  useEffect(() => {
    if (videoRef.current) attachVideo(videoRef.current)
  }, [])

  const { status, gesture, error } = snapshot

  return (
    <div className="camera-page">
      <GamesHeader active="none" />
      <main className="camera-main">
        <div
          className={`camera-stage${status === 'live' ? ' camera-stage-live' : ''}`}
          style={{
            backgroundImage: status === 'live' ? 'none' : 'url(/camera-backdrop.png)',
          }}
        >
          <div className={`camera-card${status === 'live' ? ' camera-card-live' : ''}`}>
            <video ref={videoRef} className="camera-video" playsInline muted aria-label="Gesture camera feed" />

            {status === 'live' && gesture && <div className="camera-gesture-pill">{gesture}</div>}
          </div>

          {status === 'starting' && (
            <div className="camera-prompt">
              <h1 className="camera-prompt-title">Gesture Search</h1>
              <p className="camera-prompt-text">Starting camera…</p>
            </div>
          )}

          {status === 'error' && (
            <div className="camera-prompt">
              <p className="camera-prompt-text">{error}</p>
              <button type="button" className="camera-enable-btn" onClick={startCamera}>
                Try Again
              </button>
            </div>
          )}
        </div>

        <aside className="camera-panel">
          {status === 'live' && (
            <div className="camera-map">
              <h2 className="camera-map-title">Gestures</h2>
              {GESTURE_MAP.map((item) => (
                <div key={item.name} className="camera-map-row">
                  <span className="camera-map-name">{item.name}</span>
                  <span className="camera-map-action">{item.action}</span>
                </div>
              ))}
            </div>
          )}
        </aside>
      </main>
      <BottomStrip />
    </div>
  )
}

export default CameraPage
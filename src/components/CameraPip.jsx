import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  PAGE_ORDER,
  subscribe,
  attachVideo,
  stopCamera,
  setNavigationHandler,
} from '../lib/cameraSession'

function CameraPip() {
  const location = useLocation()
  const navigate = useNavigate()
  const videoRef = useRef(null)
  const [snapshot, setSnapshot] = useState({ status: 'idle', gesture: '' })

  useEffect(() => {
    const unsubscribe = subscribe((next) => {
      setSnapshot(next)
      if (videoRef.current) attachVideo(videoRef.current)
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    if (videoRef.current) attachVideo(videoRef.current)
  }, [])

  useEffect(() => {
    setNavigationHandler((action) => {
      if (action.type === 'navigate') {
        navigate(action.path, { state: action.focusSearch ? { focusSearch: true } : undefined })
        return
      }
      if (action.type === 'swipe') {
        const currentIndex = PAGE_ORDER.indexOf(location.pathname)
        const base = currentIndex === -1 ? 0 : currentIndex
        const next = PAGE_ORDER[((base + action.dir) % PAGE_ORDER.length + PAGE_ORDER.length) % PAGE_ORDER.length]
        navigate(next)
      }
    })
  }, [location.pathname, navigate])

  const onCameraPage = location.pathname === '/camera'
  if (onCameraPage || snapshot.status !== 'live') return null

  return (
    <div className="camera-pip">
      <video ref={videoRef} className="camera-pip-video" playsInline muted aria-label="Gesture camera preview" />
      {snapshot.gesture && <div className="camera-pip-label">{snapshot.gesture}</div>}
      <button
        type="button"
        className="camera-pip-close"
        aria-label="Stop camera"
        onClick={() => {
          stopCamera()
          setSnapshot({ status: 'idle', gesture: '' })
        }}
      >
        ✕
      </button>
    </div>
  )
}

export default CameraPip
import { initHandLandmarker, detectGesture, detectSwipe, handCenter, countFingers } from './gestures'

export const PAGE_ORDER = ['/', '/games', '/wotd', '/grammar', '/slang']

const FINGER_PAGES = {
  1: '/games',
  2: '/wotd',
  3: '/grammar',
  4: '/slang',
}

const listeners = new Set()
let stream = null
let probeVideo = null
let frameId = null
let landmarker = null
let status = 'idle'
let errorMsg = ''
let gesture = ''
let startAttempted = false
let gestureCooldown = 0
let palmCooldown = 0
let fingerCooldown = 0
let swipePositions = []
let navigationHandler = null

function emit() {
  for (const fn of listeners) {
    fn({ status, gesture, error: errorMsg })
  }
}

export function subscribe(fn) {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}

export function setNavigationHandler(fn) {
  navigationHandler = fn
}

export function attachVideo(el) {
  if (el && stream && el.srcObject !== stream) {
    el.srcObject = stream
    el.play().catch(() => {})
  }
}

export function getStatus() {
  return status
}

export async function startCamera() {
  if (startAttempted) return
  startAttempted = true
  status = 'starting'
  emit()
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user' },
      audio: false,
    })
    probeVideo = document.createElement('video')
    probeVideo.playsInline = true
    probeVideo.muted = true
    probeVideo.srcObject = stream
    await probeVideo.play()
    landmarker = await initHandLandmarker()
    status = 'live'
    emit()
    startLoop()
  } catch (err) {
    startAttempted = false
    status = 'error'
    errorMsg =
      err && err.name === 'NotAllowedError'
        ? 'Camera permission was denied. Please allow camera access and try again.'
        : 'Camera could not be started. Check that a camera is available.'
    emit()
  }
}

export function stopCamera() {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop())
    stream = null
  }
  if (frameId) {
    cancelAnimationFrame(frameId)
    frameId = null
  }
  probeVideo = null
  startAttempted = false
  status = 'idle'
  gesture = ''
  emit()
}

function setGesture(name) {
  if (gesture !== name) {
    gesture = name
    emit()
  }
}

function handleFingers(fingers) {
  const now = performance.now()

  if (fingers >= 5) {
    if (now < gestureCooldown) {
      setGesture('Open palm')
      return
    }
    gestureCooldown = now + 1200
    if (now < palmCooldown) {
      setGesture('Open palm')
      return
    }
    palmCooldown = now + 2500
    setGesture('Open palm')
    navigationHandler?.({ type: 'navigate', path: '/', focusSearch: true })
    return
  }

  if (fingers === 0) {
    if (now < fingerCooldown) {
      setGesture('Fist')
      return
    }
    fingerCooldown = now + 1500
    setGesture('Fist')
    navigationHandler?.({ type: 'navigate', path: '/camera' })
    return
  }

  const path = FINGER_PAGES[fingers]
  if (!path) return

  if (now < fingerCooldown) {
    setGesture(`${fingers} finger${fingers > 1 ? 's' : ''}`)
    return
  }
  fingerCooldown = now + 1500
  setGesture(`${fingers} finger${fingers > 1 ? 's' : ''}`)
  navigationHandler?.({ type: 'navigate', path })
}

function startLoop() {
  let lastVideoTime = -1

  const tick = async () => {
    if (status !== 'live' || !probeVideo) return

    if (probeVideo.currentTime === lastVideoTime) {
      frameId = requestAnimationFrame(tick)
      return
    }
    lastVideoTime = probeVideo.currentTime

    try {
      const results = landmarker.detectForVideo(probeVideo, performance.now())

      if (results.landmarks && results.landmarks.length > 0) {
        const lm = results.landmarks[0]
        const gestureName = detectGesture(lm)

        if (gestureName === 'open_palm') {
          handleFingers(5)
        } else if (gestureName === 'fist') {
          handleFingers(0)
        } else if (gestureName === null) {
          const fingers = countFingers(lm)
          if (fingers >= 1 && fingers <= 4) {
            handleFingers(fingers)
          }
        }

        const center = handCenter(lm)
        swipePositions.push({ x: center.x, y: center.y, t: performance.now() })
        const now = performance.now()
        while (swipePositions.length > 0 && now - swipePositions[0].t > 700) {
          swipePositions.shift()
        }

        const swipe = detectSwipe(swipePositions)
        if (swipe && now > gestureCooldown) {
          gestureCooldown = now + 1500
          navigationHandler?.({ type: 'swipe', dir: swipe === 'swipe_right' ? 1 : -1 })
          swipePositions = []
          setGesture(swipe === 'swipe_right' ? 'Swipe right' : 'Swipe left')
        }
      } else {
        if (gesture !== '') setGesture('')
        swipePositions = []
      }
    } catch {
      status = 'error'
      errorMsg = 'Gesture detection failed to initialize.'
      emit()
    }

    frameId = requestAnimationFrame(tick)
  }

  frameId = requestAnimationFrame(tick)
}
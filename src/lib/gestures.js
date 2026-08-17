import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision'

const WASM_PATH = '/mediapipe/wasm'
const MODEL_PATH = '/mediapipe/hand_landmarker.task'

const NUM_HANDS = 2

let landmarker = null
let loadPromise = null

export async function initHandLandmarker() {
  if (landmarker) return landmarker
  if (!loadPromise) {
    loadPromise = (async () => {
      const filesetResolver = await FilesetResolver.forVisionTasks(WASM_PATH)
      landmarker = await HandLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath: MODEL_PATH,
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numHands: NUM_HANDS,
      })
      return landmarker
    })()
  }
  return loadPromise
}

const FINGERS = [
  { tip: 8, pip: 6 },
  { tip: 12, pip: 10 },
  { tip: 16, pip: 14 },
  { tip: 20, pip: 18 },
]

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

function isExtended(landmarks, tipIndex, pipIndex) {
  return landmarks[tipIndex].y < landmarks[pipIndex].y - 0.02
}

function countExtended(landmarks) {
  let count = 0
  for (const { tip, pip } of FINGERS) {
    if (isExtended(landmarks, tip, pip)) count += 1
  }
  const wrist = landmarks[0]
  const thumbTip = landmarks[4]
  if (Math.abs(thumbTip.x - wrist.x) > Math.abs(thumbTip.y - wrist.y) + 0.03) {
    count += 1
  }
  return count
}

export function countFingers(landmarks) {
  return countExtended(landmarks)
}

export function detectGesture(landmarks) {
  const fingers = countExtended(landmarks)
  if (fingers >= 5) return 'open_palm'
  if (fingers <= 0) return 'fist'
  return null
}

export function handCenter(landmarks) {
  const wrist = landmarks[0]
  const middleMcp = landmarks[9]
  return { x: (wrist.x + middleMcp.x) / 2, y: (wrist.y + middleMcp.y) / 2 }
}

export function detectSwipe(positions) {
  if (positions.length < 3) return null
  const first = positions[0]
  const last = positions[positions.length - 1]
  const dx = last.x - first.x
  if (Math.abs(dx) < 0.25) return null
  return dx > 0 ? 'swipe_right' : 'swipe_left'
}

export { distance }
import { useRef, useEffect, useState } from 'react'

// A simple draw-with-finger-or-mouse signature pad. Produces a PNG data URL
// so the signature is stored as an image alongside the typed name.
export default function SignaturePad({ value, onChange }) {
  const canvasRef = useRef(null)
  const drawing = useRef(false)
  const lastPoint = useRef(null)
  const [hasDrawn, setHasDrawn] = useState(Boolean(value))

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Match the canvas backing store to the display size and pixel density,
    // otherwise the drawn line is blurry or offset from the cursor.
    const ratio = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * ratio
    canvas.height = rect.height * ratio

    const ctx = canvas.getContext('2d')
    ctx.scale(ratio, ratio)
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = '#3E2B1E'

    // Restore an existing signature if one was already captured
    if (value) {
      const img = new Image()
      img.onload = () => ctx.drawImage(img, 0, 0, rect.width, rect.height)
      img.src = value
    }
  }, [])

  const getPoint = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const touch = e.touches?.[0]
    return {
      x: (touch ? touch.clientX : e.clientX) - rect.left,
      y: (touch ? touch.clientY : e.clientY) - rect.top
    }
  }

  const start = (e) => {
    e.preventDefault()
    drawing.current = true
    lastPoint.current = getPoint(e)
  }

  const move = (e) => {
    if (!drawing.current) return
    e.preventDefault()
    const ctx = canvasRef.current.getContext('2d')
    const point = getPoint(e)
    ctx.beginPath()
    ctx.moveTo(lastPoint.current.x, lastPoint.current.y)
    ctx.lineTo(point.x, point.y)
    ctx.stroke()
    lastPoint.current = point
    if (!hasDrawn) setHasDrawn(true)
  }

  const end = () => {
    if (!drawing.current) return
    drawing.current = false
    onChange(canvasRef.current.toDataURL('image/png'))
  }

  const clear = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasDrawn(false)
    onChange('')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="font-mono text-xs tracking-wide text-moss/70">SIGN BELOW</span>
        {hasDrawn && (
          <button type="button" onClick={clear} className="text-xs text-ochre hover:underline">
            Clear signature
          </button>
        )}
      </div>
      <canvas
        ref={canvasRef}
        className="w-full h-40 rounded-md border border-moss/20 bg-linen touch-none cursor-crosshair"
        onMouseDown={start}
        onMouseMove={move}
        onMouseUp={end}
        onMouseLeave={end}
        onTouchStart={start}
        onTouchMove={move}
        onTouchEnd={end}
      />
      {!hasDrawn && (
        <p className="text-xs text-ink/40 italic mt-1">
          Sign with your finger on a phone or tablet, or draw with the mouse.
        </p>
      )}
    </div>
  )
}

"use client"

import type React from "react"

import { useEffect, useState, useRef, useMemo } from "react"

const images = [
  "/assets/1.jpg",
  "/assets/2.jpg",
  "/assets/3.jpg",
  "/assets/4.jpg",
  "/assets/5.jpg",
  "/assets/6.jpg",
  "/assets/7.jpg",
  "/assets/8.jpg",
  "/assets/9.jpg",
  "/assets/10.jpg",
  "/assets/11.jpg",
  "/assets/12.jpg",
  "/assets/13.jpg",
  "/assets/14.jpg",
  "/assets/15.jpg",
  "/assets/16.jpg",
  "/assets/17.jpg",
  "/assets/18.jpg",
  "/assets/19.jpg",
  "/assets/20.jpg",
  "/assets/21.jpg",
]

const Bubble: React.FC<{ size: number; left: string; delay: number; duration: number }> = ({
  size,
  left,
  delay,
  duration,
}) => {
  return (
    <div
      className="absolute rounded-full bg-white/10 backdrop-blur-sm animate-float"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        left,
        bottom: "-100px",
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
    />
  )
}

const PaperAirplane: React.FC<{ delay: number; duration: number; path: number }> = ({ delay, duration, path }) => {
  return (
    <div
      className="absolute animate-fly-around pointer-events-none"
      style={{
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
        left: `${path * 20}%`,
      }}
    >
      <div className="paper-airplane" />
    </div>
  )
}

const FloatingBubble: React.FC<{ size: number; left: string; top: string; delay: number }> = ({
  size,
  left,
  top,
  delay,
}) => {
  return (
    <div
      className="absolute rounded-full border-2 border-white/30 bg-white/5 backdrop-blur-sm animate-bubble-float"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        left,
        top,
        animationDelay: `${delay}s`,
      }}
    >
      <div className="absolute top-2 left-2 w-3 h-3 bg-white/40 rounded-full blur-sm" />
    </div>
  )
}

const Sprinkle: React.FC<{ color: string; left: string; delay: number; duration: number }> = ({
  color,
  left,
  delay,
  duration,
}) => {
  return (
    <div
      className="absolute w-2 h-4 rounded-full animate-sprinkle-fall"
      style={{
        backgroundColor: color,
        left,
        top: "-20px",
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
    />
  )
}

const RotatingSphere: React.FC = () => {
  const [rotationX, setRotationX] = useState(0)
  const [rotationY, setRotationY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const autoRotateRef = useRef<number>(0)
  const mousePositionRef = useRef({ x: 0, y: 0 })

  // responsive sizing: containerSize determines sphere width/height
  const [containerSize, setContainerSize] = useState<number>(600)

  // last touch position for smooth touch drag on mobile
  const lastTouchRef = useRef<{ x: number; y: number } | null>(null)

  // radius and faceSize adapt to the container size
  const radius = Math.max(80, Math.floor(containerSize / 2 - 20))
  const faceSize = Math.max(60, Math.floor(containerSize * 0.22))

  const generateSpherePositions = () => {
    const positions = []
    const numImages = images.length

    const goldenRatio = (1 + Math.sqrt(5)) / 2
    const angleIncrement = Math.PI * 2 * goldenRatio

    for (let i = 0; i < numImages; i++) {
      const t = i / numImages
      const inclination = Math.acos(1 - 2 * t)
      const azimuth = angleIncrement * i

      const x = radius * Math.sin(inclination) * Math.cos(azimuth)
      const y = radius * Math.sin(inclination) * Math.sin(azimuth)
      const z = radius * Math.cos(inclination)

      const rotateY = Math.atan2(x, z) * (180 / Math.PI)
      const rotateX = -Math.asin(y / radius) * (180 / Math.PI)

      positions.push({ x, y, z, rotateX, rotateY })
    }

    return positions
  }

  // recompute positions when radius or images change
  const positions = useMemo(() => generateSpherePositions(), [radius, images.length])

  const handleMouseMove = (e: MouseEvent) => {
    mousePositionRef.current = { x: e.clientX, y: e.clientY }

    if (isDragging) {
      setRotationY((prevY) => prevY + e.movementX * 0.5)
      setRotationX((prevX) => prevX - e.movementY * 0.5)
    }
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (isDragging && e.touches.length > 0) {
      const touch = e.touches[0]
      const last = lastTouchRef.current
      if (last) {
        const dx = touch.clientX - last.x
        const dy = touch.clientY - last.y
        setRotationY((prevY) => prevY + dx * 0.35)
        setRotationX((prevX) => prevX - dy * 0.35)
      }
      lastTouchRef.current = { x: touch.clientX, y: touch.clientY }
    }
  }

  const handleMouseDown = () => {
    setIsDragging(true)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleTouchStart = () => {
    setIsDragging(true)
    // initialize last touch
    lastTouchRef.current = null
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    lastTouchRef.current = null
  }

  useEffect(() => {
    const animate = () => {
      if (!isDragging) {
        setRotationY((prevY) => prevY + 0.3)
      }
      autoRotateRef.current = requestAnimationFrame(animate)
    }

    autoRotateRef.current = requestAnimationFrame(animate)

    return () => {
      if (autoRotateRef.current) {
        cancelAnimationFrame(autoRotateRef.current)
      }
    }
  }, [isDragging])

  // responsive container size: recompute on mount and window resize
  useEffect(() => {
    const computeSize = () => {
      const padding = 48 // page padding
      const max = 600
      const w = typeof window !== "undefined" ? window.innerWidth : max
      // use 90% of width on small screens, cap at max
      const size = Math.min(max, Math.max(200, Math.floor((w - padding) * 0.9)))
      setContainerSize(size)
    }

    computeSize()
    window.addEventListener("resize", computeSize)
    return () => window.removeEventListener("resize", computeSize)
  }, [])

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mouseup", handleMouseUp)
    window.addEventListener("touchstart", handleTouchStart)
    window.addEventListener("touchend", handleTouchEnd)
    window.addEventListener("touchmove", handleTouchMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mouseup", handleMouseUp)
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchend", handleTouchEnd)
      window.removeEventListener("touchmove", handleTouchMove)
    }
  }, [isDragging])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-500 overflow-hidden py-8 relative">
      <PaperAirplane delay={0} duration={20} path={1} />
      <PaperAirplane delay={5} duration={25} path={2} />
      <PaperAirplane delay={10} duration={22} path={3} />
      <PaperAirplane delay={15} duration={24} path={4} />

      <FloatingBubble size={100} left="15%" top="20%" delay={0} />
      <FloatingBubble size={80} left="70%" top="15%" delay={2} />
      <FloatingBubble size={120} left="25%" top="60%" delay={1} />
      <FloatingBubble size={90} left="80%" top="50%" delay={3} />
      <FloatingBubble size={110} left="40%" top="30%" delay={1.5} />
      <FloatingBubble size={70} left="60%" top="70%" delay={2.5} />
      <FloatingBubble size={95} left="10%" top="80%" delay={4} />
      <FloatingBubble size={85} left="90%" top="25%" delay={3.5} />

      <Sprinkle color="#FF6B9D" left="10%" delay={0} duration={3} />
      <Sprinkle color="#FFC93C" left="20%" delay={0.5} duration={3.5} />
      <Sprinkle color="#4ECDC4" left="30%" delay={1} duration={3.2} />
      <Sprinkle color="#95E1D3" left="40%" delay={1.5} duration={3.8} />
      <Sprinkle color="#FF6B9D" left="50%" delay={2} duration={3.3} />
      <Sprinkle color="#FFC93C" left="60%" delay={2.5} duration={3.6} />
      <Sprinkle color="#4ECDC4" left="70%" delay={0.8} duration={3.4} />
      <Sprinkle color="#95E1D3" left="80%" delay={1.2} duration={3.7} />
      <Sprinkle color="#FF6B9D" left="90%" delay={1.8} duration={3.1} />
      <Sprinkle color="#FFC93C" left="15%" delay={2.2} duration={3.9} />
      <Sprinkle color="#4ECDC4" left="25%" delay={0.3} duration={3.5} />
      <Sprinkle color="#95E1D3" left="35%" delay={2.8} duration={3.2} />
      <Sprinkle color="#FF6B9D" left="45%" delay={0.6} duration={3.6} />
      <Sprinkle color="#FFC93C" left="55%" delay={1.9} duration={3.4} />
      <Sprinkle color="#4ECDC4" left="65%" delay={2.3} duration={3.8} />
      <Sprinkle color="#95E1D3" left="75%" delay={0.9} duration={3.3} />
      <Sprinkle color="#FF6B9D" left="85%" delay={2.6} duration={3.7} />
      <Sprinkle color="#FFC93C" left="95%" delay={1.4} duration={3.1} />

      <Bubble size={80} left="10%" delay={0} duration={15} />
      <Bubble size={120} left="20%" delay={2} duration={18} />
      <Bubble size={60} left="35%" delay={4} duration={12} />
      <Bubble size={100} left="50%" delay={1} duration={16} />
      <Bubble size={70} left="65%" delay={3} duration={14} />
      <Bubble size={90} left="75%" delay={5} duration={17} />
      <Bubble size={110} left="85%" delay={2.5} duration={19} />
      <Bubble size={50} left="15%" delay={6} duration={13} />
      <Bubble size={85} left="45%" delay={4.5} duration={15} />
      <Bubble size={95} left="90%" delay={1.5} duration={20} />

      <header className="text-4xl md:text-5xl font-bold text-center text-white mb-4 px-4 drop-shadow-lg relative z-10">
        🎓 Congratulations, Raymond Jr! 🎉
      </header>
      <p className="text-sm md:text-base font-medium text-center text-white/90 mb-12 max-w-2xl px-6 leading-relaxed drop-shadow relative z-10">
        On this special day, we celebrate your hard work, dedication, and amazing achievement. 🌟 You’ve grown wiser, stronger, and more confident with every step, and graduating to Grade 8 is just the beginning of many great accomplishments ahead.
Keep dreaming big, believing in yourself, and reaching for the stars — the future is all yours! 🚀
We’re so proud of you, Raymond Jr. Keep shining bright! ✨
      </p>

      <p className="text-xs md:text-sm text-white/70 mb-4 drop-shadow relative z-10">Drag to rotate • Auto-rotating</p>

      <div
        className="relative cursor-grab active:cursor-grabbing z-10"
        style={{
          width: `${containerSize}px`,
          height: `${containerSize}px`,
          perspective: `${Math.max(800, containerSize * 2)}px`,
          transformStyle: "preserve-3d",
        }}
        aria-label="Rotating memories sphere"
        role="img"
      >
        <div
          id="sphere"
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            transformStyle: "preserve-3d",
            transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`,
            transition: isDragging ? "none" : "transform 0.1s ease-out",
          }}
        >
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              transform: "translate3d(-50%, -50%, 0px)",
              zIndex: 100,
            }}
          >
            {/* Outer glow rings */}
            <div className="absolute inset-0 animate-ping-slow">
              <div className="w-32 h-32 rounded-full bg-yellow-300/30 blur-xl absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div className="absolute inset-0 animate-pulse-slow">
              <div className="w-24 h-24 rounded-full bg-pink-400/40 blur-lg absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>

            {/* Main glowing orb */}
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-yellow-200 via-pink-300 to-purple-400 shadow-2xl animate-pulse-glow">
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/80 to-transparent animate-shimmer" />

              {/* Sparkle particles */}
              <div
                className="absolute -top-1 left-1/4 w-2 h-2 bg-white rounded-full animate-sparkle"
                style={{ animationDelay: "0s" }}
              />
              <div
                className="absolute top-1/4 -right-1 w-1.5 h-1.5 bg-yellow-200 rounded-full animate-sparkle"
                style={{ animationDelay: "0.5s" }}
              />
              <div
                className="absolute -bottom-1 right-1/3 w-2 h-2 bg-pink-200 rounded-full animate-sparkle"
                style={{ animationDelay: "1s" }}
              />
              <div
                className="absolute bottom-1/3 -left-1 w-1.5 h-1.5 bg-purple-200 rounded-full animate-sparkle"
                style={{ animationDelay: "1.5s" }}
              />

              {/* Center emoji */}
              <div className="absolute inset-0 flex items-center justify-center text-3xl animate-bounce-gentle">🎂</div>
            </div>

            {/* Orbiting particles */}
            <div className="absolute inset-0 animate-spin-slow">
              <div className="absolute top-0 left-1/2 w-3 h-3 bg-yellow-300 rounded-full blur-sm -translate-x-1/2" />
            </div>
            <div className="absolute inset-0 animate-spin-reverse">
              <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-pink-300 rounded-full blur-sm -translate-x-1/2" />
            </div>
            <div className="absolute inset-0 animate-spin-slow" style={{ animationDelay: "1s" }}>
              <div className="absolute left-0 top-1/2 w-2.5 h-2.5 bg-purple-300 rounded-full blur-sm -translate-y-1/2" />
            </div>
          </div>

          {positions.map((pos, index) => (
            <div
              key={index}
              className="absolute"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  transform: `translate3d(${pos.x}px, ${pos.y}px, ${pos.z}px) rotateY(${pos.rotateY}deg) rotateX(${pos.rotateX}deg)`,
                  width: `${faceSize}px`,
                  height: `${faceSize}px`,
                  left: "50%",
                  top: "50%",
                  marginLeft: `-${faceSize / 2}px`,
                  marginTop: `-${faceSize / 2}px`,
                }}
            >
              <img
                src={images[index] || "/placeholder.svg"}
                alt={`Memory ${index + 1}`}
                className="w-full h-full object-cover rounded-xl shadow-2xl border-4 border-white/80 transition-all duration-300"
                style={{
                  transform:
                    hoveredIndex === index || (isDragging && hoveredIndex === index) ? "scale(1.3)" : "scale(1)",
                  zIndex: hoveredIndex === index ? 10 : 1,
                }}
                draggable="false"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RotatingSphere

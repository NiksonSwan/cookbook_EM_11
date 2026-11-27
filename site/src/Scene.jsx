import { Component, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import borschPhoto from '../../images/borsch.png'

const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value))
const smooth = (value) => value * value * (3 - 2 * value)
const cold = new THREE.Color('#51656b')
const hot = new THREE.Color('#9f243a')
const potShape = [
  [0, -0.97], [0.93, -0.97], [1.05, -0.89], [1.15, -0.55],
  [1.22, 0.28], [1.16, 0.72], [1.12, 0.79],
].map(([radius, height]) => new THREE.Vector2(radius, height))

function Counter() {
  return (
    <group>
      <mesh position={[0, -1.14, 0]} receiveShadow>
        <cylinderGeometry args={[2.1, 2.1, 0.11, 64]} />
        <meshStandardMaterial color="#263833" roughness={0.86} />
      </mesh>
      <mesh position={[0, -1.20, 0]} receiveShadow>
        <cylinderGeometry args={[2.45, 2.45, 0.06, 64]} />
        <meshStandardMaterial color="#13201d" roughness={1} />
      </mesh>
    </group>
  )
}

function Pot({ progress, reducedMotion }) {
  const liquid = useRef(null)
  const soup = useRef(null)
  const pot = useRef(null)

  useFrame((state) => {
    const fullness = smooth(clamp(progress / 5.4))
    if (liquid.current) {
      liquid.current.position.y = -0.56 + fullness * 1.14
      liquid.current.scale.setScalar(0.93 + fullness * 0.075)
    }
    if (soup.current) soup.current.color.lerpColors(cold, hot, smooth(clamp((progress - 3.1) / 1.5)))
    if (pot.current && !reducedMotion) pot.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.065
  })

  return (
    <group ref={pot}>
      <Counter />
      <mesh castShadow receiveShadow>
        <latheGeometry args={[potShape, 72]} />
        <meshStandardMaterial color="#68736f" metalness={0.78} roughness={0.31} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.775, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[1.143, 0.073, 12, 72]} />
        <meshStandardMaterial color="#bcc1b9" metalness={0.85} roughness={0.23} />
      </mesh>
      <mesh ref={liquid} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[1.075, 1.075, 0.035, 64]} />
        <meshStandardMaterial ref={soup} color="#51656b" metalness={0.15} roughness={0.29} />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 1.24, 0.18, 0]}>
          <mesh rotation={[0, Math.PI / 2, 0]} scale={[0.45, 0.55, 1]} castShadow>
            <torusGeometry args={[0.38, 0.09, 12, 32]} />
            <meshStandardMaterial color="#adb3ad" metalness={0.8} roughness={0.34} />
          </mesh>
        </group>
      ))}
      {Array.from({ length: 5 }, (_, i) => (
        <Steam key={i} i={i} progress={progress} reducedMotion={reducedMotion} />
      ))}
      {progress > 4.6 && (
        <group position={[0, 0.61, 0]}>
          <mesh position={[0.1, 0, 0]} scale={[0.3, 0.045, 0.27]}>
            <sphereGeometry args={[1, 16, 12]} />
            <meshStandardMaterial color="#fbf1d8" roughness={0.74} />
          </mesh>
          {Array.from({ length: 8 }, (_, i) => (
            <mesh key={i} position={[Math.sin(i * 2.6) * 0.23, 0.055, Math.cos(i * 2.6) * 0.19]} rotation={[0, i * 0.8, 0.65]}>
              <cylinderGeometry args={[0.009, 0.013, 0.21, 5]} />
              <meshStandardMaterial color="#87a86c" />
            </mesh>
          ))}
        </group>
      )}
    </group>
  )
}

function Steam({ i, progress, reducedMotion }) {
  const ref = useRef(null)
  useFrame((state) => {
    if (!ref.current) return
    const t = reducedMotion ? i / 5 : (state.clock.elapsedTime * 0.23 + i / 5) % 1
    ref.current.position.set(Math.sin(i * 3.4 + t * 4) * 0.38, 1.08 + t * 1.65, Math.cos(i * 2.1) * 0.24)
    ref.current.scale.setScalar(0.13 + 0.29 * t)
    ref.current.material.opacity = progress > 0.65 ? 0.14 * (1 - t) : 0
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1, 12, 8]} />
      <meshBasicMaterial color="#f6e8ce" transparent opacity={0} depthWrite={false} />
    </mesh>
  )
}

const pieces = [
  { kind: 'meat', color: '#8a503a', count: 3 },
  { kind: 'potato', color: '#e7c58a', count: 4 },
  { kind: 'cabbage', color: '#a7bd7d', count: 4 },
  { kind: 'carrot', color: '#dc753b', count: 4 },
  { kind: 'beet', color: '#9e2540', count: 4 },
  { kind: 'herbs', color: '#87a76a', count: 5 },
]

function FoodPiece({ kind, color, index }) {
  const x = (index % 3 - 1) * 0.28
  const y = Math.floor(index / 3) * 0.20 - 0.13
  const z = Math.sin(index * 2.2) * 0.16
  const shape = kind === 'cabbage' ? (
    <sphereGeometry args={[0.19, 9, 7]} />
  ) : kind === 'beet' ? (
    <cylinderGeometry args={[0.15, 0.15, 0.10, 12]} />
  ) : kind === 'carrot' || kind === 'herbs' ? (
    <coneGeometry args={[kind === 'herbs' ? 0.06 : 0.14, kind === 'herbs' ? 0.42 : 0.31, 9]} />
  ) : (
    <boxGeometry args={[0.28, 0.22, 0.25]} />
  )
  return (
    <mesh position={[x, y, z]} rotation={[index * 0.4, index * 0.7, index * 0.2]} scale={kind === 'cabbage' ? [1.15, 0.43, 0.85] : 1} castShadow>
      {shape}
      <meshStandardMaterial color={color} roughness={0.73} metalness={0.02} />
    </mesh>
  )
}

function FlyingIngredients({ progress, reducedMotion }) {
  const refs = useRef([])
  const { size } = useThree()
  useFrame((state) => {
    pieces.forEach((item, i) => {
      const group = refs.current[i]
      if (!group) return
      const raw = clamp((progress - i) / 0.8)
      const t = reducedMotion ? (raw > 0.5 ? 1 : 0) : smooth(raw)
      const waiting = i === Math.ceil(progress) && progress < i
      const visible = (progress >= i - 0.08 && progress <= i + 0.86) || waiting
      const xStart = size.width < 620 ? 1.48 : 2.65
      group.position.set(
        xStart * (1 - t),
        2.18 + (reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 2.3 + i) * 0.08) + 0.23 * Math.sin(t * Math.PI) - 1.63 * t,
        -0.25 + 0.22 * Math.sin(i * 2),
      )
      group.rotation.set(t * 1.2, t * -2.4 + i * 0.2, t * 0.8)
      group.scale.setScalar(visible ? (size.width < 620 ? 0.72 : 1) * (1 - 0.75 * clamp((t - 0.7) / 0.3)) : 0.0001)
    })
  })
  return pieces.map((item, i) => (
    <group key={item.kind} ref={(node) => { refs.current[i] = node }}>
      {Array.from({ length: item.count }, (_, j) => <FoodPiece key={j} kind={item.kind} color={item.color} index={j} />)}
    </group>
  ))
}

function Kitchen({ progress, reducedMotion }) {
  const backdrop = useMemo(() => new THREE.Color('#172923'), [])
  return (
    <>
      <color attach="background" args={[backdrop]} />
      <ambientLight intensity={1.15} />
      <directionalLight position={[-2, 5, 5]} intensity={3.6} color="#ffe5b5" castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-5} shadow-camera-right={5} shadow-camera-top={5} shadow-camera-bottom={-5} />
      <pointLight position={[3, 3, -2]} color="#f38a64" intensity={30} distance={9} />
      <Pot progress={progress} reducedMotion={reducedMotion} />
      <FlyingIngredients progress={progress} reducedMotion={reducedMotion} />
    </>
  )
}

export class SceneBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    return this.state.failed ? (
      <div className="scene-fallback" role="img" aria-label="Борщ в глубокой керамической тарелке">
        <img src={borschPhoto} alt="" />
      </div>
    ) : this.props.children
  }
}

export default function Scene({ progress, reducedMotion }) {
  return (
    <SceneBoundary>
      <Canvas orthographic camera={{ position: [4.3, 3.5, 5.1], zoom: 81, near: 0.1, far: 100 }} shadows dpr={[1, 1.7]} gl={{ antialias: true, powerPreference: 'high-performance' }}>
        <Kitchen progress={progress} reducedMotion={reducedMotion} />
      </Canvas>
    </SceneBoundary>
  )
}

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../contexts/ThemeContext';

// Geometric shape common for all seasons
function GeometricShape({ position, color, speed, geometry = 'icosahedron', emissiveIntensity = 0.2 }) {
  const meshRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.x = time * speed * 0.2;
    meshRef.current.rotation.y = time * speed * 0.3;
  });

  const GeometryComponent = geometry === 'octahedron' ?
    <octahedronGeometry args={[1, 0]} /> :
    <icosahedronGeometry args={[1, 0]} />;

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef} position={position}>
        {GeometryComponent}
        <meshStandardMaterial
          color={color}
          roughness={0.1}
          metalness={0.8}
          transparent
          opacity={0.6}
          wireframe={true}
          emissive={color}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
      <mesh position={position} scale={[0.9, 0.9, 0.9]}>
        {GeometryComponent}
        <meshStandardMaterial
          color={color}
          roughness={0.2}
          metalness={0.5}
          transparent
          opacity={0.1}
          emissive={color}
          emissiveIntensity={emissiveIntensity * 0.5}
        />
      </mesh>
    </Float>
  );
}

// =========================
// SPRING ELEMENTS (有機+無機)
// =========================

// Cherry blossom petals (有機)
function CherryBlossomPetals() {
  const count = 40;
  const petalsRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    petalsRef.current.children.forEach((petal, i) => {
      petal.position.y = Math.sin(time * 0.3 + i * 0.2) * 6 - 2;
      petal.position.x = Math.cos(time * 0.2 + i * 0.15) * 8 + Math.sin(time * 0.1) * 2;
      petal.rotation.z = time * 0.5 + i;
    });
  });

  return (
    <group ref={petalsRef}>
      {Array.from({ length: count }).map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.random() * 16 - 8,
            Math.random() * 10 - 5,
            Math.random() * 10 - 5
          ]}
        >
          <planeGeometry args={[0.3, 0.3]} />
          <meshStandardMaterial
            color="#ffc0cb"
            side={THREE.DoubleSide}
            transparent
            opacity={0.8}
            emissive="#ff69b4"
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

// Dandelion seeds (有機)
function DandelionSeeds() {
  const count = 25;
  const seedsRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    seedsRef.current.children.forEach((seed, i) => {
      seed.position.y = Math.sin(time * 0.2 + i * 0.3) * 7;
      seed.position.x = Math.cos(time * 0.15 + i * 0.2) * 6;
      seed.rotation.y = time * 0.3 + i;
    });
  });

  return (
    <group ref={seedsRef}>
      {Array.from({ length: count }).map((_, i) => (
        <group
          key={i}
          position={[
            Math.random() * 12 - 6,
            Math.random() * 10 - 5,
            Math.random() * 8 - 4
          ]}
        >
          <mesh>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial
              color="#fde047"
              emissive="#fbbf24"
              emissiveIntensity={0.5}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Wind trails (有機)
function WindTrails() {
  const trailsRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (trailsRef.current) {
      trailsRef.current.rotation.z = Math.sin(time * 0.2) * 0.3;
    }
  });

  const trailCurve = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-6, -3, 0),
      new THREE.Vector3(-2, 0, 2),
      new THREE.Vector3(2, 2, 1),
      new THREE.Vector3(6, -1, -1),
    ]);
    return curve;
  }, []);

  return (
    <group ref={trailsRef}>
      <mesh>
        <tubeGeometry args={[trailCurve, 64, 0.05, 8, false]} />
        <meshStandardMaterial
          color="#d4f1f4"
          transparent
          opacity={0.4}
          emissive="#a5f3fc"
          emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  );
}

// =========================
// SUMMER ELEMENTS (有機+無機)
// =========================

// Sunrays (無機)
function SunRays() {
  const raysRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    raysRef.current.rotation.z = time * 0.1;
  });

  return (
    <group ref={raysRef} position={[0, 0, -10]}>
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh
          key={i}
          rotation={[0, 0, (Math.PI * 2 * i) / 12]}
          position={[0, 0, 0]}
        >
          <cylinderGeometry args={[0.05, 0.05, 15, 8]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#f59e0b"
            emissiveIntensity={0.6}
            transparent
            opacity={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

// Water ripples (有機)
function WaterRipples() {
  const ripplesRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    ripplesRef.current.children.forEach((ripple, i) => {
      const scale = 1 + Math.sin(time * 2 + i * 0.5) * 0.3;
      ripple.scale.set(scale, scale, 1);
      ripple.material.opacity = 0.3 * (1 - (Math.sin(time * 2 + i * 0.5) + 1) / 2);
    });
  });

  return (
    <group ref={ripplesRef} position={[0, -3, 2]}>
      {Array.from({ length: 3 }).map((_, i) => (
        <mesh
          key={i}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <torusGeometry args={[2 + i * 1.5, 0.05, 16, 100]} />
          <meshStandardMaterial
            color="#38bdf8"
            transparent
            opacity={0.3}
            emissive="#0ea5e9"
            emissiveIntensity={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

// Light particles (無機)
function LightParticles() {
  const particlesRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    particlesRef.current.children.forEach((particle, i) => {
      particle.position.y += Math.sin(time * 3 + i) * 0.01;
      particle.position.x += Math.cos(time * 2 + i) * 0.01;
    });
  });

  return (
    <group ref={particlesRef}>
      {Array.from({ length: 50 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.random() * 16 - 8,
            Math.random() * 10 - 5,
            Math.random() * 10 - 5
          ]}
        >
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial
            color="#fde047"
            emissive="#fbbf24"
            emissiveIntensity={0.8}
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}
    </group>
  );
}

// =========================
// AUTUMN ELEMENTS (有機+無機)
// =========================

// Maple leaves (有機)
function MapleLeaves() {
  const leavesRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    leavesRef.current.children.forEach((leaf, i) => {
      leaf.position.y = ((time * 0.5 + i * 0.1) % 10) * -1 + 5;
      leaf.position.x = Math.sin(time * 0.3 + i) * 6;
      leaf.rotation.z = time * 0.8 + i * 0.5;
      leaf.rotation.x = time * 0.5 + i;
    });
  });

  return (
    <group ref={leavesRef}>
      {Array.from({ length: 25 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.random() * 12 - 6,
            Math.random() * 10,
            Math.random() * 8 - 4
          ]}
        >
          <planeGeometry args={[0.4, 0.4]} />
          <meshStandardMaterial
            color={i % 3 === 0 ? "#fb923c" : i % 3 === 1 ? "#dc2626" : "#f97316"}
            side={THREE.DoubleSide}
            transparent
            opacity={0.85}
            emissive={i % 3 === 0 ? "#f97316" : i % 3 === 1 ? "#dc2626" : "#fb923c"}
            emissiveIntensity={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

// Ginkgo leaves (有機)
function GinkgoLeaves() {
  const leavesRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    leavesRef.current.children.forEach((leaf, i) => {
      leaf.position.y = ((time * 0.4 + i * 0.15) % 10) * -1 + 5;
      leaf.position.x = Math.cos(time * 0.25 + i * 0.1) * 5;
      leaf.rotation.z = time * 0.6 + i * 0.7;
    });
  });

  return (
    <group ref={leavesRef}>
      {Array.from({ length: 15 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.random() * 10 - 5,
            Math.random() * 10,
            Math.random() * 6 - 3
          ]}
        >
          <circleGeometry args={[0.2, 6]} />
          <meshStandardMaterial
            color="#fde047"
            side={THREE.DoubleSide}
            transparent
            opacity={0.8}
            emissive="#fbbf24"
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

// Wind vortex (有機)
function WindVortex() {
  const vortexRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (vortexRef.current) {
      vortexRef.current.rotation.y = time * 0.5;
    }
  });

  const vortexCurve = useMemo(() => {
    const points = [];
    for (let i = 0; i < 100; i++) {
      const angle = (i / 100) * Math.PI * 4;
      const radius = i * 0.03;
      points.push(new THREE.Vector3(
        Math.cos(angle) * radius,
        i * 0.05 - 2.5,
        Math.sin(angle) * radius
      ));
    }
    return new THREE.CatmullRomCurve3(points);
  }, []);

  return (
    <group ref={vortexRef} position={[3, 0, -3]}>
      <mesh>
        <tubeGeometry args={[vortexCurve, 100, 0.03, 8, false]} />
        <meshStandardMaterial
          color="#fb923c"
          transparent
          opacity={0.3}
          emissive="#f97316"
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  );
}

// =========================
// WINTER ELEMENTS (無機)
// =========================

// Snowflakes (無機)
function Snowflakes() {
  const snowRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    snowRef.current.children.forEach((flake, i) => {
      flake.position.y = ((time * 0.4 + i * 0.1) % 10) * -1 + 5;
      flake.position.x += Math.sin(time * 0.5 + i) * 0.01;
      flake.rotation.y = time * 0.3 + i;
    });
  });

  return (
    <group ref={snowRef}>
      {Array.from({ length: 80 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.random() * 16 - 8,
            Math.random() * 10,
            Math.random() * 10 - 5
          ]}
        >
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#06b6d4"
            emissiveIntensity={0.5}
            transparent
            opacity={0.95}
          />
        </mesh>
      ))}
    </group>
  );
}

// Ice crystals (無機)
function IceCrystals() {
  const crystalsRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    crystalsRef.current.children.forEach((crystal, i) => {
      crystal.rotation.y = time * 0.5 + i;
      crystal.rotation.x = time * 0.3 + i * 0.5;
    });
  });

  return (
    <group ref={crystalsRef}>
      {Array.from({ length: 15 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.random() * 14 - 7,
            Math.random() * 10 - 5,
            Math.random() * 8 - 4
          ]}
        >
          <octahedronGeometry args={[0.3, 0]} />
          <meshStandardMaterial
            color="#a5f3fc"
            transparent
            opacity={0.6}
            emissive="#06b6d4"
            emissiveIntensity={0.6}
            wireframe={true}
          />
        </mesh>
      ))}
    </group>
  );
}

// Frost sparkles (無機)
function FrostSparkles() {
  const sparklesRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    sparklesRef.current.children.forEach((sparkle, i) => {
      const pulse = Math.sin(time * 3 + i * 0.5) * 0.5 + 0.5;
      sparkle.scale.set(pulse, pulse, pulse);
    });
  });

  return (
    <group ref={sparklesRef}>
      {Array.from({ length: 30 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.random() * 12 - 6,
            Math.random() * 8 - 4,
            Math.random() * 8 - 4
          ]}
        >
          <sphereGeometry args={[0.06, 6, 6]} />
          <meshStandardMaterial
            color="#f0f9ff"
            emissive="#e0f2fe"
            emissiveIntensity={0.9}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

// =========================
// CONFIGURATION
// =========================

const seasonConfig = {
  light: {
    spring: {
      bgGradient: 'linear-gradient(to bottom right, #fef3f9, #fce7f3)',
      shapes: [
        { position: [-3, 2, 0], color: '#ffc0cb', speed: 0.4, emissive: 0.3 },
        { position: [3, -2, -2], color: '#ff69b4', speed: 0.3, emissive: 0.3 },
        { position: [0, 0, -5], color: '#fde047', speed: 0.35, emissive: 0.3 },
      ],
      lights: [
        { position: [10, 10, 10], color: '#ffc0cb', intensity: 1.5 },
        { position: [-10, -5, -5], color: '#fde047', intensity: 1.3 },
      ],
      starsColor: 1,
    },
    summer: {
      bgGradient: 'linear-gradient(to bottom right, #fef9c3, #bfdbfe)',
      shapes: [
        { position: [-3, 2, 0], color: '#fbbf24', speed: 0.6, emissive: 0.4 },
        { position: [3, -2, -2], color: '#f59e0b', speed: 0.5, emissive: 0.4 },
        { position: [0, 0, -5], color: '#38bdf8', speed: 0.55, emissive: 0.3 },
      ],
      lights: [
        { position: [10, 10, 10], color: '#fbbf24', intensity: 2.2 },
        { position: [-5, -5, -5], color: '#38bdf8', intensity: 1.5 },
      ],
      starsColor: 0.9,
    },
    autumn: {
      bgGradient: 'linear-gradient(to bottom right, #fed7aa, #fecaca)',
      shapes: [
        { position: [-3, 2, 0], color: '#fb923c', speed: 0.45, emissive: 0.4 },
        { position: [3, -2, -2], color: '#dc2626', speed: 0.4, emissive: 0.4 },
        { position: [0, 0, -5], color: '#fde047', speed: 0.38, emissive: 0.3 },
      ],
      lights: [
        { position: [10, 10, 10], color: '#fb923c', intensity: 1.4 },
        { position: [-10, -10, -5], color: '#fde047', intensity: 1.2 },
      ],
      starsColor: 0.7,
    },
    winter: {
      bgGradient: 'linear-gradient(to bottom right, #e0f2fe, #dbeafe)',
      shapes: [
        { position: [-3, 2, 0], color: '#06b6d4', speed: 0.3, emissive: 0.5 },
        { position: [3, -2, -2], color: '#3b82f6', speed: 0.25, emissive: 0.5 },
        { position: [0, 0, -5], color: '#a5f3fc', speed: 0.28, emissive: 0.4 },
      ],
      lights: [
        { position: [10, 10, 10], color: '#06b6d4', intensity: 1.6 },
        { position: [-10, -10, -10], color: '#3b82f6', intensity: 1.3 },
      ],
      starsColor: 1,
    },
  },
  dark: {
    spring: {
      bgGradient: 'linear-gradient(to bottom right, #3f1942, #1e1b4b)',
      shapes: [
        { position: [-3, 2, 0], color: '#f687b3', speed: 0.4, emissive: 0.6 },
        { position: [3, -2, -2], color: '#ff69b4', speed: 0.3, emissive: 0.6 },
        { position: [0, 0, -5], color: '#fde047', speed: 0.35, emissive: 0.5 },
      ],
      lights: [
        { position: [10, 10, 10], color: '#f687b3', intensity: 1.2 },
        { position: [-10, -5, -5], color: '#fde047', intensity: 1.0 },
      ],
      starsColor: 0.9,
    },
    summer: {
      bgGradient: 'linear-gradient(to bottom right, #1e3a8a, #854d0e)',
      shapes: [
        { position: [-3, 2, 0], color: '#fbbf24', speed: 0.6, emissive: 0.7 },
        { position: [3, -2, -2], color: '#f59e0b', speed: 0.5, emissive: 0.7 },
        { position: [0, 0, -5], color: '#60a5fa', speed: 0.55, emissive: 0.6 },
      ],
      lights: [
        { position: [10, 10, 10], color: '#fbbf24', intensity: 1.8 },
        { position: [-5, -5, -5], color: '#60a5fa', intensity: 1.3 },
      ],
      starsColor: 0.8,
    },
    autumn: {
      bgGradient: 'linear-gradient(to bottom right, #7c2d12, #991b1b)',
      shapes: [
        { position: [-3, 2, 0], color: '#fb923c', speed: 0.45, emissive: 0.7 },
        { position: [3, -2, -2], color: '#dc2626', speed: 0.4, emissive: 0.7 },
        { position: [0, 0, -5], color: '#fde047', speed: 0.38, emissive: 0.5 },
      ],
      lights: [
        { position: [10, 10, 10], color: '#fb923c', intensity: 1.3 },
        { position: [-10, -10, -5], color: '#fde047', intensity: 1.0 },
      ],
      starsColor: 0.6,
    },
    winter: {
      bgGradient: 'linear-gradient(to bottom right, #0c4a6e, #1e3a8a)',
      shapes: [
        { position: [-3, 2, 0], color: '#22d3ee', speed: 0.3, emissive: 0.7 },
        { position: [3, -2, -2], color: '#60a5fa', speed: 0.25, emissive: 0.7 },
        { position: [0, 0, -5], color: '#a5f3fc', speed: 0.28, emissive: 0.6 },
      ],
      lights: [
        { position: [10, 10, 10], color: '#22d3ee', intensity: 1.5 },
        { position: [-10, -10, -10], color: '#60a5fa', intensity: 1.2 },
      ],
      starsColor: 1,
    },
  },
};

export default function Background3D() {
  const { season, mode } = useTheme();
  const config = seasonConfig[mode][season];

  return (
        <PerspectiveCamera makeDefault position={[0, 0, 10]} />
        <ambientLight intensity={0.5} />
        {config.lights.map((light, i) => (
          <pointLight
            key={i}
            position={light.position}
            intensity={light.intensity}
            color={light.color}
          />
        ))}

        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={config.starsColor}
          fade
          speed={1}
        />

        {config.shapes.map((shape, i) => (
          <GeometricShape
            key={i}
            position={shape.position}
            color={shape.color}
            speed={shape.speed}
            emissiveIntensity={shape.emissive}
          />
        ))}

        {/* SPRING - Organic + Inorganic Hybrid */}
        {season === 'spring' && (
          <>
            <CherryBlossomPetals />
            <DandelionSeeds />
            <WindTrails />
          </>
        )}

        {/* SUMMER - Organic + Inorganic Hybrid */}
        {season === 'summer' && (
          <>
            <SunRays />
            <WaterRipples />
            <LightParticles />
          </>
        )}

        {/* AUTUMN - Organic + Inorganic Hybrid */}
        {season === 'autumn' && (
          <>
            <MapleLeaves />
            <GinkgoLeaves />
            <WindVortex />
          </>
        )}

        {/* WINTER - Inorganic */}
        {season === 'winter' && (
          <>
            <Snowflakes />
            <IceCrystals />
            <FrostSparkles />
          </>
        )}
      </Canvas>
    </div>
  );
}

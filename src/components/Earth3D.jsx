import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sphere, OrbitControls, Stars, Html } from '@react-three/drei';
import * as THREE from 'three';

// Convert lat/lon to 3D position on sphere
const latLonToVector3 = (lat, lon, radius) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = (radius * Math.sin(phi) * Math.sin(theta));
    const y = (radius * Math.cos(phi));
    return new THREE.Vector3(x, y, z);
};

function CameraController({ selectedSchool }) {
    const { camera } = useThree();

    useFrame((state, delta) => {
        if (selectedSchool && selectedSchool.coordinates) {
            const [lat, lon] = selectedSchool.coordinates;
            // Target point on the surface (radius 3.2)
            const targetPoint = latLonToVector3(lat, lon, 3.2);

            // Zoom position: closer to the surface
            const zoomDistance = 5.0; // Distance from center
            const camPos = targetPoint.clone().normalize().multiplyScalar(zoomDistance);

            // Smoothly interpolate camera position
            state.camera.position.lerp(camPos, delta * 2);
            state.camera.lookAt(0, 0, 0);
        } else {
            // Default position (further out for larger globe)
            state.camera.position.lerp(new THREE.Vector3(0, 0, 8.5), delta * 1.5);
            state.camera.lookAt(0, 0, 0);
        }
    });
    return null;
}

function WavyLightPillar({ position }) {
    const groupRef = useRef();

    useFrame((state) => {
        if (groupRef.current) {
            const time = state.clock.elapsedTime;
            // Wavy effect by scaling Y and slightly rotating
            groupRef.current.children.forEach((child, i) => {
                child.scale.y = 1 + Math.sin(time * 5 + i) * 0.1;
                child.material.opacity = 0.6 + Math.sin(time * 3 + i) * 0.2;
            });
        }
    });

    // Calculate rotation to point outwards
    const dummy = new THREE.Object3D();
    dummy.position.copy(position);
    dummy.lookAt(0, 0, 0);
    const quaternion = dummy.quaternion;

    return (
        <group position={position} quaternion={quaternion}>
            {/* Rotate container to align with normal vector (Z-axis of lookAt points to center, so we rotate X -90) */}
            <group rotation={[Math.PI / 2, 0, 0]}>
                {/* Core Beam */}
                <mesh position={[0, 1.5, 0]}>
                    <cylinderGeometry args={[0.05, 0.05, 3, 16, 1, true]} />
                    <meshBasicMaterial color="#fbbf24" transparent opacity={0.8} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
                </mesh>
                {/* Outer Glow (Wavy) */}
                <mesh position={[0, 1.5, 0]}>
                    <cylinderGeometry args={[0.15, 0.02, 3, 16, 4, true]} />
                    <meshBasicMaterial color="#f59e0b" transparent opacity={0.4} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} depthWrite={false} />
                </mesh>
                {/* Top Rings for "Wavy" feel */}
                <mesh position={[0, 3, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.1, 0.3, 32]} />
                    <meshBasicMaterial color="#fbbf24" transparent opacity={0.6} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
                </mesh>
            </group>
        </group>
    );
}

function Globe({ selectedSchool }) {
    const groupRef = useRef();

    useFrame((state, delta) => {
        if (groupRef.current) {
            if (!selectedSchool) {
                groupRef.current.rotation.y += delta * 0.03;
            }
        }
    });

    return (
        <group ref={groupRef}>
            {/* 1. Outer Blue Wireframe (The "Atmosphere/Grid") */}
            <Sphere args={[3.2, 64, 64]}>
                <meshBasicMaterial
                    color="#38bdf8" // Light Blue
                    wireframe
                    transparent
                    opacity={0.15}
                />
            </Sphere>

            {/* 2. Inner Green Wireframe (Simulating Landmass/Structure) */}
            {/* Slightly smaller radius */}
            <Sphere args={[3.0, 48, 48]}>
                <meshBasicMaterial
                    color="#10b981" // Emerald Green
                    wireframe
                    transparent
                    opacity={0.1}
                />
            </Sphere>

            {/* 3. Core Dark Sphere (To block background stars) */}
            <Sphere args={[2.95, 64, 64]}>
                <meshBasicMaterial
                    color="#020617" // Very dark slate
                    transparent
                    opacity={0.95}
                />
            </Sphere>

            {/* Selected School Pillar */}
            {selectedSchool && (() => {
                const [lat, lon] = selectedSchool.coordinates;
                const pos = latLonToVector3(lat, lon, 3.2);
                return <WavyLightPillar position={pos} />;
            })()}
        </group>
    );
}

export default function Earth3D({ selectedSchool }) {
    return (
        <div className="fixed inset-0" style={{ zIndex: 0 }}>
            <Canvas camera={{ position: [0, 0, 8.5], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[15, 15, 15]} intensity={1} />
                <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />

                <Globe selectedSchool={selectedSchool} />
                <CameraController selectedSchool={selectedSchool} />
                <OrbitControls enableZoom={false} enablePan={false} autoRotate={!selectedSchool} autoRotateSpeed={0.3} />
            </Canvas>
        </div>
    );
}

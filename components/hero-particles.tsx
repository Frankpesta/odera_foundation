"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { random } from "maath";

function ParticleField({ count = 1000 }) {
	const points = useMemo(() => {
		const p = new Float32Array(count * 3);
		random.inSphere(p, { radius: 1.5 });
		return p;
	}, [count]);

	const pointsRef = useRef<THREE.Points>(null!);

	useFrame((state, delta) => {
		if (pointsRef.current) {
			pointsRef.current.rotation.x += delta * 0.05;
			pointsRef.current.rotation.y += delta * 0.075;
		}
	});

	return (
		<Points ref={pointsRef} positions={points} stride={3} frustumCulled={false}>
			<PointMaterial
				transparent
				color="#4ade80"
				size={0.01}
				sizeAttenuation={true}
				depthWrite={false}
				blending={THREE.AdditiveBlending}
			/>
		</Points>
	);
}

export default function HeroParticles() {
	return (
		<div className="absolute inset-0 z-0">
			<Canvas camera={{ position: [0, 0, 1] }}>
				<ambientLight intensity={0.5} />
				<ParticleField />
			</Canvas>
		</div>
	);
}

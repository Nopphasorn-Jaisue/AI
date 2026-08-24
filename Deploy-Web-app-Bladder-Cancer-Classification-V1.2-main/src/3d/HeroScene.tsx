import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Float, MeshDistortMaterial, Sparkles, Ring, Cylinder, Torus } from '@react-three/drei';
import * as THREE from 'three';

export const HeroScene = () => {
  const organRef = useRef<THREE.Group>(null);
  const outerSphereRef = useRef<THREE.Mesh>(null);
  const scanRingRef = useRef<THREE.Group>(null);
  const tumorPointRef = useRef<THREE.Group>(null);
  const orbitGroupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Smooth subtle floating rotation
    if (organRef.current) {
      organRef.current.rotation.y = t * 0.25;
      organRef.current.rotation.x = Math.sin(t * 0.2) * 0.15 + 0.1;
    }

    // Scanning laser ring sweeping through organ
    if (scanRingRef.current) {
      scanRingRef.current.position.y = Math.sin(t * 1.5) * 1.2;
    }

    // Orbiting neural analysis nodes
    if (orbitGroupRef.current) {
      orbitGroupRef.current.rotation.y = -t * 0.4;
      orbitGroupRef.current.rotation.z = Math.sin(t * 0.3) * 0.2;
    }

    // Pulsing lesion nodule
    if (tumorPointRef.current) {
      const pulse = 1 + Math.sin(t * 4) * 0.18;
      tumorPointRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <group ref={organRef}>
      {/* Central Bladder Organ Structure */}
      {/* Outer Mucosal Sheath (Translucent Organic Glass) */}
      <Sphere ref={outerSphereRef} args={[1.35, 64, 64]}>
        <MeshDistortMaterial
          color="#38bdf8"
          roughness={0.1}
          metalness={0.2}
          distort={0.25}
          speed={1.5}
          transmission={0.88}
          thickness={1.2}
          transparent
          opacity={0.65}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </Sphere>

      {/* Inner Detrusor Muscle Core */}
      <Sphere args={[0.95, 32, 32]}>
        <meshPhysicalMaterial
          color="#f43f5e"
          roughness={0.35}
          metalness={0.1}
          transmission={0.4}
          opacity={0.85}
          transparent
          emissive="#be123c"
          emissiveIntensity={0.2}
        />
      </Sphere>

      {/* Focal Malignant Tumor Lesion (Targeted by AI) */}
      <group ref={tumorPointRef} position={[0.75, 0.45, 0.5]}>
        <Sphere args={[0.22, 24, 24]}>
          <meshStandardMaterial
            color="#ef4444"
            emissive="#dc2626"
            emissiveIntensity={2.5}
            roughness={0.2}
          />
        </Sphere>
        {/* Target Reticle Rings */}
        <Torus args={[0.34, 0.012, 16, 48]} rotation={[0.4, 0.2, 0]}>
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.9} />
        </Torus>
        <Torus args={[0.44, 0.008, 16, 48]} rotation={[-0.2, 0.5, 0]}>
          <meshBasicMaterial color="#60a5fa" transparent opacity={0.6} />
        </Torus>
        <pointLight color="#ef4444" intensity={2.5} distance={3} />
      </group>

      {/* Holographic Slicing Laser Plane */}
      <group ref={scanRingRef}>
        <Ring args={[0.1, 1.6, 64]} rotation={[-Math.PI / 2, 0, 0]}>
          <meshBasicMaterial
            color="#38bdf8"
            transparent
            opacity={0.2}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </Ring>
        <Torus args={[1.58, 0.015, 16, 64]} rotation={[-Math.PI / 2, 0, 0]}>
          <meshBasicMaterial color="#60a5fa" />
        </Torus>
      </group>

      {/* Orbiting Neural AI Data Points */}
      <group ref={orbitGroupRef}>
        {[
          { pos: [1.8, 0.5, 0] as [number, number, number], color: '#38bdf8', label: 'T2a' },
          { pos: [-1.6, -0.6, 0.8] as [number, number, number], color: '#10b981', label: 'ROI' },
          { pos: [0.3, -1.7, -1.2] as [number, number, number], color: '#f59e0b', label: 'DWI' },
          { pos: [-0.8, 1.6, -0.7] as [number, number, number], color: '#a855f7', label: 'DCE' },
        ].map((node, i) => (
          <group key={i} position={node.pos}>
            <Sphere args={[0.07, 16, 16]}>
              <meshStandardMaterial color={node.color} emissive={node.color} emissiveIntensity={2} />
            </Sphere>
            {/* Guide line to center */}
            <Cylinder
              args={[0.005, 0.005, 0.8, 6]}
              position={[-node.pos[0] * 0.2, -node.pos[1] * 0.2, -node.pos[2] * 0.2]}
            >
              <meshBasicMaterial color={node.color} transparent opacity={0.25} />
            </Cylinder>
          </group>
        ))}
      </group>

      {/* Cellular Micro-Sparkles */}
      <Sparkles count={80} scale={3.5} size={2.5} speed={0.4} opacity={0.6} color="#60a5fa" />
      <Sparkles count={40} scale={2} size={3} speed={0.8} opacity={0.8} color="#f43f5e" />
    </group>
  );
};

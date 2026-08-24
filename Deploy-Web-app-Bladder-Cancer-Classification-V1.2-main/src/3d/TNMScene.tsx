import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Sphere, Float, RoundedBox, Sparkles, Grid, MeshDistortMaterial, Cylinder, Torus } from '@react-three/drei';
import * as THREE from 'three';
import { playStageSelect, playClick } from '../lib/sound';

export interface LayerData {
  id: string;
  name: string;
  nameTh?: string;
  depth: string;
  thicknessMm: number;
  desc: string;
  color: string;
  xrayColor: string;
  thermalColor: string;
  baseY: number;
  h: number;
  code: string;
  elasticityKpa: string;
  cellDensity: string;
}

export const ANATOMICAL_LAYERS: LayerData[] = [
  { 
    id: 'L1', 
    name: 'Urothelium (Epithelium)', 
    nameTh: 'เยื่อบุผิว (Urothelium)',
    depth: '0.00 - 0.15 mm', 
    thicknessMm: 0.15,
    desc: 'Impermeable 3-7 cell layer barrier of umbrella cells with tight junctions.', 
    color: '#fbcfe8', 
    xrayColor: '#38bdf8',
    thermalColor: '#3b82f6',
    baseY: 1.15, 
    h: 0.18, 
    code: 'UR',
    elasticityKpa: '1.2 kPa',
    cellDensity: 'High (Tight Junctions)'
  },
  { 
    id: 'L2', 
    name: 'Lamina Propria (Connective Tissue)', 
    nameTh: 'เนื้อเยื่อเกี่ยวพัน (Lamina Propria)',
    depth: '0.15 - 0.55 mm', 
    thicknessMm: 0.40,
    desc: 'Loose collagenous & elastin-rich stroma with dense micro-capillary plexus.', 
    color: '#fed7aa', 
    xrayColor: '#60a5fa',
    thermalColor: '#10b981',
    baseY: 0.82, 
    h: 0.42, 
    code: 'LP',
    elasticityKpa: '4.8 kPa',
    cellDensity: 'Moderate (Stromal Fibroblasts)'
  },
  { 
    id: 'L3', 
    name: 'Muscularis Propria (Detrusor Muscle)', 
    nameTh: 'กล้ามเนื้อกระเพาะปัสสาวะ (Detrusor)',
    depth: '0.55 - 1.45 mm', 
    thicknessMm: 0.90,
    desc: 'Thick interlacing smooth muscle bundles (critical boundary for MIBC vs NMIBC).', 
    color: '#f87171', 
    xrayColor: '#818cf8',
    thermalColor: '#f59e0b',
    baseY: 0.15, 
    h: 0.95, 
    code: 'MP',
    elasticityKpa: '16.5 kPa',
    cellDensity: 'High (Myocyte Bundles)'
  },
  { 
    id: 'L4', 
    name: 'Perivesical Fat (Adventitia)', 
    nameTh: 'ไขมันรอบนอก (Perivesical Fat)',
    depth: '1.45 - 2.65 mm', 
    thicknessMm: 1.20,
    desc: 'Adipose connective sheath buffering outer bladder and adjacent pelvic viscera.', 
    color: '#fef08a', 
    xrayColor: '#a78bfa',
    thermalColor: '#ef4444',
    baseY: -0.92, 
    h: 1.25, 
    code: 'PF',
    elasticityKpa: '0.8 kPa',
    cellDensity: 'Low (Adipocytes & Lipid Vesicles)'
  },
];

interface TNMSceneProps {
  activeStage: string | null;
  selectedLayer: string | null;
  onSelectLayer: (id: string | null) => void;
  explode?: number; // 0 to 1
  renderMode?: 'cinematic' | 'xray' | 'vascular' | 'thermal';
  showGrid?: boolean;
  showLaser?: boolean;
  showProbe?: boolean;
  autoRotate?: boolean;
  cameraPreset?: 'iso' | 'coronal' | 'sagittal' | 'top';
  isLocked?: boolean;
}

export const TNMScene = ({
  activeStage = 'T1',
  selectedLayer = null,
  onSelectLayer,
  explode = 0,
  renderMode = 'cinematic',
  showGrid = true,
  showLaser = true,
  showProbe = true,
  autoRotate = false,
  cameraPreset = 'iso',
  isLocked = false,
}: TNMSceneProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const tumorGroupRef = useRef<THREE.Group>(null);
  const scannerRef = useRef<THREE.Mesh>(null);
  const auraLightRef = useRef<THREE.PointLight>(null);
  const probeRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  const prevPresetRef = useRef<string>(cameraPreset);
  const isTransitioningCameraRef = useRef<boolean>(false);
  const targetCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3(4.5, 3.5, 7));

  // Trigger smooth transition only when preset actually changes
  if (prevPresetRef.current !== cameraPreset) {
    prevPresetRef.current = cameraPreset;
    isTransitioningCameraRef.current = true;
    if (cameraPreset === 'coronal') {
      targetCamPosRef.current.set(0, 0.2, 7.5);
    } else if (cameraPreset === 'sagittal') {
      targetCamPosRef.current.set(7.5, 0.5, 0);
    } else if (cameraPreset === 'top') {
      targetCamPosRef.current.set(0, 8.5, 0.5);
    } else {
      targetCamPosRef.current.set(4.5, 3.5, 7);
    }
  }

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Smooth transition camera only when a preset was selected
    if (isTransitioningCameraRef.current) {
      camera.position.lerp(targetCamPosRef.current, 0.08);
      camera.lookAt(0, 0, 0);
      if (camera.position.distanceTo(targetCamPosRef.current) < 0.08) {
        camera.position.copy(targetCamPosRef.current);
        isTransitioningCameraRef.current = false;
      }
    }

    // Scanning laser translation
    if (scannerRef.current && showLaser) {
      scannerRef.current.position.y = Math.sin(time * 1.2) * 2.2;
    }

    // Dynamic tumor scale, invasion depth and aura intensity based on TNM stage
    if (tumorGroupRef.current && auraLightRef.current) {
      let targetScale = 0.55;
      let targetY = 1.15;
      let lightIntensity = 1.0;
      let lightColor = '#3b82f6';

      if (activeStage === 'T4') {
        targetScale = 2.4;
        targetY = -0.65;
        lightIntensity = 3.5;
        lightColor = '#ef4444';
      } else if (activeStage === 'T3') {
        targetScale = 1.65;
        targetY = -0.15;
        lightIntensity = 2.4;
        lightColor = '#f97316';
      } else if (activeStage === 'T2') {
        targetScale = 1.1;
        targetY = 0.38;
        lightIntensity = 1.6;
        lightColor = '#f59e0b';
      } else if (activeStage === 'T1') {
        targetScale = 0.72;
        targetY = 0.92;
        lightIntensity = 0.9;
        lightColor = '#10b981';
      }

      tumorGroupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.06);
      tumorGroupRef.current.position.y = THREE.MathUtils.lerp(tumorGroupRef.current.position.y, targetY, 0.06);
      auraLightRef.current.intensity = THREE.MathUtils.lerp(auraLightRef.current.intensity, lightIntensity, 0.06);
      auraLightRef.current.color.lerp(new THREE.Color(lightColor), 0.06);

      // Probe follows tumor invasion apex
      if (probeRef.current && showProbe) {
        probeRef.current.position.y = THREE.MathUtils.lerp(probeRef.current.position.y, targetY + 0.1, 0.06);
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.2, 0]}>
      {/* Procedural High-Fidelity Studio & Medical Lighting (No external HDR network fetch) */}
      <ambientLight intensity={renderMode === 'xray' ? 0.4 : 0.85} />
      <hemisphereLight args={['#dbeafe', '#1e1b4b', renderMode === 'xray' ? 0.5 : 0.9]} />
      <directionalLight position={[8, 14, 8]} intensity={renderMode === 'xray' ? 1.0 : 2.2} castShadow />
      <directionalLight position={[-8, 6, -6]} intensity={0.8} color="#60a5fa" />
      <directionalLight position={[0, -5, -4]} intensity={0.5} color="#38bdf8" />
      <pointLight position={[0, -3, 2]} intensity={0.6} color="#a855f7" />

      {/* Grid Floor */}
      {showGrid && (
        <Grid 
          position={[0, -3.2, 0]} 
          args={[24, 24]} 
          cellSize={0.5} 
          cellThickness={0.5} 
          cellColor={renderMode === 'xray' ? '#0284c7' : '#1e293b'} 
          sectionSize={2.5} 
          sectionThickness={1.5} 
          sectionColor={renderMode === 'xray' ? '#38bdf8' : '#3b82f6'} 
          fadeDistance={18} 
        />
      )}

      {/* Bio-luminescence Cellular Particles */}
      <Sparkles 
        count={renderMode === 'xray' ? 300 : 180} 
        scale={[10, 6, 8]} 
        size={renderMode === 'vascular' ? 3.5 : 2} 
        speed={0.3} 
        opacity={renderMode === 'xray' ? 0.7 : 0.35} 
        color={renderMode === 'vascular' ? '#f43f5e' : renderMode === 'xray' ? '#38bdf8' : '#60a5fa'} 
        position={[0, 0, 0]} 
      />

      {/* Holographic Laser Scanning Plane */}
      {showLaser && (
        <mesh ref={scannerRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[8.8, 6.8]} />
          <meshBasicMaterial 
            color={renderMode === 'vascular' ? '#f43f5e' : '#3b82f6'} 
            transparent 
            opacity={0.18} 
            side={THREE.DoubleSide} 
            blending={THREE.AdditiveBlending} 
            depthWrite={false} 
          />
          <lineSegments>
            <edgesGeometry args={[new THREE.PlaneGeometry(8.8, 6.8)]} />
            <lineBasicMaterial color={renderMode === 'vascular' ? '#fb7185' : '#60a5fa'} transparent opacity={0.85} />
          </lineSegments>
        </mesh>
      )}

      {/* ANATOMICAL TISSUE LAYERS */}
      {ANATOMICAL_LAYERS.map((layer, index) => {
        // Calculate exploded Y position based on explode slider
        const explodeOffset = (index - 1.5) * (explode * 1.6);
        const currentY = layer.baseY - explodeOffset;
        const isSelected = selectedLayer === layer.id;

        return (
          <group 
            key={layer.id} 
            position={[0, currentY, 0]}
            onClick={(e) => {
              e.stopPropagation();
              playClick();
              onSelectLayer(isSelected ? null : layer.id);
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              document.body.style.cursor = 'auto';
            }}
          >
            {/* Layer Geometry */}
            <RoundedBox args={[7.2, layer.h, 5.2]} radius={0.06}>
              {renderMode === 'xray' ? (
                <meshPhysicalMaterial 
                  color={layer.xrayColor} 
                  wireframe={false}
                  transmission={0.92}
                  opacity={0.35}
                  transparent
                  roughness={0.1}
                  ior={1.2}
                  emissive={isSelected ? layer.xrayColor : '#0369a1'}
                  emissiveIntensity={isSelected ? 0.9 : 0.2}
                />
              ) : renderMode === 'thermal' ? (
                <meshStandardMaterial 
                  color={layer.thermalColor} 
                  roughness={0.4} 
                  metalness={0.2}
                  emissive={layer.thermalColor}
                  emissiveIntensity={isSelected ? 0.6 : 0.15}
                  transparent
                  opacity={0.85}
                />
              ) : renderMode === 'vascular' ? (
                <meshPhysicalMaterial 
                  color="#1e1b4b" 
                  transmission={0.8}
                  opacity={0.75}
                  transparent
                  roughness={0.2}
                  emissive={isSelected ? '#4338ca' : '#0f172a'}
                  emissiveIntensity={isSelected ? 0.5 : 0.1}
                />
              ) : (
                <meshPhysicalMaterial 
                  color={layer.color} 
                  transmission={0.78}
                  opacity={isSelected ? 1 : 0.88}
                  transparent
                  roughness={isSelected ? 0.1 : 0.25}
                  thickness={1.6}
                  ior={1.42}
                  clearcoat={1}
                  clearcoatRoughness={0.12}
                  emissive={isSelected ? '#3b82f6' : '#000000'}
                  emissiveIntensity={isSelected ? 0.35 : 0}
                />
              )}
            </RoundedBox>

            {/* Glowing Accent Contour when Selected */}
            {isSelected && (
              <lineSegments>
                <edgesGeometry args={[new THREE.BoxGeometry(7.22, layer.h + 0.02, 5.22)]} />
                <lineBasicMaterial color="#60a5fa" linewidth={2} />
              </lineSegments>
            )}

            {/* Explode connecting guide lines when exploded */}
            {explode > 0.1 && (
              <group position={[-3.5, 0, -2.5]}>
                <Cylinder args={[0.015, 0.015, Math.abs(explodeOffset) * 2 + 0.5, 8]} position={[0, 0, 0]}>
                  <meshBasicMaterial color="#38bdf8" transparent opacity={0.4} />
                </Cylinder>
              </group>
            )}
          </group>
        );
      })}

      {/* MALIGNANT TUMOR COMPLEX */}
      <Float speed={2.2} rotationIntensity={0.6} floatIntensity={0.3}>
        <group ref={tumorGroupRef} position={[-1.4, 1.15, 0]}>
          <pointLight ref={auraLightRef} color="#ef4444" intensity={1.5} distance={5} />

          {/* Necrotic Core */}
          <Sphere args={[0.32, 32, 32]}>
            <meshStandardMaterial 
              color={renderMode === 'xray' ? '#f43f5e' : '#dc2626'} 
              emissive="#b91c1c" 
              emissiveIntensity={1.2} 
              roughness={0.3} 
            />
          </Sphere>

          {/* Organic Malignant Infiltrating Membrane */}
          <Sphere args={[0.58, 64, 64]}>
            <MeshDistortMaterial 
              color={renderMode === 'xray' ? '#38bdf8' : renderMode === 'thermal' ? '#f59e0b' : '#4c1d95'} 
              distort={0.48} 
              speed={3.2} 
              roughness={0.15} 
              metalness={0.65} 
              emissive={renderMode === 'xray' ? '#0284c7' : '#311042'} 
              emissiveIntensity={0.6} 
              transparent 
              opacity={0.88} 
              clearcoat={1} 
              clearcoatRoughness={0.1} 
            />
          </Sphere>

          {/* Invasive Root Spicules (Penetrating detrusor fibers) */}
          <group position={[0, -0.45, 0]}>
            <Cylinder args={[0.08, 0.02, 0.7, 12]} rotation={[0.2, 0, -0.3]}>
              <meshStandardMaterial color="#831843" roughness={0.3} emissive="#4c0519" emissiveIntensity={0.5} />
            </Cylinder>
            <Cylinder args={[0.07, 0.015, 0.85, 12]} rotation={[-0.3, 0.2, 0.4]} position={[0.2, -0.1, 0.1]}>
              <meshStandardMaterial color="#831843" roughness={0.3} emissive="#4c0519" emissiveIntensity={0.5} />
            </Cylinder>
            <Cylinder args={[0.09, 0.02, 0.65, 12]} rotation={[0.1, -0.4, 0.1]} position={[-0.2, -0.05, -0.1]}>
              <meshStandardMaterial color="#831843" roughness={0.3} emissive="#4c0519" emissiveIntensity={0.5} />
            </Cylinder>
          </group>

          {/* Neo-angiogenesis Micro-capillary Cloud */}
          <Sparkles count={55} scale={1.4} size={3.8} speed={1.1} opacity={0.85} color="#f43f5e" />

          {/* Surgical Resection Margin Ring */}
          <group rotation={[-Math.PI / 2, 0, 0]}>
            <Torus args={[0.95, 0.02, 16, 64]}>
              <meshBasicMaterial 
                color={activeStage === 'T1' ? '#10b981' : activeStage === 'T2' ? '#f59e0b' : '#ef4444'} 
                transparent 
                opacity={0.8} 
              />
            </Torus>
          </group>
        </group>
      </Float>

      {/* VIRTUAL BIOPSY INVASION CALIPER / PROBE */}
      {showProbe && (
        <group ref={probeRef} position={[-1.4, 1.15, 0]}>
          {/* Vertical Depth Caliper Line */}
          <Cylinder args={[0.012, 0.012, 3.5, 8]} position={[1.4, -0.5, 0]}>
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.7} />
          </Cylinder>

          {/* Caliper Depth Marker Cursor */}
          <mesh position={[1.4, 0, 0]}>
            <coneGeometry args={[0.12, 0.25, 4]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
          <mesh position={[1.4, 0, 0]} rotation={[0, 0, Math.PI]}>
            <coneGeometry args={[0.12, 0.25, 4]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
        </group>
      )}
    </group>
  );
};

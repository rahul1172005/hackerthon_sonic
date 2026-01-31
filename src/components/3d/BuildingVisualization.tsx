'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, Line } from '@react-three/drei';
import { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

interface CrackData {
  position: [number, number, number];
  growth: number; // 0 to 1
  severity: 'minor' | 'moderate' | 'severe' | 'critical';
}

interface WireframeBuildingProps {
  crackData: CrackData[];
  timelineProgress: number; // 0 to 1
}

const WireframeBuilding = ({ crackData, timelineProgress }: WireframeBuildingProps) => {
  const buildingRef = useRef<THREE.Group>(null);
  const crackRefs = useRef<THREE.Mesh[]>([]);

  // Building structure - 10 floors, realistic proportions
  const floors = 10;
  const floorHeight = 0.4;
  const buildingWidth = 4;
  const buildingDepth = 3;
  const totalHeight = floors * floorHeight;

  // Crack animation
  useEffect(() => {
    if (crackRefs.current.length > 0) {
      crackRefs.current.forEach((crack, index) => {
        if (crack && crackData[index]) {
          const targetScale = crackData[index].growth * timelineProgress;
          gsap.to(crack.scale, {
            y: targetScale * 5,
            duration: 0.5,
            ease: 'power2.out',
          });
        }
      });
    }
  }, [crackData, timelineProgress]);

  // Floor wireframes
  const floorLines = useMemo(() => {
    const lines = [];
    for (let i = 0; i <= floors; i++) {
      const y = i * floorHeight - totalHeight / 2;
      // Horizontal floor outline
      lines.push({
        points: [
          [-buildingWidth / 2, y, -buildingDepth / 2],
          [buildingWidth / 2, y, -buildingDepth / 2],
          [buildingWidth / 2, y, buildingDepth / 2],
          [-buildingWidth / 2, y, buildingDepth / 2],
          [-buildingWidth / 2, y, -buildingDepth / 2],
        ],
        color: '#ffffff',
        lineWidth: i === 0 || i === floors ? 2 : 1,
      });
    }
    return lines;
  }, [floors, floorHeight, buildingWidth, buildingDepth, totalHeight]);

  // Vertical column lines
  const columnLines = useMemo(() => {
    const corners = [
      [-buildingWidth / 2, -buildingDepth / 2],
      [buildingWidth / 2, -buildingDepth / 2],
      [buildingWidth / 2, buildingDepth / 2],
      [-buildingWidth / 2, buildingDepth / 2],
    ];
    return corners.map(([x, z]) => ({
      points: [
        [x, -totalHeight / 2, z],
        [x, totalHeight / 2, z],
      ],
      color: '#ffffff',
      lineWidth: 2,
    }));
  }, [buildingWidth, buildingDepth, totalHeight]);

  return (
    <group ref={buildingRef}>
      {/* Floor lines */}
      {floorLines.map((line, index) => (
        <Line
          key={`floor-${index}`}
          points={line.points}
          color={line.color}
          lineWidth={line.lineWidth}
          transparent
          opacity={0.8}
        />
      ))}

      {/* Column lines */}
      {columnLines.map((line, index) => (
        <Line
          key={`column-${index}`}
          points={line.points}
          color={line.color}
          lineWidth={line.lineWidth}
          transparent
          opacity={0.8}
        />
      ))}

      {/* Crack visualization */}
      {crackData.map((crack, index) => (
        <group key={`crack-${index}`} position={crack.position}>
          {/* Main crack line */}
          <mesh
            ref={(el) => {
              if (el) crackRefs.current[index] = el;
            }}
            scale={[1, 0.01, 1]}
          >
            <boxGeometry args={[0.02, 1, 0.02]} />
            <meshBasicMaterial
              color="#ff0051"
              emissive="#ff0051"
              emissiveIntensity={2}
              transparent
              opacity={timelineProgress}
            />
          </mesh>

          {/* Crack glow effect */}
          <pointLight
            color="#ff0051"
            intensity={crack.severity === 'critical' ? 2 : 1}
            distance={1}
            decay={2}
          />

          {/* Pulse indicator at crack origin */}
          {crack.severity === 'critical' && (
            <mesh position={[0, -0.5, 0]}>
              <sphereGeometry args={[0.05, 16, 16]} />
              <meshBasicMaterial
                color="#ff0051"
                transparent
                opacity={0.6 * timelineProgress}
              />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
};

// Animated grid floor
const AnimatedGrid = () => {
  return (
    <Grid
      args={[20, 20]}
      cellSize={0.5}
      cellThickness={0.5}
      cellColor="#1f1f1f"
      sectionSize={5}
      sectionThickness={1}
      sectionColor="#2a2a2a"
      fadeDistance={30}
      fadeStrength={1}
      followCamera={false}
      infiniteGrid={false}
    />
  );
};

// Auto-rotating camera
const CameraRig = () => {
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    state.camera.position.x = Math.sin(t * 0.1) * 8;
    state.camera.position.z = Math.cos(t * 0.1) * 8;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
};

interface BuildingVisualizationProps {
  crackData?: CrackData[];
  timelineProgress?: number;
  autoRotate?: boolean;
}

export const BuildingVisualization = ({
  crackData = [
    { position: [2, -1, 0], growth: 1, severity: 'critical' },
    { position: [-1.5, 0.5, 1], growth: 0.6, severity: 'moderate' },
  ],
  timelineProgress = 1,
  autoRotate = true,
}: BuildingVisualizationProps) => {
  return (
    <div className="h-full w-full bg-[#0a0a0a]">
      <Canvas
        camera={{ position: [8, 6, 8], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={0.6} color="#ffffff" />

        {/* 3D Scene */}
        <WireframeBuilding crackData={crackData} timelineProgress={timelineProgress} />
        <AnimatedGrid />

        {/* Camera Controls */}
        {autoRotate ? (
          <CameraRig />
        ) : (
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            minDistance={5}
            maxDistance={20}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2}
          />
        )}

        {/* Performance optimization */}
        <color attach="background" args={['#0a0a0a']} />
      </Canvas>
    </div>
  );
};

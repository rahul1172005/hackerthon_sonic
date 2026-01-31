'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line, Text } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

interface CrackData {
  position: [number, number, number];
  growth: number;
  severity: 'minor' | 'moderate' | 'severe' | 'critical';
}

interface WireframeBuildingProps {
  crackData: CrackData[];
  timelineProgress: number;
}

const WireframeBuilding = ({ crackData, timelineProgress }: WireframeBuildingProps) => {
  const buildingRef = useRef<THREE.Group>(null);

  // Building structure - 6 floors (G+5), realistic proportions
  const floors = 6;
  const floorHeight = 0.5;
  const buildingWidth = 3;
  const buildingDepth = 2.5;
  const totalHeight = floors * floorHeight;
  const columnsX = 4; // Number of columns along X
  const columnsZ = 3; // Number of columns along Z

  // Calculate column positions
  const columnPositions = useMemo(() => {
    const positions: [number, number][] = [];
    for (let x = 0; x < columnsX; x++) {
      for (let z = 0; z < columnsZ; z++) {
        const xPos = -buildingWidth / 2 + (x * buildingWidth) / (columnsX - 1);
        const zPos = -buildingDepth / 2 + (z * buildingDepth) / (columnsZ - 1);
        positions.push([xPos, zPos]);
      }
    }
    return positions;
  }, [buildingWidth, buildingDepth]);

  // Floor slab outlines
  const floorLines = useMemo(() => {
    const lines = [];
    for (let i = 0; i <= floors; i++) {
      const y = i * floorHeight - totalHeight / 2;
      // Outer perimeter
      lines.push({
        points: [
          [-buildingWidth / 2, y, -buildingDepth / 2],
          [buildingWidth / 2, y, -buildingDepth / 2],
          [buildingWidth / 2, y, buildingDepth / 2],
          [-buildingWidth / 2, y, buildingDepth / 2],
          [-buildingWidth / 2, y, -buildingDepth / 2],
        ] as [number, number, number][],
        isMain: i === 0 || i === floors,
      });

      // Internal grid lines - X direction
      for (let x = 1; x < columnsX - 1; x++) {
        const xPos = -buildingWidth / 2 + (x * buildingWidth) / (columnsX - 1);
        lines.push({
          points: [
            [xPos, y, -buildingDepth / 2],
            [xPos, y, buildingDepth / 2],
          ] as [number, number, number][],
          isMain: false,
        });
      }

      // Internal grid lines - Z direction
      for (let z = 1; z < columnsZ - 1; z++) {
        const zPos = -buildingDepth / 2 + (z * buildingDepth) / (columnsZ - 1);
        lines.push({
          points: [
            [-buildingWidth / 2, y, zPos],
            [buildingWidth / 2, y, zPos],
          ] as [number, number, number][],
          isMain: false,
        });
      }
    }
    return lines;
  }, [floors, floorHeight, buildingWidth, buildingDepth, totalHeight, columnsX, columnsZ]);

  // Vertical column lines
  const columnLines = useMemo(() => {
    return columnPositions.map(([x, z]) => ({
      points: [
        [x, -totalHeight / 2, z],
        [x, totalHeight / 2, z],
      ] as [number, number, number][],
      isCorner: Math.abs(x) === buildingWidth / 2 && Math.abs(z) === buildingDepth / 2,
    }));
  }, [columnPositions, totalHeight, buildingWidth, buildingDepth]);

  // Calculate crack line based on severity and growth
  const getCrackColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#dc2626';
      case 'severe': return '#ea580c';
      case 'moderate': return '#d97706';
      default: return '#eab308';
    }
  };

  return (
    <group ref={buildingRef}>
      {/* Floor lines */}
      {floorLines.map((line, index) => (
        <Line
          key={`floor-${index}`}
          points={line.points}
          color={line.isMain ? '#e5e5e5' : '#737373'}
          lineWidth={line.isMain ? 2 : 1}
          transparent
          opacity={line.isMain ? 0.9 : 0.5}
        />
      ))}

      {/* Column lines */}
      {columnLines.map((line, index) => (
        <Line
          key={`column-${index}`}
          points={line.points}
          color={line.isCorner ? '#e5e5e5' : '#a3a3a3'}
          lineWidth={line.isCorner ? 2.5 : 1.5}
          transparent
          opacity={line.isCorner ? 0.9 : 0.7}
        />
      ))}

      {/* Critical column highlight - C3 ground floor */}
      {timelineProgress > 0.3 && (
        <group position={[buildingWidth / 4, -totalHeight / 2 + floorHeight / 2, 0]}>
          <Line
            points={[
              [0, -floorHeight / 2, 0],
              [0, floorHeight / 2, 0],
            ]}
            color="#dc2626"
            lineWidth={4}
            transparent
            opacity={0.8 + Math.sin(Date.now() * 0.003) * 0.2}
          />
        </group>
      )}

      {/* Crack visualization */}
      {crackData.map((crack, index) => {
        const crackLength = crack.growth * timelineProgress * 0.8;
        if (crackLength < 0.01) return null;

        return (
          <group key={`crack-${index}`} position={crack.position}>
            {/* Main crack line - diagonal pattern */}
            <Line
              points={[
                [0, 0, 0],
                [crackLength * 0.3, -crackLength, crackLength * 0.2],
                [crackLength * 0.5, -crackLength * 1.5, crackLength * 0.1],
              ]}
              color={getCrackColor(crack.severity)}
              lineWidth={3}
              transparent
              opacity={0.9}
            />

            {/* Secondary fracture lines */}
            {crack.severity === 'critical' && crackLength > 0.3 && (
              <>
                <Line
                  points={[
                    [crackLength * 0.3, -crackLength, crackLength * 0.2],
                    [crackLength * 0.6, -crackLength * 0.8, crackLength * 0.4],
                  ]}
                  color={getCrackColor(crack.severity)}
                  lineWidth={2}
                  transparent
                  opacity={0.7}
                />
                <Line
                  points={[
                    [crackLength * 0.3, -crackLength, crackLength * 0.2],
                    [crackLength * 0.1, -crackLength * 1.2, -crackLength * 0.2],
                  ]}
                  color={getCrackColor(crack.severity)}
                  lineWidth={2}
                  transparent
                  opacity={0.7}
                />
              </>
            )}
          </group>
        );
      })}

      {/* Floor labels */}
      {[0, 2, 5].map((floor) => (
        <Text
          key={`label-${floor}`}
          position={[-buildingWidth / 2 - 0.3, floor * floorHeight - totalHeight / 2 + floorHeight / 2, 0]}
          fontSize={0.15}
          color="#737373"
          anchorX="right"
          anchorY="middle"
        >
          {floor === 0 ? 'G' : `${floor}`}
        </Text>
      ))}
    </group>
  );
};

// Grid floor
const GridFloor = () => {
  const gridSize = 12;
  const divisions = 24;

  return (
    <group position={[0, -1.6, 0]}>
      <gridHelper args={[gridSize, divisions, '#262626', '#1a1a1a']} />
    </group>
  );
};

interface BuildingVisualizationProps {
  crackData?: CrackData[];
  timelineProgress?: number;
  autoRotate?: boolean;
}

export const BuildingVisualization = ({
  crackData = [
    { position: [0.75, -0.5, 0], growth: 1, severity: 'critical' },
    { position: [-0.5, 0.25, 0.5], growth: 0.6, severity: 'moderate' },
  ],
  timelineProgress = 1,
  autoRotate = false,
}: BuildingVisualizationProps) => {
  return (
    <div className="h-full w-full bg-[#0a0a0a]">
      <Canvas
        camera={{ position: [5, 4, 5], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
      >
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={0.4} color="#ffffff" />

        {/* 3D Scene */}
        <WireframeBuilding crackData={crackData} timelineProgress={timelineProgress} />
        <GridFloor />

        {/* Camera Controls - stable orbit controls only */}
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          autoRotate={autoRotate}
          autoRotateSpeed={0.5}
          minDistance={4}
          maxDistance={15}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.2}
          dampingFactor={0.05}
          enableDamping={true}
        />

        {/* Background */}
        <color attach="background" args={['#0a0a0a']} />
      </Canvas>
    </div>
  );
};

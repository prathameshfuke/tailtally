import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useIsMobile } from '@/hooks/useIsMobile';

interface DogBoneProps {
  autoRotate?: boolean;
  isMobile?: boolean;
}

function DogBone({ autoRotate = true, isMobile = false }: DogBoneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Auto-rotation when not being dragged
  useFrame((state, delta) => {
    if (groupRef.current && autoRotate && !isDragging) {
      groupRef.current.rotation.y += delta * 0.3;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  // Reduced detail for mobile performance
  const segments = isMobile ? 24 : 32;

  // Clean, simple proportions
  const boneLength = 4.5;
  const shaftRadius = 0.3;
  const endRadius = 0.85;
  const knobRadius = 0.4;

  // Greyish white color
  const boneColor = "#ececec";
  const boneMaterial = {
    color: boneColor,
    roughness: 0.45,
    metalness: 0.08,
  };

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Main shaft - horizontal */}
      <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0, 0]}>
        <cylinderGeometry args={[shaftRadius, shaftRadius, boneLength, segments]} />
        <meshStandardMaterial {...boneMaterial} />
      </mesh>

      {/* Left end */}
      <group position={[-boneLength / 2, 0, 0]}>
        {/* Center sphere */}
        <mesh>
          <sphereGeometry args={[endRadius, segments, segments]} />
          <meshStandardMaterial {...boneMaterial} />
        </mesh>
        {/* Four knobs in cross pattern */}
        <mesh position={[0, knobRadius * 1.8, 0]}>
          <sphereGeometry args={[knobRadius, segments, segments]} />
          <meshStandardMaterial {...boneMaterial} />
        </mesh>
        <mesh position={[0, -knobRadius * 1.8, 0]}>
          <sphereGeometry args={[knobRadius, segments, segments]} />
          <meshStandardMaterial {...boneMaterial} />
        </mesh>
        <mesh position={[0, 0, knobRadius * 1.8]}>
          <sphereGeometry args={[knobRadius, segments, segments]} />
          <meshStandardMaterial {...boneMaterial} />
        </mesh>
        <mesh position={[0, 0, -knobRadius * 1.8]}>
          <sphereGeometry args={[knobRadius, segments, segments]} />
          <meshStandardMaterial {...boneMaterial} />
        </mesh>
      </group>

      {/* Right end */}
      <group position={[boneLength / 2, 0, 0]}>
        {/* Center sphere */}
        <mesh>
          <sphereGeometry args={[endRadius, segments, segments]} />
          <meshStandardMaterial {...boneMaterial} />
        </mesh>
        {/* Four knobs in cross pattern */}
        <mesh position={[0, knobRadius * 1.8, 0]}>
          <sphereGeometry args={[knobRadius, segments, segments]} />
          <meshStandardMaterial {...boneMaterial} />
        </mesh>
        <mesh position={[0, -knobRadius * 1.8, 0]}>
          <sphereGeometry args={[knobRadius, segments, segments]} />
          <meshStandardMaterial {...boneMaterial} />
        </mesh>
        <mesh position={[0, 0, knobRadius * 1.8]}>
          <sphereGeometry args={[knobRadius, segments, segments]} />
          <meshStandardMaterial {...boneMaterial} />
        </mesh>
        <mesh position={[0, 0, -knobRadius * 1.8]}>
          <sphereGeometry args={[knobRadius, segments, segments]} />
          <meshStandardMaterial {...boneMaterial} />
        </mesh>
      </group>
    </group>
  );
}

interface DogBone3DProps {
  className?: string;
}

export function DogBone3D({ className }: DogBone3DProps) {
  const isMobile = useIsMobile();
  const pixelRatio = isMobile ? Math.min(window.devicePixelRatio, 1.5) : Math.min(window.devicePixelRatio, 2);

  return (
    <div className={className} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Canvas
        camera={{
          position: [0, 0, 10],
          fov: 45,
          near: 0.1,
          far: 1000,
        }}
        dpr={pixelRatio}
        gl={{ antialias: !isMobile }}
        style={{ width: '100%', height: '100%' }}
        frameloop="always"
        flat
      >
        {/* Center the scene explicitly */}
        <group position={[0, 0, 0]}>
          {/* Lighting - neutral white lighting */}
          <ambientLight intensity={0.75} />
          <directionalLight position={[5, 8, 5]} intensity={1.3} castShadow color="#ffffff" />
          <directionalLight position={[-5, -5, -5]} intensity={0.5} color="#ffffff" />
          <pointLight position={[0, 4, 3]} intensity={0.7} color="#ffffff" />

          {/* Dog bone - explicitly at world center */}
          <DogBone autoRotate isMobile={isMobile} />
        </group>

        {/* Orbit controls - permanently locked to center */}
        <OrbitControls
          target={[0, 0, 0]}
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={(2 * Math.PI) / 3}
          rotateSpeed={isMobile ? 0.8 : 1}
          enableDamping
          dampingFactor={0.05}
          makeDefault
        />
      </Canvas>
    </div>
  );
}



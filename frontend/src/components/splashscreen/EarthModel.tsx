import { forwardRef } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const EarthModel = forwardRef<THREE.Group>((props, ref) => {
  const { scene } = useGLTF('/images/earth.glb');

  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return (
    // Scale disesuaikan agar pas di tengah layar awal
    <group ref={ref} scale={3}>
      <primitive object={scene} />
      {/* Glow Atmosfer */}
      <mesh scale={1.01}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial color="#4d8cff" transparent opacity={0.1} side={THREE.BackSide} />
      </mesh>
    </group>
  );
});

export default EarthModel;
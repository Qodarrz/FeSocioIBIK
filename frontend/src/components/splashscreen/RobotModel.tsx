import { forwardRef, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

const RobotModel = forwardRef<THREE.Group>((props, ref) => {
  const { scene, animations } = useGLTF("/images/robot.glb");
  const { actions, names } = useAnimations(animations, ref as any);

  useEffect(() => {
    if (names.length > 0 && actions[names[0]]) {
      actions[names[0]].reset().fadeIn(0.5).play();
      actions[names[0]].setEffectiveTimeScale(0.5);
    }
  }, [actions, names]);

  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return (
    <group ref={ref}>
      {/* TAMBAHKAN ROTASI DI SINI:
          Rotation Y: Math.PI memutar model 180 derajat.
          Jika masih kurang pas, ganti Math.PI menjadi Math.PI * 2 atau 0
      */}
      <primitive 
        object={scene} 
        rotation={[0, Math.PI, 0]} 
      />
    </group>
  );
});

export default RobotModel;
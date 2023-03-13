import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const range = (from, to) => Array.from({ length: to - from + 1 }, (v, k) => k + from);

export default (props) => {
  const ref = useRef();
  const radius = 300;
  const divisions = 8;
  const radians = THREE.MathUtils.degToRad(360 / 8);
  useFrame(() => (ref.current.rotation.z = ref.current.rotation.z + 0.02));

  return (
    <group ref={ref} {...props}>
      {range(1, divisions).map((index) => {
        const x = Math.cos(radians * index) * radius;
        const y = Math.sin(radians * index) * radius;
        return (
          index !== 1 && (
            <mesh key={`spinner-${index}`} visible position={[x, y, 0]} rotation={[0, 0, 0]}>
              <sphereGeometry attach="geometry" args={[100, 160, 160]} />
              <meshPhongMaterial
                attach="material"
                depthTest={true}
                depthWrite={true}
                side={THREE.FrontSide}
                color={0xff7700}
                reflectivity={0}
                flatShading={false}
                roughness={0.8}
                metalness={0.2}
                emissive={0x101010}
                specular={0x101010}
                shininess={100}
              />
            </mesh>
          )
        );
      })}
    </group>
  );
};

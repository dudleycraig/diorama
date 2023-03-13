import { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const Marker = (props) => {
  return (
    <mesh visible="true" rotation={[0, 0, 0]} {...props}>
      <sphereGeometry attach="geometry" args={[100, 160, 180]} />
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
  );
}

export default Marker;

import { useRef, useState, useEffect } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

const Map = ({glb, ...props}) => {
  const ref = useRef();
  const gltf = useLoader(GLTFLoader, glb);
  const nodes = [gltf.nodes['EXPORT_GOOGLE_SAT_WM'], gltf.nodes['GOOGLE_SAT_WM']];

  return (
    <mesh 
      {...props}
      dispose={null}
      ref={ref}
    >
      <bufferGeometry attach="geometry" {...nodes[0].geometry} />
      <meshPhongMaterial
        attach="material"
        depthTest={true}
        depthWrite={true}
        side={THREE.FrontSide}
        color={0xffffff}
        reflectivity={0}
        flatShading={false}
        roughness={1}
        metalness={0}
        emissive={0x101010}
        specular={0x101010}
        shininess={0}
        map={nodes[0].material.map}
      />
    </mesh>
  );
};

export default Map;

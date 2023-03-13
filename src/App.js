import { Suspense, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useLoader, useEffect } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import proj4 from 'proj4';

import Loading from './components/Loading';
import Marker from './components/Marker';
import Map from './components/Map';

/**
 * transforms the positions' first datum that's not the maps' datum and not a pixel coordinate 
 *    (ie EPSG:4326, GPS spherical 3D, [longitude, latitude]: !!NB!!NOTE ARRAY ORDER!!, ie google maps gives coordinates as [latitude, longitude]) 
 * to maps' projection 
 *    (ie EPSG:3857, web mercator cartesian 2D, in meters)
 * then renames the map boundaries via overly complicated destructuring (it was fun at the time)
 * takes the boundaries and the transformed datum,
 * and returns a coordinate offset from origin (center)
 */
const positionToWebGLPoint = (position, map) => {
  const [datum, rest] = Object.keys(position).filter(datum => ![map.projection, 'px'].includes(datum));
  const [dx, dz, dy] = Object.values(proj4(new proj4.Proj(datum), new proj4.Proj(map.projection), new proj4.Point(position[datum]))); // NOTE: y and z axis are swapped as orientation is different within webgl environment
  const {top:{left:{[map.projection]:[tldx, tldz], px:[tlpx, tlpz]}}, bottom:{right:{[map.projection]:[brdx, brdz], px:[brpx, brpz]}}} = map.boundaries;
  // TODO: apply map.scale of meters per pixel, currently not applicable due 1:1 ratio
  return [((brpx / 2) - (dx > 0 ? dx - tldx : tldx - dx)) * (dx > 0 ? 1 : -1), dy, ((brpz / 2) - (dz > 0 ? dz - tldz : tldz - dz)) * (dz < 0 ? 1 : -1)]; // NOTE: z axis is rotated 180d (* -1) due axis orientation
};

const App = props => {
  const state = {
    maps: {
      capetown: { 
        scales: [
          {
            layers: { 
              satellite: {
                glb: '/models/maps/capetown/scales/1/satellite/capetown.glb',
                projection: 'EPSG:3857',
                boundaries: {
                  top: { left: {'EPSG:3857': [2042397.197, -4013861.229], 'px': [0, 0]}, right: {'EPSG:3857': [2059519.292, -4013861.229], 'px': [17121.895, 0]}},
                  bottom: { left: {'EPSG:3857': [2042397.197, -4023645.170], 'px': [0, 9783.940]}, right: {'EPSG:3857': [2059519.292, -4023645.170], 'px': [17121.895, 9783.940]}}
                }
              }
            } 
          },
        ]
      } 
    },
    markers: {
      home: {position: {'EPSG:4326': [18.38217, -33.91989, 100]}},
      stadium: {position: {'EPSG:4326': [18.41151, -33.90348, 100]}},
      yachtclub: {position: {'EPSG:4326': [18.44334, -33.91970, 100]}},
      lionshead: {position: {'EPSG:4326': [18.38961, -33.93498, 700]}},
      rhodes: {position: {'EPSG:4326': [18.45884, -33.95244, 300]}},
      golfclub: {position: {'EPSG:4326': [18.48893, -33.88127, 100]}}
    }
  };

  return (
    <Canvas
      id="canvas"
      gl={{alpha: true}}
      onCreated={({scene, camera}) => {}}
      camera={{fov: 30, aspect: 0.2, near: 1, far: 5000000, position: [30000, 30000, 30000], zoom: 2}}
      concurrent="true"
      pixelratio={window.devicePixelRatio}
    >
      <primitive object={new THREE.AxesHelper(10000)} />
      <ambientLight intensity={0.5} />
      <spotLight position={[1000, 1000, 1000]} angle={0.15} penumbra={1} />
      <pointLight position={[-1000, -1000, -1000]} />
      <OrbitControls />
      <Suspense fallback={<Loading />}>
        <group>
          <Map glb={state.maps.capetown.scales[0].layers.satellite.glb} position={[0, 0, 0]} rotation={[0, 180 * (Math.PI / 180), 0]} /> // NOTE: rotate map 180d around y axis, intimating +z axis as Northing
          {Object.keys(state.markers).map((marker, index) => <Marker key={`marker-${index}`} position={positionToWebGLPoint(state.markers[marker].position, state.maps.capetown.scales[0].layers.satellite)} />)}
      </group>
      </Suspense>
    </Canvas>
  );
}

export default App;

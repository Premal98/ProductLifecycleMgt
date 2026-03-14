import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

function getLoader(url: string) {
  const ext = url.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'stl':
      return new STLLoader();
    case 'obj':
      return new OBJLoader();
    case 'step':
    case 'stp':
      return null; // STEP not supported directly in viewer
    default:
      return null;
  }
}

export function CadViewer({ url, wireframe }: { url: string; wireframe: boolean }) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#f8fafc');

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(3, 3, 4);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    const directional = new THREE.DirectionalLight(0xffffff, 0.6);
    directional.position.set(5, 10, 7.5);
    scene.add(ambient, directional);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const loader = getLoader(url);
    let mesh: any = null;

    if (loader) {
      (loader as any).load(url, (geometryOrObj: any) => {
        if (geometryOrObj instanceof THREE.BufferGeometry) {
          const material = new THREE.MeshStandardMaterial({ color: 0x1f2937, wireframe });
          mesh = new THREE.Mesh(geometryOrObj, material);
        } else {
          geometryOrObj.traverse((child: any) => {
            if (child.isMesh) child.material = new THREE.MeshStandardMaterial({ color: 0x1f2937, wireframe });
          });
          mesh = geometryOrObj;
        }
        if (mesh) {
          mesh.rotation.x = -Math.PI / 2;
          scene.add(mesh);
          const box = new THREE.Box3().setFromObject(mesh);
          const size = box.getSize(new THREE.Vector3()).length();
          const center = box.getCenter(new THREE.Vector3());
          controls.target.copy(center);
          camera.position.set(center.x + size * 0.6, center.y + size * 0.6, center.z + size * 0.6);
          controls.update();
        }
      });
    }

    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mesh) scene.remove(mesh);
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, [url, wireframe]);

  return <div ref={mountRef} className="h-[500px] w-full rounded-2xl border border-slate-200 bg-white shadow-inner" />;
}


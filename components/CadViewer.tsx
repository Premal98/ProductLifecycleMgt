"use client";

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Layers, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';

const DEFAULT_HEIGHT_CLASS = 'h-[480px]';

type CadViewerProps = {
  url?: string | null;
  className?: string;
  placeholder?: string;
  initialWireframe?: boolean;
};

type ViewState = {
  position: THREE.Vector3;
  target: THREE.Vector3;
};

function getExtension(url: string) {
  const clean = url.split('?')[0];
  return clean.split('.').pop()?.toLowerCase() || '';
}

function loadModel(url: string, onLoad: (object: THREE.Object3D) => void, onError: (message: string) => void) {
  const ext = getExtension(url);

  if (ext === 'stl') {
    const loader = new STLLoader();
    loader.load(
      url,
      (geometry) => {
        const material = new THREE.MeshStandardMaterial({ color: 0x1f2937 });
        const mesh = new THREE.Mesh(geometry, material);
        onLoad(mesh);
      },
      undefined,
      () => onError('Unable to load STL file.')
    );
    return;
  }

  if (ext === 'obj') {
    const loader = new OBJLoader();
    loader.load(
      url,
      (object) => {
        onLoad(object);
      },
      undefined,
      () => onError('Unable to load OBJ file.')
    );
    return;
  }

  if (ext === 'gltf' || ext === 'glb') {
    const loader = new GLTFLoader();
    loader.load(
      url,
      (gltf) => {
        onLoad(gltf.scene || gltf.scenes[0]);
      },
      undefined,
      () => onError('Unable to load glTF model.')
    );
    return;
  }

  onError('Unsupported file format.');
}

function applyWireframe(object: THREE.Object3D, wireframe: boolean) {
  object.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh) return;

    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    materials.forEach((material) => {
      if ('wireframe' in material) {
        (material as THREE.Material & { wireframe?: boolean }).wireframe = wireframe;
        material.needsUpdate = true;
      }
    });
  });
}

function disposeObject(object: THREE.Object3D) {
  object.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh) return;

    if (mesh.geometry) {
      mesh.geometry.dispose();
    }

    if (Array.isArray(mesh.material)) {
      mesh.material.forEach((material) => material.dispose());
    } else if (mesh.material) {
      mesh.material.dispose();
    }
  });
}

function frameObject(object: THREE.Object3D, camera: THREE.PerspectiveCamera, controls: OrbitControls): ViewState {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  const maxDim = Math.max(size.x, size.y, size.z) || 1;
  const distance = maxDim * 1.6;

  const direction = new THREE.Vector3(1, 0.9, 1).normalize();
  camera.position.copy(center.clone().add(direction.multiplyScalar(distance)));
  camera.near = Math.max(distance / 100, 0.01);
  camera.far = distance * 100;
  camera.updateProjectionMatrix();

  controls.target.copy(center);
  controls.update();

  return {
    position: camera.position.clone(),
    target: controls.target.clone()
  };
}

export function CadViewer({ url, className, placeholder, initialWireframe = false }: CadViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const initialViewRef = useRef<ViewState | null>(null);
  const rafRef = useRef<number | null>(null);

  const [wireframe, setWireframe] = useState(initialWireframe);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!url) {
      setStatus('idle');
      setErrorMessage('');
      return;
    }

    if (!containerRef.current) return;
    const container = containerRef.current;

    setStatus('loading');
    setErrorMessage('');

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#f8fafc');
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 2000);
    camera.position.set(3, 3, 4);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    if ('outputColorSpace' in renderer) {
      (renderer as any).outputColorSpace = THREE.SRGBColorSpace;
    }
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.75);
    const hemisphere = new THREE.HemisphereLight(0xffffff, 0x94a3b8, 0.4);
    const directional = new THREE.DirectionalLight(0xffffff, 0.6);
    directional.position.set(6, 10, 6);
    scene.add(ambient, hemisphere, directional);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = true;
    controls.minDistance = 0.2;
    controls.maxDistance = 5000;
    controlsRef.current = controls;

    let cancelled = false;

    loadModel(
      url,
      (object) => {
        if (cancelled) return;

        object.traverse((child) => {
          const mesh = child as THREE.Mesh;
          if (!mesh.isMesh) return;

          if (!mesh.material) {
            mesh.material = new THREE.MeshStandardMaterial({ color: 0x1f2937 });
          }
        });

        applyWireframe(object, wireframe);
        scene.add(object);
        modelRef.current = object;
        initialViewRef.current = frameObject(object, camera, controls);
        setStatus('ready');
      },
      (message) => {
        if (cancelled) return;
        setStatus('error');
        setErrorMessage(message);
      }
    );

    const resizeObserver = new ResizeObserver(() => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      cameraRef.current.aspect = clientWidth / clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(clientWidth, clientHeight);
    });
    resizeObserver.observe(container);

    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelled = true;
      resizeObserver.disconnect();
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      controls.dispose();
      if (modelRef.current) {
        scene.remove(modelRef.current);
        disposeObject(modelRef.current);
        modelRef.current = null;
      }
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      rendererRef.current = null;
      sceneRef.current = null;
      cameraRef.current = null;
      controlsRef.current = null;
      initialViewRef.current = null;
    };
  }, [url]);

  useEffect(() => {
    if (modelRef.current) {
      applyWireframe(modelRef.current, wireframe);
    }
  }, [wireframe]);

  function zoomBy(scale: number) {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    const direction = new THREE.Vector3().subVectors(camera.position, controls.target);
    const nextDistance = Math.max(direction.length() * scale, controls.minDistance);
    direction.normalize().multiplyScalar(nextDistance);
    camera.position.copy(controls.target).add(direction);
    controls.update();
  }

  function resetView() {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    const view = initialViewRef.current;
    if (!camera || !controls || !view) return;

    camera.position.copy(view.position);
    controls.target.copy(view.target);
    controls.update();
  }

  const containerClassName = `relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-inner ${DEFAULT_HEIGHT_CLASS} ${className || ''}`;

  return (
    <div className={containerClassName}>
      <div ref={containerRef} className="h-full w-full" />

      {status !== 'ready' && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center text-sm text-slate-500">
          {status === 'loading' ? 'Loading CAD model...' : errorMessage || placeholder || 'No CAD model available.'}
        </div>
      )}

      {status === 'ready' ? (
        <div className="absolute right-3 top-3 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => zoomBy(0.85)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur transition hover:bg-white"
          >
            <ZoomIn className="h-4 w-4" />
            Zoom In
          </button>
          <button
            type="button"
            onClick={() => zoomBy(1.15)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur transition hover:bg-white"
          >
            <ZoomOut className="h-4 w-4" />
            Zoom Out
          </button>
          <button
            type="button"
            onClick={resetView}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur transition hover:bg-white"
          >
            <RotateCcw className="h-4 w-4" />
            Reset View
          </button>
          <button
            type="button"
            onClick={() => setWireframe((value) => !value)}
            className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold shadow-sm backdrop-blur transition ${
              wireframe
                ? 'border-slate-900 bg-slate-900 text-white'
                : 'border-slate-200 bg-white/90 text-slate-700 hover:bg-white'
            }`}
          >
            <Layers className="h-4 w-4" />
            Wireframe
          </button>
        </div>
      ) : null}

      {status === 'ready' ? (
        <div className="pointer-events-none absolute bottom-3 left-3 rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-[11px] text-slate-600 shadow-sm backdrop-blur">
          Drag to rotate · Scroll to zoom · Right-click to pan
        </div>
      ) : null}
    </div>
  );
}
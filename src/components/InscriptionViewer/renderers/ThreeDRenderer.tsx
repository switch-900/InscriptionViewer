import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Download, RotateCcw, ZoomIn, ZoomOut, Move3D } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js';
import { safeExtensionFormat } from '../../../utils/safeFormatting';

interface ThreeDRendererProps {
  src: string;
  mimeType: string;
  fileExtension?: string;
  maxHeight?: number;
  showControls?: boolean;
}

export function ThreeDRenderer({ 
  src, 
  mimeType, 
  fileExtension,
  maxHeight = 400,
  showControls = true 
}: ThreeDRendererProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const frameRef = useRef<number | undefined>(undefined);
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [autoRotate, setAutoRotate] = useState(true);

  // Mouse interaction state
  const [isDragging, setIsDragging] = useState(false);
  const [previousMousePosition, setPreviousMousePosition] = useState({ x: 0, y: 0 });
  const rotationRef = useRef({ x: 0, y: 0 });

  const isSupported = React.useMemo(() => {
    const supportedTypes = ['gltf', 'glb', 'obj', 'stl', 'ply', 'dae'];
    const supportedExts = ['gltf', 'glb', 'obj', 'stl', 'ply', 'dae', '3ds', 'fbx'];
    
    return supportedTypes.some(type => mimeType.includes(type)) ||
           supportedExts.includes(fileExtension?.toLowerCase() || '');
  }, [mimeType, fileExtension]);

  const initScene = useCallback(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(-10, -10, -5);
    scene.add(pointLight);

    mountRef.current.appendChild(renderer.domElement);
  }, []);

  const loadModel = useCallback(async () => {
    if (!sceneRef.current) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(src);
      if (!response.ok) throw new Error('Failed to load model');
      
      const arrayBuffer = await response.arrayBuffer();
      const extension = fileExtension?.toLowerCase() || '';

      let object: THREE.Object3D | null = null;

      console.log(`🎮 Loading 3D model: ${extension} format`);

      switch (extension) {
        case 'obj':
          object = await loadOBJ(arrayBuffer);
          break;
        case 'stl':
          object = await loadSTL(arrayBuffer);
          break;
        case 'ply':
          object = await loadPLY(arrayBuffer);
          break;
        case 'dae':
          object = await loadDAE(arrayBuffer);
          break;
        case 'gltf':
        case 'glb':
          object = await loadGLTF(arrayBuffer, extension);
          break;
        default:
          // For unsupported formats, create an informative placeholder
          console.warn(`Unsupported 3D format: ${extension || mimeType}`);
          object = createUnsupportedPlaceholder(extension || 'unknown');
          break;
      }

      if (object) {
        // Center and scale the model
        const box = new THREE.Box3().setFromObject(object);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        // Prevent division by zero
        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        const scale = 3 / maxDim;
        
        object.position.sub(center);
        object.scale.setScalar(scale);

        // Remove previous model
        if (modelRef.current) {
          sceneRef.current.remove(modelRef.current);
        }

        sceneRef.current.add(object);
        modelRef.current = object;

        console.log(`✅ Successfully loaded 3D model: ${extension}`);
      }

      setIsLoading(false);
    } catch (err) {
      console.error('Failed to load 3D model:', err);
      const ext = fileExtension?.toLowerCase() || 'unknown';
      setError(`Failed to load ${ext.toUpperCase()} model: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setIsLoading(false);
    }
  }, [src, fileExtension]);

  // GLTF/GLB loader
  const loadGLTF = async (arrayBuffer: ArrayBuffer, extension: string): Promise<THREE.Object3D> => {
    return new Promise((resolve, reject) => {
      const loader = new GLTFLoader();
      
      if (extension === 'glb') {
        // For GLB (binary), load directly from array buffer
        loader.parse(arrayBuffer, '', (gltf) => {
          resolve(gltf.scene);
        }, (error) => {
          console.error('Error loading GLB:', error);
          reject(error);
        });
      } else {
        // For GLTF (text), convert array buffer to string first
        try {
          const text = new TextDecoder().decode(arrayBuffer);
          const blob = new Blob([text], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          
          loader.load(url, (gltf) => {
            URL.revokeObjectURL(url);
            resolve(gltf.scene);
          }, undefined, (error) => {
            URL.revokeObjectURL(url);
            console.error('Error loading GLTF:', error);
            reject(error);
          });
        } catch (error) {
          reject(error);
        }
      }
    });
  };

  // OBJ loader using Three.js OBJLoader
  const loadOBJ = async (arrayBuffer: ArrayBuffer): Promise<THREE.Object3D> => {
    return new Promise((resolve, reject) => {
      try {
        const text = new TextDecoder().decode(arrayBuffer);
        const loader = new OBJLoader();
        const object = loader.parse(text);
        
        // Apply default material if none exists
        object.traverse((child) => {
          if (child instanceof THREE.Mesh && !child.material) {
            child.material = new THREE.MeshPhongMaterial({ color: 0x888888 });
          }
        });
        
        resolve(object);
      } catch (error) {
        console.error('Error loading OBJ:', error);
        reject(error);
      }
    });
  };

  // STL loader using Three.js STLLoader
  const loadSTL = async (arrayBuffer: ArrayBuffer): Promise<THREE.Object3D> => {
    return new Promise((resolve, reject) => {
      try {
        const loader = new STLLoader();
        const geometry = loader.parse(arrayBuffer);
        geometry.computeVertexNormals();
        
        const material = new THREE.MeshPhongMaterial({ color: 0xaaaaaa });
        const mesh = new THREE.Mesh(geometry, material);
        
        resolve(mesh);
      } catch (error) {
        console.error('Error loading STL:', error);
        reject(error);
      }
    });
  };

  // PLY loader using Three.js PLYLoader
  const loadPLY = async (arrayBuffer: ArrayBuffer): Promise<THREE.Object3D> => {
    return new Promise((resolve, reject) => {
      try {
        const loader = new PLYLoader();
        const geometry = loader.parse(arrayBuffer);
        geometry.computeVertexNormals();
        
        const material = new THREE.MeshPhongMaterial({ color: 0x999999 });
        const mesh = new THREE.Mesh(geometry, material);
        
        resolve(mesh);
      } catch (error) {
        console.error('Error loading PLY:', error);
        reject(error);
      }
    });
  };

  // DAE (Collada) loader using Three.js ColladaLoader
  const loadDAE = async (arrayBuffer: ArrayBuffer): Promise<THREE.Object3D> => {
    return new Promise((resolve, reject) => {
      try {
        const text = new TextDecoder().decode(arrayBuffer);
        const loader = new ColladaLoader();
        
        // Create a blob URL for the Collada loader
        const blob = new Blob([text], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        
        loader.load(url, (collada) => {
          URL.revokeObjectURL(url);
          resolve(collada.scene);
        }, undefined, (error) => {
          URL.revokeObjectURL(url);
          console.error('Error loading DAE:', error);
          reject(error);
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  // Create placeholder for unsupported formats
  const createUnsupportedPlaceholder = (extension: string): THREE.Object3D => {
    const group = new THREE.Group();
    
    // Create a wireframe box
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const wireframe = new THREE.WireframeGeometry(geometry);
    const material = new THREE.LineBasicMaterial({ color: 0x888888 });
    const box = new THREE.LineSegments(wireframe, material);
    group.add(box);
    
    // Add text label
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (context) {
      canvas.width = 512;
      canvas.height = 256;
      context.fillStyle = 'rgba(255, 255, 255, 0.9)';
      context.fillRect(0, 0, 512, 256);
      context.fillStyle = '#333333';
      context.font = 'bold 24px Arial';
      context.textAlign = 'center';
      context.fillText('Unsupported Format', 256, 100);
      context.font = '20px Arial';
      context.fillText(extension.toUpperCase(), 256, 140);
      context.font = '16px Arial';
      context.fillText('Download to view externally', 256, 180);
      
      const texture = new THREE.CanvasTexture(canvas);
      const labelMaterial = new THREE.MeshBasicMaterial({ 
        map: texture, 
        transparent: true,
        alphaTest: 0.1
      });
      const labelGeometry = new THREE.PlaneGeometry(3, 1.5);
      const label = new THREE.Mesh(labelGeometry, labelMaterial);
      label.position.set(0, 2.5, 0);
      group.add(label);
    }
    
    return group;
  };

  const animate = useCallback(() => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

    if (modelRef.current) {
      if (autoRotate) {
        modelRef.current.rotation.y += 0.01;
      }
      
      // Apply manual rotation
      modelRef.current.rotation.x = rotationRef.current.x;
      modelRef.current.rotation.y += rotationRef.current.y;
    }

    // Apply zoom
    if (cameraRef.current) {
      cameraRef.current.position.setLength(5 / zoom);
    }

    rendererRef.current.render(sceneRef.current, cameraRef.current);
    frameRef.current = requestAnimationFrame(animate);
  }, [autoRotate, zoom]);

  const handleMouseDown = (event: React.MouseEvent) => {
    setIsDragging(true);
    setAutoRotate(false);
    setPreviousMousePosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging) return;

    const deltaX = event.clientX - previousMousePosition.x;
    const deltaY = event.clientY - previousMousePosition.y;

    rotationRef.current.x += deltaY * 0.01;
    rotationRef.current.y += deltaX * 0.01;

    setPreviousMousePosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.2, 5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.2, 0.1));
  const handleReset = () => {
    setZoom(1);
    rotationRef.current = { x: 0, y: 0 };
    setAutoRotate(true);
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `model.${fileExtension || '3d'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download:', err);
    }
  };

  useEffect(() => {
    if (isSupported) {
      initScene();
      loadModel();
      animate();
    }

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (rendererRef.current && mountRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [isSupported, initScene, loadModel, animate]);

  useEffect(() => {
    const handleResize = () => {
      if (rendererRef.current && cameraRef.current && mountRef.current) {
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;
        
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(width, height);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isSupported) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <div className="text-center text-gray-500">
          <div className="text-2xl mb-2">🎮</div>
          <div className="text-sm">3D Model Viewer</div>
          <div className="text-xs mt-1 text-gray-400">
            {safeExtensionFormat(fileExtension)} format
          </div>
          <div className="text-xs mt-2 text-red-500">
            Format not yet supported
          </div>
          <div className="mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="text-xs"
            >
              <Download className="h-3 w-3 mr-1" />
              Download Model
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-gray-900">
      {showControls && (
        <div className="flex justify-between items-center p-2 border-b bg-gray-50 dark:bg-gray-800">
          <div className="text-xs text-gray-600 dark:text-gray-400">
            <span className="font-mono">3D Model</span>
            <span className="ml-2">{safeExtensionFormat(fileExtension)}</span>
            {isLoading && <span className="ml-2 text-blue-500">Loading...</span>}
            {error && <span className="ml-2 text-red-500">Error</span>}
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              className="h-6 px-2 text-xs"
              disabled={isLoading}
            >
              <ZoomOut className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              className="h-6 px-2 text-xs"
              disabled={isLoading}
            >
              <ZoomIn className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="h-6 px-2 text-xs"
              disabled={isLoading}
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAutoRotate(!autoRotate)}
              className="h-6 px-2 text-xs"
              disabled={isLoading}
            >
              <Move3D className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="h-6 px-2 text-xs"
            >
              <Download className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      <div 
        ref={mountRef}
        className="flex-1 relative cursor-grab active:cursor-grabbing w-full h-full"
        style={{ 
          maxHeight: maxHeight - (showControls ? 60 : 0),
          minHeight: '200px'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 z-10">
            <div className="text-center">
              <div className="animate-spin text-2xl mb-2">⚙️</div>
              <div className="text-sm text-gray-600">Loading 3D model...</div>
            </div>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-50 dark:bg-red-900/20 z-10">
            <div className="text-center text-red-600 dark:text-red-400">
              <div className="text-2xl mb-2">⚠️</div>
              <div className="text-sm">{error}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ThreeDRenderer;
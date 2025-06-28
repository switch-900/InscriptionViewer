import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Download, RotateCcw, ZoomIn, ZoomOut, Move3D } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as THREE from 'three';

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
    const supportedTypes = ['gltf', 'glb', 'obj'];
    const supportedExts = ['gltf', 'glb', 'obj', 'stl'];
    
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

      if (extension === 'obj') {
        // Simple OBJ loader (basic implementation)
        const text = new TextDecoder().decode(arrayBuffer);
        object = parseOBJ(text);
      } else if (extension === 'stl') {
        // Simple STL loader
        object = parseSTL(arrayBuffer);
      } else {
        // For GLTF/GLB and other formats, create a simple placeholder
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
        object = new THREE.Mesh(geometry, material);
      }

      if (object) {
        // Center and scale the model
        const box = new THREE.Box3().setFromObject(object);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        object.position.sub(center);
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 3 / maxDim;
        object.scale.setScalar(scale);

        // Remove previous model
        if (modelRef.current) {
          sceneRef.current.remove(modelRef.current);
        }

        sceneRef.current.add(object);
        modelRef.current = object;
      }

      setIsLoading(false);
    } catch (err) {
      console.error('Failed to load model:', err);
      setError('Failed to load 3D model');
      setIsLoading(false);
    }
  }, [src, fileExtension]);

  // Simple OBJ parser
  const parseOBJ = (text: string): THREE.Object3D => {
    const lines = text.split('\n');
    const vertices: number[] = [];
    const faces: number[] = [];

    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      if (parts[0] === 'v') {
        vertices.push(parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3]));
      } else if (parts[0] === 'f') {
        // Simple triangulation (assumes triangular faces)
        for (let i = 1; i < parts.length; i++) {
          const vertexIndex = parseInt(parts[i].split('/')[0]) - 1;
          faces.push(vertexIndex);
        }
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setIndex(faces);
    geometry.computeVertexNormals();

    const material = new THREE.MeshPhongMaterial({ color: 0x888888 });
    return new THREE.Mesh(geometry, material);
  };

  // Simple STL parser
  const parseSTL = (buffer: ArrayBuffer): THREE.Object3D => {
    const view = new DataView(buffer);
    const isASCII = buffer.byteLength < 80 || view.getUint32(80, true) * 50 + 84 !== buffer.byteLength;

    if (isASCII) {
      // ASCII STL (simplified)
      const text = new TextDecoder().decode(buffer);
      const vertices: number[] = [];
      const lines = text.split('\n');
      
      for (const line of lines) {
        if (line.trim().startsWith('vertex')) {
          const coords = line.trim().split(/\s+/).slice(1);
          vertices.push(parseFloat(coords[0]), parseFloat(coords[1]), parseFloat(coords[2]));
        }
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      geometry.computeVertexNormals();

      const material = new THREE.MeshPhongMaterial({ color: 0xaaaaaa });
      return new THREE.Mesh(geometry, material);
    } else {
      // Binary STL
      const triangleCount = view.getUint32(80, true);
      const vertices: number[] = [];

      for (let i = 0; i < triangleCount; i++) {
        const offset = 84 + i * 50;
        // Skip normal vector (12 bytes)
        for (let j = 0; j < 3; j++) {
          const vertexOffset = offset + 12 + j * 12;
          vertices.push(
            view.getFloat32(vertexOffset, true),
            view.getFloat32(vertexOffset + 4, true),
            view.getFloat32(vertexOffset + 8, true)
          );
        }
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      geometry.computeVertexNormals();

      const material = new THREE.MeshPhongMaterial({ color: 0xaaaaaa });
      return new THREE.Mesh(geometry, material);
    }
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
            {fileExtension?.toUpperCase() || 'Unknown'} format
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
            <span className="ml-2">{fileExtension?.toUpperCase()}</span>
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
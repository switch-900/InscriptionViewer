import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { 
  Download, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Move3D, 
  Maximize2,
  Sun,
  Lightbulb,
  Eye,
  RotateCw,
  Square,
  Settings
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import * as THREE from 'three';
import { safeExtensionFormat } from '../../../utils/safeFormatting';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js';

interface ThreeDRendererProps {
  src: string;
  mimeType: string;
  fileExtension?: string;
  maxHeight?: number;
  showControls?: boolean;
}

interface ModelInfo {
  vertices: number;
  faces: number;
  boundingBox: THREE.Box3;
  materials: number;
}

// Loader functions
const loadGLTF = async (arrayBuffer: ArrayBuffer, extension: string): Promise<THREE.Object3D> => {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    
    // Set up DRACO loader for compressed models
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
    loader.setDRACOLoader(dracoLoader);
    
    loader.parse(arrayBuffer, '', (gltf) => {
      console.log('✅ GLTF/GLB loaded successfully');
      resolve(gltf.scene);
    }, (error) => {
      console.error('❌ GLTF/GLB loading error:', error);
      reject(new Error(`Failed to parse ${extension.toUpperCase()}: ${error.message}`));
    });
  });
};

const loadOBJ = async (arrayBuffer: ArrayBuffer): Promise<THREE.Object3D> => {
  return new Promise((resolve, reject) => {
    const loader = new OBJLoader();
    const decoder = new TextDecoder();
    const objString = decoder.decode(arrayBuffer);
    try {
      const object = loader.parse(objString);
      console.log('✅ OBJ loaded successfully');
      resolve(object);
    } catch (error: any) {
      console.error('❌ OBJ loading error:', error);
      reject(new Error(`Failed to parse OBJ: ${error.message}`));
    }
  });
};

const loadSTL = async (arrayBuffer: ArrayBuffer): Promise<THREE.Object3D> => {
  return new Promise((resolve, reject) => {
    const loader = new STLLoader();
    try {
      const geometry = loader.parse(arrayBuffer);
      const material = new THREE.MeshPhongMaterial({ color: 0x888888 });
      const mesh = new THREE.Mesh(geometry, material);
      console.log('✅ STL loaded successfully');
      resolve(mesh);
    } catch (error: any) {
      console.error('❌ STL loading error:', error);
      reject(new Error(`Failed to parse STL: ${error.message}`));
    }
  });
};

const loadPLY = async (arrayBuffer: ArrayBuffer): Promise<THREE.Object3D> => {
  return new Promise((resolve, reject) => {
    const loader = new PLYLoader();
    try {
      const geometry = loader.parse(arrayBuffer);
      const material = new THREE.MeshPhongMaterial({ color: 0x888888 });
      const mesh = new THREE.Mesh(geometry, material);
      console.log('✅ PLY loaded successfully');
      resolve(mesh);
    } catch (error: any) {
      console.error('❌ PLY loading error:', error);
      reject(new Error(`Failed to parse PLY: ${error.message}`));
    }
  });
};

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
  const controlsRef = useRef<{ update: () => void } | null>(null);
  const frameRef = useRef<number | undefined>(undefined);
  const lightsRef = useRef<THREE.Light[]>([]);
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [autoRotate, setAutoRotate] = useState(true);
  const [wireframe, setWireframe] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [environmentLighting, setEnvironmentLighting] = useState(true);
  const [performanceMode, setPerformanceMode] = useState(false);

  // Mouse interaction state
  const [isDragging, setIsDragging] = useState(false);
  const [previousMousePosition, setPreviousMousePosition] = useState({ x: 0, y: 0 });
  const rotationRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0, y: 0 });

  // Performance monitoring
  const [fps, setFps] = useState(60);
  const fpsRef = useRef({ frames: 0, lastTime: performance.now() });

  const supportedFormats = useMemo(() => {
    return new Set(['gltf', 'glb', 'obj', 'stl', 'ply', 'dae', '3ds', 'fbx']);
  }, []);

  const isSupported = useMemo(() => {
    const ext = fileExtension?.toLowerCase() || '';
    return supportedFormats.has(ext) || 
           mimeType.includes('gltf') || 
           mimeType.includes('model/');
  }, [mimeType, fileExtension, supportedFormats]);

  const initScene = useCallback(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // Scene with better background
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f9fa);
    scene.fog = new THREE.Fog(0xf8f9fa, 10, 50);
    sceneRef.current = scene;

    // Camera with better defaults
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(5, 3, 5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer with enhanced settings for performance
    const renderer = new THREE.WebGLRenderer({ 
      antialias: !performanceMode && window.devicePixelRatio <= 1, // Only antialias in high quality mode
      alpha: true,
      powerPreference: "high-performance",
      stencil: false, // Disable stencil buffer for better performance
      depth: true,
      preserveDrawingBuffer: false // Better performance
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(performanceMode ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !performanceMode; // Disable shadows in performance mode
    if (!performanceMode) {
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    
    // Performance optimizations
    renderer.info.autoReset = false; // Manual reset for better performance monitoring
    rendererRef.current = renderer;

    // CRITICAL FIX: Style the canvas to fill container properly
    const canvas = renderer.domElement;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    canvas.style.objectFit = 'contain';

    setupLighting(scene);
    mountRef.current.appendChild(canvas);
  }, [performanceMode]);

  const setupLighting = useCallback((scene: THREE.Scene) => {
    // Clear existing lights
    lightsRef.current.forEach(light => scene.remove(light));
    lightsRef.current = [];

    if (environmentLighting && !performanceMode) {
      // HDRI-style environment lighting (full quality)
      const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
      scene.add(ambientLight);
      lightsRef.current.push(ambientLight);

      // Key light with shadows
      const keyLight = new THREE.DirectionalLight(0xffffff, 1);
      keyLight.position.set(10, 10, 5);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.setScalar(1024); // Reduced for performance
      keyLight.shadow.camera.near = 0.1;
      keyLight.shadow.camera.far = 50;
      keyLight.shadow.camera.left = -10;
      keyLight.shadow.camera.right = 10;
      keyLight.shadow.camera.top = 10;
      keyLight.shadow.camera.bottom = -10;
      scene.add(keyLight);
      lightsRef.current.push(keyLight);

      // Fill light
      const fillLight = new THREE.DirectionalLight(0x7fb8ff, 0.4);
      fillLight.position.set(-5, 5, -5);
      scene.add(fillLight);
      lightsRef.current.push(fillLight);

      // Rim light
      const rimLight = new THREE.DirectionalLight(0xff7f00, 0.3);
      rimLight.position.set(0, -10, -10);
      scene.add(rimLight);
      lightsRef.current.push(rimLight);
    } else {
      // Simple lighting
      const ambientLight = new THREE.AmbientLight(0x404040, 0.8);
      scene.add(ambientLight);
      lightsRef.current.push(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);
      lightsRef.current.push(directionalLight);
    }
  }, [environmentLighting, performanceMode]);

  const analyzeModel = (object: THREE.Object3D): ModelInfo => {
    let vertices = 0;
    let faces = 0;
    let materials = 0;
    const boundingBox = new THREE.Box3();

    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const geometry = child.geometry;
        if (geometry.attributes.position) {
          vertices += geometry.attributes.position.count;
        }
        if (geometry.index) {
          faces += geometry.index.count / 3;
        } else {
          faces += vertices / 3;
        }
        materials++;
      }
    });

    boundingBox.setFromObject(object);
    
    return { vertices, faces, boundingBox, materials };
  };

  const createModelFromGeometry = (geometry: THREE.BufferGeometry, color = 0x888888): THREE.Mesh => {
    geometry.computeVertexNormals();
    geometry.computeBoundingBox();
    
    const material = new THREE.MeshPhongMaterial({ 
      color,
      side: THREE.DoubleSide,
      transparent: false,
      wireframe: false
    });
    
    return new THREE.Mesh(geometry, material);
  };

  const loadModel = useCallback(async () => {
    if (!sceneRef.current) return;

    // Only prevent reload if we already have this exact source loaded
    if (modelRef.current?.userData.loadedSrc === src && !isLoading) {
      console.log('🎮 Model already loaded for this source, skipping reload');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setLoadingProgress(0);

      console.log('🎮 Loading 3D model from:', src);

      const response = await fetch(src);
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      
      setLoadingProgress(25);
      const arrayBuffer = await response.arrayBuffer();
      setLoadingProgress(50);
      
      const extension = fileExtension?.toLowerCase() || '';
      let object: THREE.Object3D | null = null;

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
        case 'gltf':
        case 'glb':
          object = await loadGLTF(arrayBuffer, extension);
          break;
        default:
          object = createUnsupportedPlaceholder(extension || 'unknown');
          break;
      }

      setLoadingProgress(75);

      if (object) {
        // Analyze model
        const info = analyzeModel(object);
        setModelInfo(info);

        // Center and scale the model
        const box = new THREE.Box3().setFromObject(object);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        const scale = 4 / maxDim;
        
        object.position.sub(center);
        object.scale.setScalar(scale);

        // Remove only the previous model, not the entire scene
        if (modelRef.current) {
          sceneRef.current.remove(modelRef.current);
          // Dispose of previous model
          modelRef.current.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.geometry?.dispose();
              if (Array.isArray(child.material)) {
                child.material.forEach(mat => mat.dispose());
              } else {
                child.material?.dispose();
              }
            }
          });
        }

        // Add the new model and track the source
        object.userData.loadedSrc = src;
        sceneRef.current.add(object);
        modelRef.current = object;

        // Add ground plane if it doesn't exist
        const existingPlane = sceneRef.current.children.find(child => child.userData.isGroundPlane);
        if (!existingPlane) {
          const planeGeometry = new THREE.PlaneGeometry(20, 20);
          const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.2 });
          const plane = new THREE.Mesh(planeGeometry, planeMaterial);
          plane.rotation.x = -Math.PI / 2;
          plane.position.y = box.min.y * scale - center.y * scale - 0.1;
          plane.receiveShadow = true;
          plane.userData.isGroundPlane = true;
          sceneRef.current.add(plane);
        }

        // Enable shadows on model
        object.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        console.log(`✅ Successfully loaded 3D model: ${extension}`);
      }

      setLoadingProgress(100);
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to load 3D model:', err);
      const ext = fileExtension?.toLowerCase() || 'unknown';
      setError(`Failed to load ${ext.toUpperCase()} model: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setIsLoading(false);
      setLoadingProgress(0);
    }
  }, [src]); // Only depend on src

  const createUnsupportedPlaceholder = (format: string): THREE.Object3D => {
    const group = new THREE.Group();
    
    // Create a more sophisticated wireframe model
    const geometry = new THREE.IcosahedronGeometry(1.5, 1);
    const wireframe = new THREE.WireframeGeometry(geometry);
    const material = new THREE.LineBasicMaterial({ color: 0x666666, linewidth: 2 });
    const mesh = new THREE.LineSegments(wireframe, material);
    group.add(mesh);
    
    // Add rotating inner sphere
    const sphereGeometry = new THREE.SphereGeometry(0.8, 16, 16);
    const sphereMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x444444, 
      transparent: true, 
      opacity: 0.3,
      wireframe: true 
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    group.add(sphere);
    
    return group;
  };

  const animate = useCallback(() => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

    let needsRender = false;

    // FPS monitoring (reduce frequency)
    fpsRef.current.frames++;
    const now = performance.now();
    if (now - fpsRef.current.lastTime >= 2000) {
      setFps(Math.round((fpsRef.current.frames * 1000) / (now - fpsRef.current.lastTime)));
      fpsRef.current.frames = 0;
      fpsRef.current.lastTime = now;
    }

    if (modelRef.current) {
      if (autoRotate && !isDragging) {
        targetRotationRef.current.y += 0.01;
        needsRender = true;
      }
      
      // Smooth rotation interpolation
      const deltaX = targetRotationRef.current.x - rotationRef.current.x;
      const deltaY = targetRotationRef.current.y - rotationRef.current.y;
      
      if (Math.abs(deltaX) > 0.001 || Math.abs(deltaY) > 0.001) {
        rotationRef.current.x += deltaX * 0.1;
        rotationRef.current.y += deltaY * 0.1;
        
        modelRef.current.rotation.x = rotationRef.current.x;
        modelRef.current.rotation.y = rotationRef.current.y;
        needsRender = true;
      }

      // Update wireframe if changed
      if (wireframe !== modelRef.current.userData.lastWireframe) {
        modelRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(mat => {
                if ('wireframe' in mat) mat.wireframe = wireframe;
              });
            } else if ('wireframe' in child.material) {
              child.material.wireframe = wireframe;
            }
          }
        });
        modelRef.current.userData.lastWireframe = wireframe;
        needsRender = true;
      }
    }

    // Apply zoom if changed
    if (cameraRef.current && cameraRef.current.userData.lastZoom !== zoom) {
      const distance = 8 / zoom;
      cameraRef.current.position.setLength(distance);
      cameraRef.current.lookAt(0, 0, 0);
      cameraRef.current.userData.lastZoom = zoom;
      needsRender = true;
    }

    // Render when needed or dragging
    if (needsRender || isDragging) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }

    frameRef.current = requestAnimationFrame(animate);
  }, [autoRotate, zoom, wireframe, isDragging]);

  // Optimized mouse handlers
  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    if (event.button !== 0) return;
    
    event.preventDefault();
    event.stopPropagation();
    
    setIsDragging(true);
    setAutoRotate(false);
    setPreviousMousePosition({ x: event.clientX, y: event.clientY });
  }, []);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (!isDragging) return;
    
    event.preventDefault();
    event.stopPropagation();

    const deltaX = event.clientX - previousMousePosition.x;
    const deltaY = event.clientY - previousMousePosition.y;

    if (Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1) {
      targetRotationRef.current.x += deltaY * 0.01;
      targetRotationRef.current.y += deltaX * 0.01;
      setPreviousMousePosition({ x: event.clientX, y: event.clientY });
    }
  }, [isDragging, previousMousePosition]);

  const handleMouseUp = useCallback((event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((event: React.WheelEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const delta = event.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => {
      const newZoom = Math.max(0.1, Math.min(prev * delta, 10));
      // Only update if zoom actually changes significantly
      return Math.abs(newZoom - prev) > 0.01 ? newZoom : prev;
    });
  }, []);

  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.2, 10));
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.2, 0.1));
  
  const handleReset = () => {
    setZoom(1);
    rotationRef.current = { x: 0, y: 0 };
    targetRotationRef.current = { x: 0, y: 0 };
    setAutoRotate(true);
    setWireframe(false);
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(src);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
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
      setError('Download failed');
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!modelRef.current) return;
      
      switch (e.key.toLowerCase()) {
        case 'r':
          handleReset();
          break;
        case ' ':
          e.preventDefault();
          setAutoRotate(prev => !prev);
          break;
        case 'w':
          setWireframe(prev => !prev);
          break;
        case 'f':
          setIsFullscreen(prev => !prev);
          break;
        case 'escape':
          if (isFullscreen) setIsFullscreen(false);
          break;
      }
    };

    if (isFullscreen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isFullscreen]);

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
      if (rendererRef.current && mountRef.current?.contains(rendererRef.current.domElement)) {
        mountRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
      // Cleanup geometries and materials
      if (modelRef.current) {
        modelRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry?.dispose();
            if (Array.isArray(child.material)) {
              child.material.forEach(mat => mat.dispose());
            } else {
              child.material?.dispose();
            }
          }
        });
      }
    };
  }, [src]); // Only depend on src to prevent unnecessary reloads

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

  // Re-setup lighting when performance mode or environment lighting changes
  useEffect(() => {
    if (sceneRef.current && !isLoading) {
      setupLighting(sceneRef.current);
    }
  }, [environmentLighting, performanceMode]); // Removed setupLighting dependency

  const controlsHeight = showControls ? 120 : 0;
  const containerHeight = isFullscreen ? '100vh' : `${maxHeight - controlsHeight}px`;

  if (!isSupported) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-4">🎮</div>
          <div className="text-lg font-medium mb-2">3D Model Viewer</div>
          <div className="text-sm text-gray-400 mb-4">
            {safeExtensionFormat(fileExtension)} format not yet supported
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="text-sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Model
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 bg-white dark:bg-gray-900' : 'rounded-lg overflow-hidden border'}`}>
      {showControls && (
        <>
          {/* Main Controls */}
          <div className="flex justify-between items-center p-3 border-b bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center gap-4">
              <div className="text-xs text-gray-600 dark:text-gray-400">
                <span className="font-mono bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                  3D Model
                </span>
                <span className="ml-2">{safeExtensionFormat(fileExtension)}</span>
              </div>
              
              {modelInfo && !isLoading && (
                <div className="text-xs text-gray-500 space-x-3">
                  <span>{modelInfo.vertices.toLocaleString()} vertices</span>
                  <span>{Math.round(modelInfo.faces).toLocaleString()} faces</span>
                  <span>{fps} FPS</span>
                </div>
              )}
            </div>

            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomOut}
                className="h-8 px-2 text-xs"
                disabled={isLoading}
                title="Zoom out"
              >
                <ZoomOut className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomIn}
                className="h-8 px-2 text-xs"
                disabled={isLoading}
                title="Zoom in"
              >
                <ZoomIn className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="h-8 px-2 text-xs"
                disabled={isLoading}
                title="Reset view (R)"
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
              <Button
                variant={autoRotate ? "default" : "ghost"}
                size="sm"
                onClick={() => setAutoRotate(!autoRotate)}
                className="h-8 px-2 text-xs"
                disabled={isLoading}
                title="Auto rotate (Space)"
              >
                <RotateCw className="h-3 w-3" />
              </Button>
              <Button
                variant={wireframe ? "default" : "ghost"}
                size="sm"
                onClick={() => setWireframe(!wireframe)}
                className="h-8 px-2 text-xs"
                disabled={isLoading}
                title="Wireframe (W)"
              >
                <Square className="h-3 w-3" />
              </Button>
              <Button
                variant={environmentLighting ? "default" : "ghost"}
                size="sm"
                onClick={() => setEnvironmentLighting(!environmentLighting)}
                className="h-8 px-2 text-xs"
                disabled={isLoading}
                title="Environment lighting"
              >
                <Sun className="h-3 w-3" />
              </Button>
              <Button
                variant={performanceMode ? "default" : "ghost"}
                size="sm"
                onClick={() => setPerformanceMode(!performanceMode)}
                className="h-8 px-2 text-xs"
                disabled={isLoading}
                title="Performance mode"
              >
                <Settings className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="h-8 px-2 text-xs"
                title="Fullscreen (F)"
              >
                <Maximize2 className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownload}
                className="h-8 px-2 text-xs"
                title="Download model"
              >
                <Download className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Info Bar */}
          <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 border-b text-xs text-gray-600 dark:text-gray-400">
            <div className="flex justify-between items-center">
              <div className="flex gap-4">
                {isLoading && (
                  <span className="text-blue-600">Loading... {loadingProgress}%</span>
                )}
                {error && (
                  <span className="text-red-600">Error: {error}</span>
                )}
                {!isLoading && !error && (
                  <span className="text-green-600">Ready</span>
                )}
              </div>
              <div className="text-gray-500">
                Drag to rotate • Scroll to zoom • Space to toggle rotation
              </div>
            </div>
          </div>
        </>
      )}

      <div 
        ref={mountRef}
        className={`flex-1 relative w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{ 
          height: containerHeight,
          minHeight: isFullscreen ? '100vh' : '300px',
          margin: 0,
          padding: 0,
          overflow: 'hidden',
          userSelect: 'none',
          touchAction: 'none' // Prevent touch scrolling
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onContextMenu={(e) => e.preventDefault()} // Prevent right-click menu
        tabIndex={0} // Make it focusable for keyboard events
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/90 dark:bg-gray-900/90 z-10">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <div className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                Loading 3D Model
              </div>
              <div className="text-sm text-gray-500 mb-3">
                {safeExtensionFormat(fileExtension)} • {loadingProgress}%
              </div>
              <div className="w-48 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mx-auto">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-50/90 dark:bg-red-900/20 z-10">
            <div className="text-center text-red-600 dark:text-red-400 max-w-md px-4">
              <div className="text-4xl mb-4">⚠️</div>
              <div className="text-lg font-medium mb-2">Failed to Load Model</div>
              <div className="text-sm mb-4 bg-white dark:bg-gray-800 p-3 rounded border">
                {error}
              </div>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" size="sm" onClick={loadModel}>
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Retry
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Fullscreen controls */}
        {isFullscreen && !isLoading && (
          <div className="absolute top-4 right-4 flex gap-2 z-20">
            <div className="bg-black/70 text-white text-xs px-3 py-1 rounded">
              ESC to exit • R to reset • Space to rotate • W for wireframe
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(false)}
              className="bg-black/70 text-white hover:bg-black/90"
            >
              ✕ Exit
            </Button>
          </div>
        )}

        {/* Zoom indicator */}
        {zoom !== 1 && !isFullscreen && !isLoading && (
          <div className="absolute bottom-4 left-4 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {Math.round(zoom * 100)}% zoom
          </div>
        )}
      </div>
    </div>
  );
}

export default ThreeDRenderer;
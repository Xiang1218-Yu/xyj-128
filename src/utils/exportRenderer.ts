import * as THREE from 'three';

export interface ExportCameraOptions {
  position?: THREE.Vector3;
  target?: THREE.Vector3;
  fov?: number;
}

export const DEFAULT_EXPORT_CAMERA: ExportCameraOptions = {
  position: new THREE.Vector3(0, 18, 24),
  target: new THREE.Vector3(0, 0, 0),
  fov: 40,
};

export function createExportRenderer(
  width: number,
  height: number,
  pixelRatio: number,
  referenceGl: THREE.WebGLRenderer
): THREE.WebGLRenderer {
  const canvas = document.createElement('canvas');
  canvas.width = Math.floor(width * pixelRatio);
  canvas.height = Math.floor(height * pixelRatio);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    preserveDrawingBuffer: true,
  });

  renderer.setSize(width, height, false);
  renderer.setPixelRatio(pixelRatio);
  renderer.outputColorSpace = referenceGl.outputColorSpace;
  renderer.toneMapping = referenceGl.toneMapping;
  renderer.toneMappingExposure = referenceGl.toneMappingExposure;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = referenceGl.shadowMap.type;

  const bgColor = new THREE.Color('#0a0a0f');
  renderer.setClearColor(bgColor, 1);

  return renderer;
}

export function createExportCamera(
  width: number,
  height: number,
  options: ExportCameraOptions = {}
): THREE.PerspectiveCamera {
  const {
    position = DEFAULT_EXPORT_CAMERA.position!,
    target = DEFAULT_EXPORT_CAMERA.target!,
    fov = DEFAULT_EXPORT_CAMERA.fov!,
  } = options;

  const camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 1000);
  camera.position.copy(position);
  camera.lookAt(target);
  camera.updateProjectionMatrix();

  return camera;
}

export function renderSceneToCanvas(
  scene: THREE.Scene,
  camera: THREE.Camera,
  renderer: THREE.WebGLRenderer
): HTMLCanvasElement {
  renderer.render(scene, camera);
  return renderer.domElement;
}

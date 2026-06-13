import { MutableRefObject } from 'react';
import * as THREE from 'three';
import { getKeyboardConfigInfo } from './exportConfig';
import { drawConfigPanel, DEFAULT_PANEL_STYLE } from './exportPanel';
import { createExportRenderer, createExportCamera, renderSceneToCanvas } from './exportRenderer';

const HD_SCALE = 2;
const BASE_WIDTH = 1200;
const BASE_HEIGHT = 800;

export interface ExportOptions {
  scale?: number;
  width?: number;
  height?: number;
  cameraPosition?: THREE.Vector3;
  cameraTarget?: THREE.Vector3;
}

function calculateExportDimensions(
  referenceGl: THREE.WebGLRenderer,
  options: ExportOptions = {}
): { width: number; height: number; pixelRatio: number } {
  const originalSize = new THREE.Vector2();
  referenceGl.getSize(originalSize);
  const originalPixelRatio = referenceGl.getPixelRatio();

  const scale = options.scale ?? HD_SCALE;
  const baseWidth = options.width ?? originalSize.x;
  const baseHeight = options.height ?? originalSize.y;

  return {
    width: Math.floor(baseWidth * scale),
    height: Math.floor(baseHeight * scale),
    pixelRatio: Math.min(originalPixelRatio * scale, 2),
  };
}

function downloadCanvas(canvas: HTMLCanvasElement, filename: string) {
  canvas.toBlob(
    (blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    'image/png',
    1.0
  );
}

function generateFilename(): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  return `keyboard-studio-${timestamp}.png`;
}

export async function exportSceneAsImage(
  glRef: MutableRefObject<THREE.WebGLRenderer | null>,
  sceneRef: MutableRefObject<THREE.Scene | null>,
  _cameraRef: MutableRefObject<THREE.Camera | null>,
  options: ExportOptions = {}
) {
  const mainGl = glRef.current;
  const scene = sceneRef.current;

  if (!mainGl || !scene) {
    return;
  }

  const { width, height, pixelRatio } = calculateExportDimensions(mainGl, options);

  const renderer = createExportRenderer(width, height, pixelRatio, mainGl);

  const cameraOptions = options.cameraPosition || options.cameraTarget
    ? { position: options.cameraPosition, target: options.cameraTarget }
    : undefined;

  const exportCamera = createExportCamera(width, height, cameraOptions);

  const sceneCanvas = renderSceneToCanvas(scene, exportCamera, renderer);

  const scale = sceneCanvas.width / 1920;
  const panelHeight = Math.floor(DEFAULT_PANEL_STYLE.height * scale * 1.2);

  const totalWidth = sceneCanvas.width;
  const totalHeight = sceneCanvas.height + panelHeight;

  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = totalWidth;
  exportCanvas.height = totalHeight;
  const ctx = exportCanvas.getContext('2d')!;

  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, totalWidth, totalHeight);

  ctx.drawImage(sceneCanvas, 0, 0, sceneCanvas.width, sceneCanvas.height);

  const config = getKeyboardConfigInfo();
  drawConfigPanel(ctx, totalWidth, sceneCanvas.height, panelHeight, config, scale);

  renderer.dispose();

  downloadCanvas(exportCanvas, generateFilename());
}

export { getKeyboardConfigInfo, drawConfigPanel };

import { MutableRefObject } from 'react';
import * as THREE from 'three';
import { useKeyboardStore } from '@/store/useKeyboardStore';
import { MATERIAL_CONFIGS } from '@/data/materials';
import { SWITCH_CONFIGS } from '@/data/switches';
import { ZONE_CONFIGS } from '@/data/zones';
import { LIGHTING_MODES } from '@/data/lighting';
import { FONT_CONFIGS } from '@/data/fonts';
import { LAYOUT_CONFIGS } from '@/data/layouts';
import { KeyZone } from '@/types/keyboard';

const HD_SCALE = 2;
const CONFIG_PANEL_HEIGHT = 280;
const PADDING = 40;
const COLOR_SWATCH_SIZE = 18;

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawConfigPanel(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  panelY: number,
  panelHeight: number,
  state: ReturnType<typeof useKeyboardStore.getState>
) {
  drawRoundedRect(ctx, 0, panelY, canvasWidth, panelHeight, 0);
  ctx.fillStyle = '#0d0d14';
  ctx.fill();

  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, panelY, canvasWidth, 1);

  const contentY = panelY + PADDING;
  const colWidth = (canvasWidth - PADDING * 4) / 3;
  let rowY = contentY;

  const drawSection = (
    x: number,
    y: number,
    title: string,
    lines: { label: string; value: string; color?: string }[]
  ) => {
    ctx.font = 'bold 16px Inter, system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#818cf8';
    ctx.fillText(title, x, y);

    y += 28;
    ctx.font = '14px Inter, system-ui, -apple-system, sans-serif';

    for (const line of lines) {
      ctx.fillStyle = '#9ca3af';
      ctx.fillText(line.label, x, y);
      ctx.fillStyle = line.color || '#e5e7eb';
      ctx.fillText(line.value, x + 90, y);
      y += 24;
    }

    return y;
  };

  const layoutConfig = LAYOUT_CONFIGS[state.layout];
  const materialConfig = MATERIAL_CONFIGS[state.caseMaterial];
  const switchConfig = SWITCH_CONFIGS[state.switchType];
  const lightingConfig = LIGHTING_MODES[state.lightingMode];
  const fontConfig = FONT_CONFIGS[state.fontStyle];

  const x0 = PADDING;
  const x1 = PADDING * 2 + colWidth;
  const x2 = PADDING * 3 + colWidth * 2;

  drawSection(x0, rowY, '⌨ 布局与材质', [
    { label: '布局', value: `${layoutConfig.name} (${layoutConfig.keys.length}键)` },
    { label: '外壳材质', value: materialConfig.name, color: materialConfig.color },
    { label: '轴体', value: switchConfig.name, color: switchConfig.color },
    { label: '轴体类型', value: switchConfig.description },
  ]);

  drawSection(x1, rowY, '🎨 字体与灯光', [
    { label: '字体', value: fontConfig.name },
    { label: 'RGB', value: state.rgbEnabled ? '开启' : '关闭' },
    { label: '灯光模式', value: lightingConfig.name },
    { label: '亮度', value: `${Math.round(state.rgbBrightness * 100)}%` },
    { label: '速度', value: `${state.rgbSpeed.toFixed(1)}x` },
  ]);

  const zoneLines: { label: string; value: string; color: string }[] = [];
  const zones: KeyZone[] = ['alphanumeric', 'function', 'navigation', 'numpad', 'modifiers', 'spacebar'];
  for (const zone of zones) {
    const zoneName = ZONE_CONFIGS[zone].name;
    const color = state.zoneColors[zone];
    zoneLines.push({ label: zoneName, value: color, color });
  }

  const zoneY = drawSection(x2, rowY, '🌈 区域配色', zoneLines);

  for (let i = 0; i < zones.length; i++) {
    const color = state.zoneColors[zones[i]];
    ctx.fillStyle = color;
    drawRoundedRect(ctx, x2 + 90 + 70, rowY + 28 + 5 + i * 24, COLOR_SWATCH_SIZE, COLOR_SWATCH_SIZE, 4);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1;
    drawRoundedRect(ctx, x2 + 90 + 70, rowY + 28 + 5 + i * 24, COLOR_SWATCH_SIZE, COLOR_SWATCH_SIZE, 4);
    ctx.stroke();
  }

  const bottomY = Math.max(zoneY, contentY + 180) + 16;
  ctx.fillStyle = '#374151';
  ctx.font = '12px Inter, system-ui, -apple-system, sans-serif';
  ctx.fillText(
    `导出时间: ${new Date().toLocaleString('zh-CN')}  |  Keyboard Studio - 3D 键盘定制器`,
    PADDING,
    bottomY
  );
}

export async function exportSceneAsImage(
  glRef: MutableRefObject<THREE.WebGLRenderer | null>,
  sceneRef: MutableRefObject<THREE.Scene | null>,
  cameraRef: MutableRefObject<THREE.Camera | null>
) {
  const scene = sceneRef.current;
  const camera = cameraRef.current;
  const mainGl = glRef.current;

  if (!mainGl || !scene || !camera) {
    return;
  }

  const state = useKeyboardStore.getState();

  const originalSize = new THREE.Vector2();
  mainGl.getSize(originalSize);
  const originalPixelRatio = mainGl.getPixelRatio();

  const hdWidth = Math.floor(originalSize.x * HD_SCALE);
  const hdHeight = Math.floor(originalSize.y * HD_SCALE);
  const hdPixelRatio = Math.min(originalPixelRatio * HD_SCALE, 2);

  const offscreenCanvas = document.createElement('canvas');
  offscreenCanvas.width = Math.floor(hdWidth * hdPixelRatio);
  offscreenCanvas.height = Math.floor(hdHeight * hdPixelRatio);

  const exportGl = new THREE.WebGLRenderer({
    canvas: offscreenCanvas,
    antialias: true,
    alpha: false,
    preserveDrawingBuffer: true,
  });
  exportGl.setSize(hdWidth, hdHeight, false);
  exportGl.setPixelRatio(hdPixelRatio);
  exportGl.outputColorSpace = mainGl.outputColorSpace;
  exportGl.toneMapping = mainGl.toneMapping;
  exportGl.toneMappingExposure = mainGl.toneMappingExposure;
  exportGl.shadowMap.enabled = true;
  exportGl.shadowMap.type = mainGl.shadowMap.type;

  const bgColor = new THREE.Color('#0a0a0f');
  exportGl.setClearColor(bgColor, 1);

  const exportCamera = camera.clone() as THREE.PerspectiveCamera;
  exportCamera.aspect = hdWidth / hdHeight;
  exportCamera.updateProjectionMatrix();
  exportCamera.position.copy(camera.position);
  exportCamera.quaternion.copy(camera.quaternion);

  exportGl.render(scene, exportCamera);

  const configPanelHeightPx = Math.floor(CONFIG_PANEL_HEIGHT * (offscreenCanvas.width / 1920));

  const totalWidth = offscreenCanvas.width;
  const totalHeight = offscreenCanvas.height + configPanelHeightPx;

  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = totalWidth;
  exportCanvas.height = totalHeight;
  const ctx = exportCanvas.getContext('2d')!;

  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, totalWidth, totalHeight);

  ctx.drawImage(offscreenCanvas, 0, 0, offscreenCanvas.width, offscreenCanvas.height);

  drawConfigPanel(ctx, totalWidth, offscreenCanvas.height, configPanelHeightPx, state);

  exportGl.dispose();

  exportCanvas.toBlob(
    (blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      a.download = `keyboard-studio-${timestamp}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    'image/png',
    1.0
  );
}

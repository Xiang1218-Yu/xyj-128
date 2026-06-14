import * as THREE from 'three';
import { CaseMaterial, TextureDetailLevel, WearLevel, EngravingType } from '@/types/keyboard';

const getDetailMultiplier = (detail: TextureDetailLevel): number => {
  switch (detail) {
    case 'low': return 0.3;
    case 'medium': return 0.6;
    case 'high': return 1.0;
    case 'ultra': return 1.8;
  }
};

const getTextureSize = (detail: TextureDetailLevel): number => {
  switch (detail) {
    case 'low': return 256;
    case 'medium': return 512;
    case 'high': return 1024;
    case 'ultra': return 2048;
  }
};

const getWearIntensity = (wear: WearLevel): { scratches: number; discolor: number; patina: number } => {
  switch (wear) {
    case 'none': return { scratches: 0, discolor: 0, patina: 0 };
    case 'light': return { scratches: 0.15, discolor: 0.05, patina: 0 };
    case 'moderate': return { scratches: 0.4, discolor: 0.15, patina: 0.1 };
    case 'heavy': return { scratches: 0.7, discolor: 0.3, patina: 0.25 };
    case 'vintage': return { scratches: 0.9, discolor: 0.5, patina: 0.5 };
  }
};

export function generateWoodTexture(detail: TextureDetailLevel = 'high'): THREE.CanvasTexture {
  const size = getTextureSize(detail);
  const mult = getDetailMultiplier(detail);
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const baseColor = '#7c4a1e';
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const lineCount = Math.floor(80 * mult);
  for (let i = 0; i < lineCount; i++) {
    const y = (i / lineCount) * canvas.height + (Math.random() - 0.5) * 20;
    const opacity = 0.05 + Math.random() * 0.12;
    const hue = 25 + Math.random() * 15;
    const light = 20 + Math.random() * 15;
    ctx.strokeStyle = `hsla(${hue}, 60%, ${light}%, ${opacity})`;
    ctx.lineWidth = (2 + Math.random() * 8) * mult;
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= canvas.width; x += 50) {
      ctx.lineTo(x, y + Math.sin(x * 0.008 + i * 0.5) * (8 + Math.random() * 12));
    }
    ctx.stroke();
  }

  const knotCount = Math.floor(30 * mult);
  for (let i = 0; i < knotCount; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = (3 + Math.random() * 15) * mult;
    const opacity = 0.03 + Math.random() * 0.08;
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, `rgba(60, 30, 10, ${opacity})`);
    gradient.addColorStop(1, 'rgba(60, 30, 10, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  if (mult >= 1) {
    const fineLineCount = Math.floor(500 * mult);
    for (let i = 0; i < fineLineCount; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const length = (10 + Math.random() * 50) * mult;
      const opacity = 0.01 + Math.random() * 0.03;
      ctx.strokeStyle = `rgba(40, 20, 5, ${opacity})`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + length, y + (Math.random() - 0.5) * 2);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

export function generateBrushedMetalTexture(detail: TextureDetailLevel = 'high'): THREE.CanvasTexture {
  const size = getTextureSize(detail);
  const mult = getDetailMultiplier(detail);
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#8a8f98';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const brushCount = Math.floor(2000 * mult);
  for (let i = 0; i < brushCount; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const length = (50 + Math.random() * 200) * mult;
    const opacity = 0.02 + Math.random() * 0.08;
    const hue = 210 + Math.random() * 20;
    const light = 40 + Math.random() * 30;
    ctx.strokeStyle = `hsla(${hue}, 5%, ${light}%, ${opacity})`;
    ctx.lineWidth = (0.5 + Math.random() * 2) * Math.max(0.5, mult * 0.7);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + length, y + (Math.random() - 0.5) * 3);
    ctx.stroke();
  }

  const speckCount = Math.floor(500 * mult);
  for (let i = 0; i < speckCount; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size_s = (1 + Math.random() * 3) * Math.max(0.5, mult * 0.7);
    const opacity = 0.01 + Math.random() * 0.04;
    ctx.fillStyle = `rgba(200, 210, 220, ${opacity})`;
    ctx.fillRect(x, y, size_s, size_s);
  }

  if (mult >= 1) {
    const microCount = Math.floor(3000 * mult);
    for (let i = 0; i < microCount; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const opacity = 0.005 + Math.random() * 0.02;
      ctx.fillStyle = Math.random() > 0.5
        ? `rgba(255, 255, 255, ${opacity})`
        : `rgba(50, 60, 70, ${opacity})`;
      ctx.fillRect(x, y, 0.5, 0.5);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

export function generateCarbonFiberTexture(detail: TextureDetailLevel = 'high'): THREE.CanvasTexture {
  const size = getTextureSize(detail);
  const mult = getDetailMultiplier(detail);
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#1a1f2e';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const tileSize = Math.max(4, Math.floor(8 * Math.max(0.5, mult * 0.8)));
  for (let y = 0; y < canvas.height; y += tileSize) {
    for (let x = 0; x < canvas.width; x += tileSize * 2) {
      const offset = (y / tileSize) % 2 === 0 ? 0 : tileSize;
      
      ctx.fillStyle = 'rgba(40, 50, 70, 0.6)';
      ctx.fillRect(x + offset, y, tileSize, tileSize);
      
      ctx.fillStyle = 'rgba(20, 25, 40, 0.4)';
      ctx.fillRect(x + offset + tileSize, y, tileSize, tileSize);
    }
  }

  for (let i = 0; i < canvas.height; i += tileSize) {
    ctx.strokeStyle = 'rgba(100, 120, 180, 0.08)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(canvas.width, i);
    ctx.stroke();
  }

  const reflectionCount = Math.floor(150 * mult);
  for (let i = 0; i < reflectionCount; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size_s = (0.5 + Math.random() * 1.5) * Math.max(0.5, mult * 0.7);
    const opacity = 0.05 + Math.random() * 0.1;
    ctx.fillStyle = `rgba(120, 150, 200, ${opacity})`;
    ctx.beginPath();
    ctx.arc(x, y, size_s, 0, Math.PI * 2);
    ctx.fill();
  }

  if (mult >= 1) {
    const gridCount = Math.floor(canvas.height / (tileSize * 2));
    for (let g = 0; g < gridCount; g++) {
      const yPos = g * tileSize * 2;
      ctx.strokeStyle = `rgba(80, 110, 160, ${0.03 + Math.random() * 0.03})`;
      ctx.lineWidth = 0.3;
      ctx.beginPath();
      ctx.moveTo(0, yPos);
      ctx.lineTo(canvas.width, yPos + (Math.random() - 0.5) * 2);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

export function generatePlasticTexture(detail: TextureDetailLevel = 'medium'): THREE.CanvasTexture {
  const size = getTextureSize(detail);
  const mult = getDetailMultiplier(detail);
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#2d3748';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const grainCount = Math.floor(10000 * mult);
  for (let i = 0; i < grainCount; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size_s = (0.3 + Math.random() * 1.2) * Math.max(0.5, mult * 0.7);
    const opacity = 0.01 + Math.random() * 0.05;
    const isLight = Math.random() > 0.5;
    ctx.fillStyle = isLight 
      ? `rgba(80, 90, 110, ${opacity})` 
      : `rgba(20, 25, 35, ${opacity})`;
    ctx.fillRect(x, y, size_s, size_s);
  }

  const bumpCount = Math.floor(200 * mult);
  for (let i = 0; i < bumpCount; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = (2 + Math.random() * 8) * mult;
    const opacity = 0.02 + Math.random() * 0.06;
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, `rgba(60, 70, 90, ${opacity})`);
    gradient.addColorStop(1, 'rgba(60, 70, 90, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  if (mult >= 1) {
    const swirlCount = Math.floor(15 * mult);
    for (let i = 0; i < swirlCount; i++) {
      const cx = Math.random() * canvas.width;
      const cy = Math.random() * canvas.height;
      const swirlRadius = (20 + Math.random() * 60) * mult;
      ctx.strokeStyle = `rgba(70, 80, 100, ${0.01 + Math.random() * 0.02})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let a = 0; a < Math.PI * 2; a += 0.1) {
        const r = swirlRadius * (0.5 + Math.random() * 0.5);
        const px = cx + Math.cos(a) * r;
        const py = cy + Math.sin(a) * r;
        if (a === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  return texture;
}

function applyWearOverlay(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  wear: WearLevel,
  materialType: CaseMaterial
): void {
  const intensity = getWearIntensity(wear);
  if (intensity.scratches === 0 && intensity.discolor === 0 && intensity.patina === 0) return;

  const scratchCount = Math.floor(500 * intensity.scratches);
  for (let i = 0; i < scratchCount; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const length = 20 + Math.random() * 150 * intensity.scratches;
    const angle = (Math.random() - 0.5) * 0.5;
    const opacity = 0.05 + Math.random() * 0.15 * intensity.scratches;
    const endX = x + Math.cos(angle) * length;
    const endY = y + Math.sin(angle) * length;
    
    const grad = ctx.createLinearGradient(x, y, endX, endY);
    grad.addColorStop(0, `rgba(255, 255, 255, 0)`);
    grad.addColorStop(0.3, `rgba(255, 255, 255, ${opacity})`);
    grad.addColorStop(0.7, `rgba(255, 255, 255, ${opacity * 0.8})`);
    grad.addColorStop(1, `rgba(255, 255, 255, 0)`);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 0.3 + Math.random() * 1.2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(endX, endY);
    ctx.stroke();
  }

  const edgeWearZones = [
    { x: 0, y: 0, w: width, h: height * 0.08 },
    { x: 0, y: height * 0.92, w: width, h: height * 0.08 },
    { x: 0, y: 0, w: width * 0.05, h: height },
    { x: width * 0.95, y: 0, w: width * 0.05, h: height },
  ];

  edgeWearZones.forEach((zone) => {
    const gradient = ctx.createLinearGradient(
      zone.x, zone.y,
      zone.x + zone.w, zone.y + zone.h
    );
    gradient.addColorStop(0, `rgba(180, 170, 150, ${intensity.discolor * 0.4})`);
    gradient.addColorStop(1, 'rgba(180, 170, 150, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(zone.x, zone.y, zone.w, zone.h);
  });

  const discolorSpotCount = Math.floor(80 * intensity.discolor);
  for (let i = 0; i < discolorSpotCount; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const radius = 10 + Math.random() * 50;
    const opacity = intensity.discolor * (0.05 + Math.random() * 0.1);
    let discolorColor = 'rgba(180, 160, 120,';
    
    if (materialType === 'wood') {
      discolorColor = 'rgba(90, 50, 20,';
    } else if (materialType === 'aluminum') {
      discolorColor = 'rgba(150, 140, 130,';
    } else if (materialType === 'carbon') {
      discolorColor = 'rgba(60, 55, 45,';
    }

    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, `${discolorColor} ${opacity})`);
    gradient.addColorStop(1, `${discolorColor} 0)`);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  if (intensity.patina > 0 && materialType !== 'plastic') {
    const patinaCount = Math.floor(200 * intensity.patina);
    for (let i = 0; i < patinaCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const radius = 1 + Math.random() * 4;
      const opacity = intensity.patina * (0.1 + Math.random() * 0.2);
      let patinaColor = 'rgba(100, 120, 80,';
      if (materialType === 'aluminum') {
        patinaColor = 'rgba(140, 140, 140,';
      } else if (materialType === 'wood') {
        patinaColor = 'rgba(120, 80, 40,';
      }
      ctx.fillStyle = `${patinaColor} ${opacity})`;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawEngraving(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  type: EngravingType,
  engravingColor: string
): void {
  if (type === 'none') return;

  ctx.save();
  ctx.globalCompositeOperation = 'source-over';

  const cx = width / 2;
  const cy = height / 2;
  const scale = Math.min(width, height) / 1024;

  const drawEngravedLine = (x1: number, y1: number, x2: number, y2: number, lineWidth: number = 2) => {
    ctx.strokeStyle = engravingColor;
    ctx.lineWidth = lineWidth * scale;
    ctx.lineCap = 'round';
    ctx.shadowColor = engravingColor;
    ctx.shadowBlur = 8 * scale;
    ctx.beginPath();
    ctx.moveTo(x1 * scale + cx - 512 * scale, y1 * scale + cy - 512 * scale);
    ctx.lineTo(x2 * scale + cx - 512 * scale, y2 * scale + cy - 512 * scale);
    ctx.stroke();
    ctx.shadowBlur = 0;
  };

  switch (type) {
    case 'logo': {
      const logoSize = 300;
      ctx.strokeStyle = engravingColor;
      ctx.fillStyle = engravingColor;
      ctx.lineWidth = 6 * scale;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = engravingColor;
      ctx.shadowBlur = 15 * scale;
      const sx = cx - (logoSize * scale) / 2;
      const sy = cy - (logoSize * scale) / 2;
      ctx.beginPath();
      ctx.roundRect(sx, sy, logoSize * scale, logoSize * scale, 40 * scale);
      ctx.stroke();
      ctx.lineWidth = 4 * scale;
      ctx.beginPath();
      ctx.moveTo(sx + 60 * scale, sy + logoSize * scale - 60 * scale);
      ctx.lineTo(sx + logoSize * scale / 2, sy + 60 * scale);
      ctx.lineTo(sx + logoSize * scale - 60 * scale, sy + logoSize * scale - 60 * scale);
      ctx.stroke();
      ctx.shadowBlur = 0;
      break;
    }
    case 'geometric': {
      const shapes = [
        { cx: 300, cy: 300, r: 120, sides: 6 },
        { cx: 724, cy: 300, r: 120, sides: 6 },
        { cx: 512, cy: 512, r: 150, sides: 8 },
        { cx: 300, cy: 724, r: 120, sides: 6 },
        { cx: 724, cy: 724, r: 120, sides: 6 },
      ];
      shapes.forEach((s) => {
        ctx.strokeStyle = engravingColor;
        ctx.lineWidth = 4 * scale;
        ctx.shadowColor = engravingColor;
        ctx.shadowBlur = 10 * scale;
        ctx.beginPath();
        for (let i = 0; i <= s.sides; i++) {
          const angle = (Math.PI * 2 * i) / s.sides - Math.PI / 2;
          const px = s.cx + Math.cos(angle) * s.r;
          const py = s.cy + Math.sin(angle) * s.r;
          const drawX = (px - 512) * scale + cx;
          const drawY = (py - 512) * scale + cy;
          if (i === 0) ctx.moveTo(drawX, drawY);
          else ctx.lineTo(drawX, drawY);
        }
        ctx.closePath();
        ctx.stroke();
      });
      ctx.shadowBlur = 0;
      break;
    }
    case 'floral': {
      ctx.strokeStyle = engravingColor;
      ctx.lineWidth = 3 * scale;
      ctx.shadowColor = engravingColor;
      ctx.shadowBlur = 10 * scale;
      for (let flower = 0; flower < 5; flower++) {
        const angle = (Math.PI * 2 * flower) / 5 - Math.PI / 2;
        const dist = 200;
        const fx = 512 + Math.cos(angle) * dist;
        const fy = 512 + Math.sin(angle) * dist;
        const petalCount = 6;
        for (let p = 0; p < petalCount; p++) {
          const pAngle = (Math.PI * 2 * p) / petalCount;
          const petalLen = 70;
          ctx.beginPath();
          const startX = (fx - 512) * scale + cx;
          const startY = (fy - 512) * scale + cy;
          ctx.moveTo(startX, startY);
          const cp1x = (fx + Math.cos(pAngle) * petalLen * 0.5 - 512) * scale + cx;
          const cp1y = (fy + Math.sin(pAngle) * petalLen * 0.5 - 40 - 512) * scale + cy;
          const endX = (fx + Math.cos(pAngle) * petalLen - 512) * scale + cx;
          const endY = (fy + Math.sin(pAngle) * petalLen - 512) * scale + cy;
          ctx.quadraticCurveTo(cp1x, cp1y, endX, endY);
          ctx.stroke();
        }
      }
      for (let i = 0; i < 12; i++) {
        const angle = (Math.PI * 2 * i) / 12;
        drawEngravedLine(512, 512, 512 + Math.cos(angle) * 180, 512 + Math.sin(angle) * 180, 2);
      }
      ctx.shadowBlur = 0;
      break;
    }
    case 'circuit': {
      ctx.strokeStyle = engravingColor;
      ctx.lineWidth = 3 * scale;
      ctx.shadowColor = engravingColor;
      ctx.shadowBlur = 12 * scale;
      const gridSize = 128;
      for (let x = gridSize; x < 1024; x += gridSize) {
        drawEngravedLine(x, 64, x, 960, 3);
      }
      for (let y = gridSize; y < 1024; y += gridSize) {
        drawEngravedLine(64, y, 960, y, 3);
      }
      const pads = [
        [256, 256], [768, 256], [512, 512], [256, 768], [768, 768],
      ];
      pads.forEach(([px, py]) => {
        ctx.fillStyle = engravingColor;
        ctx.beginPath();
        const drawX = (px - 512) * scale + cx;
        const drawY = (py - 512) * scale + cy;
        ctx.arc(drawX, drawY, 15 * scale, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.shadowBlur = 0;
      break;
    }
    case 'dragon': {
      ctx.strokeStyle = engravingColor;
      ctx.lineWidth = 4 * scale;
      ctx.lineCap = 'round';
      ctx.shadowColor = engravingColor;
      ctx.shadowBlur = 15 * scale;
      ctx.beginPath();
      const drawX = (x: number) => (x - 512) * scale + cx;
      const drawY = (y: number) => (y - 512) * scale + cy;
      ctx.moveTo(drawX(150), drawY(700));
      ctx.bezierCurveTo(
        drawX(250), drawY(550),
        drawX(350), drawY(650),
        drawX(450), drawY(500)
      );
      ctx.bezierCurveTo(
        drawX(550), drawY(380),
        drawX(500), drawY(300),
        drawX(600), drawY(250)
      );
      ctx.bezierCurveTo(
        drawX(700), drawY(200),
        drawX(800), drawY(280),
        drawX(850), drawY(350)
      );
      ctx.stroke();
      for (let i = 0; i < 8; i++) {
        const t = i / 7;
        const bodyX = 150 + t * 700;
        const bodyY = 700 - t * 400 + Math.sin(t * Math.PI * 2) * 80;
        const spineH = 30 + Math.random() * 20;
        drawEngravedLine(bodyX, bodyY, bodyX + 20, bodyY - spineH, 3);
        drawEngravedLine(bodyX + 20, bodyY - spineH, bodyX + 40, bodyY, 3);
      }
      ctx.fillStyle = engravingColor;
      ctx.beginPath();
      ctx.arc(drawX(820), drawY(320), 8 * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      break;
    }
    case 'custom': {
      ctx.strokeStyle = engravingColor;
      ctx.lineWidth = 5 * scale;
      ctx.font = `${120 * scale}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = engravingColor;
      ctx.shadowBlur = 20 * scale;
      ctx.strokeText('CUSTOM', cx, cy);
      ctx.shadowBlur = 0;
      break;
    }
  }
  ctx.restore();
}

interface MaterialTextureParams {
  material: CaseMaterial;
  detail?: TextureDetailLevel;
  wear?: WearLevel;
  engraving?: EngravingType;
  engravingColor?: string;
}

const textureCache: Map<string, THREE.CanvasTexture> = new Map();

export function getMaterialTexture(params: MaterialTextureParams): THREE.CanvasTexture {
  const {
    material,
    detail = 'high',
    wear = 'none',
    engraving = 'none',
    engravingColor = '#00ffaa',
  } = params;

  const cacheKey = `${material}_${detail}_${wear}_${engraving}_${engravingColor}`;
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey)!;
  }

  let baseTexture: THREE.CanvasTexture;
  switch (material) {
    case 'aluminum':
      baseTexture = generateBrushedMetalTexture(detail);
      break;
    case 'wood':
      baseTexture = generateWoodTexture(detail);
      break;
    case 'carbon':
      baseTexture = generateCarbonFiberTexture(detail);
      break;
    case 'plastic':
    default:
      baseTexture = generatePlasticTexture(detail);
      break;
  }

  if (wear !== 'none' || engraving !== 'none') {
    const sourceCanvas = baseTexture.image as HTMLCanvasElement;
    const size = sourceCanvas.width;
    const composedCanvas = document.createElement('canvas');
    composedCanvas.width = size;
    composedCanvas.height = size;
    const ctx = composedCanvas.getContext('2d')!;

    ctx.drawImage(sourceCanvas, 0, 0);

    if (wear !== 'none') {
      applyWearOverlay(ctx, size, size, wear, material);
    }

    if (engraving !== 'none') {
      drawEngraving(ctx, size, size, engraving, engravingColor);
    }

    const composedTexture = new THREE.CanvasTexture(composedCanvas);
    composedTexture.wrapS = baseTexture.wrapS;
    composedTexture.wrapT = baseTexture.wrapT;
    composedTexture.repeat.copy(baseTexture.repeat);
    textureCache.set(cacheKey, composedTexture);
    return composedTexture;
  }

  textureCache.set(cacheKey, baseTexture);
  return baseTexture;
}

import * as THREE from 'three';
import { CaseMaterial } from '@/types/keyboard';

export function generateWoodTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  const baseColor = '#7c4a1e';
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 80; i++) {
    const y = (i / 80) * canvas.height + (Math.random() - 0.5) * 20;
    const opacity = 0.05 + Math.random() * 0.12;
    const hue = 25 + Math.random() * 15;
    const light = 20 + Math.random() * 15;
    ctx.strokeStyle = `hsla(${hue}, 60%, ${light}%, ${opacity})`;
    ctx.lineWidth = 2 + Math.random() * 8;
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= canvas.width; x += 50) {
      ctx.lineTo(x, y + Math.sin(x * 0.008 + i * 0.5) * (8 + Math.random() * 12));
    }
    ctx.stroke();
  }

  for (let i = 0; i < 30; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = 3 + Math.random() * 15;
    const opacity = 0.03 + Math.random() * 0.08;
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, `rgba(60, 30, 10, ${opacity})`);
    gradient.addColorStop(1, 'rgba(60, 30, 10, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

export function generateBrushedMetalTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#8a8f98';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 2000; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const length = 50 + Math.random() * 200;
    const opacity = 0.02 + Math.random() * 0.08;
    const hue = 210 + Math.random() * 20;
    const light = 40 + Math.random() * 30;
    ctx.strokeStyle = `hsla(${hue}, 5%, ${light}%, ${opacity})`;
    ctx.lineWidth = 0.5 + Math.random() * 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + length, y + (Math.random() - 0.5) * 3);
    ctx.stroke();
  }

  for (let i = 0; i < 500; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = 1 + Math.random() * 3;
    const opacity = 0.01 + Math.random() * 0.04;
    ctx.fillStyle = `rgba(200, 210, 220, ${opacity})`;
    ctx.fillRect(x, y, size, size);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

export function generateCarbonFiberTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#1a1f2e';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const tileSize = 8;
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

  for (let i = 0; i < 150; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = 0.5 + Math.random() * 1.5;
    const opacity = 0.05 + Math.random() * 0.1;
    ctx.fillStyle = `rgba(120, 150, 200, ${opacity})`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

export function generatePlasticTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#2d3748';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 10000; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = 0.3 + Math.random() * 1.2;
    const opacity = 0.01 + Math.random() * 0.05;
    const isLight = Math.random() > 0.5;
    ctx.fillStyle = isLight 
      ? `rgba(80, 90, 110, ${opacity})` 
      : `rgba(20, 25, 35, ${opacity})`;
    ctx.fillRect(x, y, size, size);
  }

  for (let i = 0; i < 200; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = 2 + Math.random() * 8;
    const opacity = 0.02 + Math.random() * 0.06;
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, `rgba(60, 70, 90, ${opacity})`);
    gradient.addColorStop(1, 'rgba(60, 70, 90, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  return texture;
}

const textureCache: Map<CaseMaterial, THREE.CanvasTexture> = new Map();

export function getMaterialTexture(material: CaseMaterial): THREE.CanvasTexture {
  if (textureCache.has(material)) {
    return textureCache.get(material)!;
  }

  let texture: THREE.CanvasTexture;
  switch (material) {
    case 'aluminum':
      texture = generateBrushedMetalTexture();
      break;
    case 'wood':
      texture = generateWoodTexture();
      break;
    case 'carbon':
      texture = generateCarbonFiberTexture();
      break;
    case 'plastic':
    default:
      texture = generatePlasticTexture();
      break;
  }

  textureCache.set(material, texture);
  return texture;
}

import { KeyboardConfigInfo } from './exportConfig';

export interface ConfigPanelStyle {
  height: number;
  padding: number;
  colorSwatchSize: number;
  titleFontSize: number;
  labelFontSize: number;
  valueFontSize: number;
  footerFontSize: number;
  sectionGap: number;
  lineHeight: number;
}

export const DEFAULT_PANEL_STYLE: ConfigPanelStyle = {
  height: 360,
  padding: 48,
  colorSwatchSize: 24,
  titleFontSize: 22,
  labelFontSize: 18,
  valueFontSize: 18,
  footerFontSize: 14,
  sectionGap: 36,
  lineHeight: 30,
};

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

function drawSection(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  title: string,
  lines: { label: string; value: string; color?: string }[],
  style: ConfigPanelStyle
): number {
  ctx.font = `bold ${style.titleFontSize}px Inter, system-ui, -apple-system, sans-serif`;
  ctx.fillStyle = '#818cf8';
  ctx.fillText(title, x, y);

  let currentY = y + style.sectionGap;
  ctx.font = `${style.labelFontSize}px Inter, system-ui, -apple-system, sans-serif`;

  const labelWidth = 110;

  for (const line of lines) {
    ctx.fillStyle = '#9ca3af';
    ctx.fillText(line.label, x, currentY);
    ctx.fillStyle = line.color || '#e5e7eb';
    ctx.fillText(line.value, x + labelWidth, currentY);
    currentY += style.lineHeight;
  }

  return currentY;
}

function drawColorSwatches(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  colors: { name: string; color: string }[],
  style: ConfigPanelStyle
): number {
  ctx.font = `bold ${style.titleFontSize}px Inter, system-ui, -apple-system, sans-serif`;
  ctx.fillStyle = '#818cf8';
  ctx.fillText('🌈 区域配色', x, y);

  let currentY = y + style.sectionGap;
  const labelWidth = 130;
  const valueWidth = 90;
  const swatchX = x + labelWidth + valueWidth + 16;

  ctx.font = `${style.labelFontSize}px Inter, system-ui, -apple-system, sans-serif`;

  for (const zone of colors) {
    ctx.fillStyle = '#9ca3af';
    ctx.fillText(zone.name, x, currentY);
    ctx.fillStyle = zone.color;
    ctx.fillText(zone.color, x + labelWidth, currentY);

    const swatchY = currentY - style.colorSwatchSize + 6;
    ctx.fillStyle = zone.color;
    drawRoundedRect(ctx, swatchX, swatchY, style.colorSwatchSize, style.colorSwatchSize, 5);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1.5;
    drawRoundedRect(ctx, swatchX, swatchY, style.colorSwatchSize, style.colorSwatchSize, 5);
    ctx.stroke();

    currentY += style.lineHeight;
  }

  return currentY;
}

export function drawConfigPanel(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  panelY: number,
  panelHeight: number,
  config: KeyboardConfigInfo,
  scale: number = 1
) {
  const style: ConfigPanelStyle = {
    height: DEFAULT_PANEL_STYLE.height * scale,
    padding: DEFAULT_PANEL_STYLE.padding * scale,
    colorSwatchSize: DEFAULT_PANEL_STYLE.colorSwatchSize * scale,
    titleFontSize: DEFAULT_PANEL_STYLE.titleFontSize * scale,
    labelFontSize: DEFAULT_PANEL_STYLE.labelFontSize * scale,
    valueFontSize: DEFAULT_PANEL_STYLE.valueFontSize * scale,
    footerFontSize: DEFAULT_PANEL_STYLE.footerFontSize * scale,
    sectionGap: DEFAULT_PANEL_STYLE.sectionGap * scale,
    lineHeight: DEFAULT_PANEL_STYLE.lineHeight * scale,
  };

  drawRoundedRect(ctx, 0, panelY, canvasWidth, panelHeight, 0);
  ctx.fillStyle = '#0d0d14';
  ctx.fill();

  ctx.fillStyle = '#1e1e3a';
  ctx.fillRect(0, panelY, canvasWidth, 2 * scale);

  const contentY = panelY + style.padding;
  const colWidth = (canvasWidth - style.padding * 4) / 3;

  const x0 = style.padding;
  const x1 = style.padding * 2 + colWidth;
  const x2 = style.padding * 3 + colWidth * 2;

  drawSection(ctx, x0, contentY, '⌨ 布局与材质', [
    { label: '布局', value: `${config.layout.name} (${config.layout.keyCount}键)` },
    { label: '外壳材质', value: config.caseMaterial.name, color: config.caseMaterial.color },
    { label: '轴体', value: config.switchType.name, color: config.switchType.color },
    { label: '轴体类型', value: config.switchType.description },
  ], style);

  drawSection(ctx, x1, contentY, '🎨 字体与灯光', [
    { label: '字体', value: config.font.name },
    { label: 'RGB', value: config.lighting.rgbEnabled ? '开启' : '关闭' },
    { label: '灯光模式', value: config.lighting.modeName },
    { label: '亮度', value: `${Math.round(config.lighting.brightness * 100)}%` },
    { label: '速度', value: `${config.lighting.speed.toFixed(1)}x` },
  ], style);

  const zoneY = drawColorSwatches(ctx, x2, contentY, config.zoneColors, style);

  const bottomY = Math.max(zoneY, contentY + style.lineHeight * 5 + style.sectionGap) + style.padding * 0.6;

  ctx.fillStyle = '#6b7280';
  ctx.font = `${style.footerFontSize}px Inter, system-ui, -apple-system, sans-serif`;
  ctx.fillText(
    `导出时间: ${new Date().toLocaleString('zh-CN')}  |  Keyboard Studio - 3D 键盘定制器`,
    style.padding,
    bottomY
  );
}

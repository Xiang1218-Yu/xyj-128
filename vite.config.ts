import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";
import { traeBadgePlugin } from 'vite-plugin-trae-solo-badge';
import { visualizer } from 'rollup-plugin-visualizer';

const isAnalyze = process.env.ANALYZE === 'true';
const isDev = process.env.NODE_ENV !== 'production';

export default defineConfig({
  build: {
    sourcemap: 'hidden',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'state-vendor': ['zustand'],
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei', '@react-three/postprocessing'],
          'ui-vendor': ['lucide-react', 'clsx', 'tailwind-merge'],
          'data': ['./src/data/colorSchemes', './src/data/fonts', './src/data/keycapProfiles', './src/data/layouts', './src/data/lighting', './src/data/materials', './src/data/stickers', './src/data/switches', './src/data/themes', './src/data/typingPractice', './src/data/zones'],
          'store': ['./src/store/useKeyboardStore', './src/store/useTypingGameStore'],
        }
      }
    },
    chunkSizeWarningLimit: 1000,
  },
  plugins: [
    react({
      babel: {
        plugins: [
          'react-dev-locator',
        ],
      },
    }),
    traeBadgePlugin({
      variant: 'dark',
      position: 'bottom-right',
      prodOnly: true,
      clickable: true,
      clickUrl: 'https://www.trae.ai/solo?showJoin=1',
      autoTheme: true,
      autoThemeTarget: '#root'
    }),
    tsconfigPaths(),
    isAnalyze && visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
      template: 'treemap',
    }),
    isDev && {
      name: 'vite-plugin-performance',
      configureServer(server) {
        server.ws.on('performance:metrics', (data) => {
          console.log('[Performance]', data);
        });
      },
      transformIndexHtml(html) {
        return html.replace(
          '<head>',
          `<head>
            <script>
              (function() {
                const showPerfPanel = true;
                if (showPerfPanel) {
                  window.addEventListener('load', function() {
                    const perfData = {
                      fps: 0,
                      memory: 0,
                      domCount: 0,
                      loadTime: performance.now()
                    };
                    
                    let frameCount = 0;
                    let lastTime = performance.now();
                    
                    function updateFPS() {
                      frameCount++;
                      const now = performance.now();
                      if (now - lastTime >= 1000) {
                        perfData.fps = Math.round(frameCount * 1000 / (now - lastTime));
                        frameCount = 0;
                        lastTime = now;
                        updatePanel();
                      }
                      requestAnimationFrame(updateFPS);
                    }
                    
                    function updatePanel() {
                      let panel = document.getElementById('vite-perf-panel');
                      if (!panel) {
                        panel = document.createElement('div');
                        panel.id = 'vite-perf-panel';
                        panel.style.cssText = 'position:fixed;top:10px;left:10px;z-index:99999;background:rgba(0,0,0,0.85);color:#0f0;padding:10px 14px;border-radius:8px;font-family:monospace;font-size:12px;line-height:1.6;min-width:180px;backdrop-filter:blur(4px);box-shadow:0 4px 12px rgba(0,0,0,0.3);';
                        panel.title = 'Vite 开发环境性能面板 - 点击刷新';
                        panel.onclick = () => {
                          perfData.domCount = document.querySelectorAll('*').length;
                          perfData.memory = performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) : 0;
                          updatePanel();
                        };
                        document.body.appendChild(panel);
                      }
                      perfData.domCount = document.querySelectorAll('*').length;
                      if (performance.memory) {
                        perfData.memory = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
                      }
                      const nav = performance.getEntriesByType('navigation')[0];
                      const domContentLoaded = nav ? Math.round(nav.domContentLoadedEventEnd) : 0;
                      panel.innerHTML = \`
                        <div style="font-weight:bold;margin-bottom:6px;color:#ff0;">⚡ Vite 性能面板</div>
                        <div>FPS: <span style="color:\${perfData.fps >= 55 ? '#0f0' : perfData.fps >= 30 ? '#ff0' : '#f00'}">\${perfData.fps}</span></div>
                        <div>DOM: \${perfData.domCount}</div>
                        \${perfData.memory ? '<div>内存: ' + perfData.memory + ' MB</div>' : ''}
                        <div>加载: \${Math.round(perfData.loadTime)}ms</div>
                        \${domContentLoaded ? '<div>DCL: ' + domContentLoaded + 'ms</div>' : ''}
                        <div style="margin-top:6px;padding-top:6px;border-top:1px solid #333;font-size:10px;color:#888;">点击刷新数据</div>
                      \`;
                    }
                    
                    requestAnimationFrame(updateFPS);
                    updatePanel();
                  });
                }
              })();
            </script>`
        );
      }
    }
  ].filter(Boolean),
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      include: ['src/store/**', 'src/data/**', 'src/utils/layoutUtils.ts', 'src/utils/switchCurve.ts', 'src/utils/exportConfig.ts'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
})

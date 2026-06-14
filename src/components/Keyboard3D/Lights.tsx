import { useMemo } from 'react';
import { useUITheme } from '@/store/useKeyboardStore';
import { getUITheme } from '@/data/themes';

export function Lights() {
  const themeId = useUITheme();
  const theme = useMemo(() => getUITheme(themeId), [themeId]);

  const { sceneAmbience, lighting } = theme;

  return (
    <>
      <ambientLight 
        intensity={sceneAmbience.ambientLightIntensity} 
        color={sceneAmbience.ambientLightColor || '#ffffff'}
      />
      
      {lighting.directionalLights.map((light, index) => (
        <directionalLight
          key={`dir-${index}`}
          position={light.position}
          intensity={light.intensity}
          color={light.color}
          castShadow={light.castShadow}
          shadow-mapSize={light.castShadow ? [2048, 2048] : undefined}
          shadow-camera-far={light.castShadow ? 50 : undefined}
          shadow-camera-left={light.castShadow ? -20 : undefined}
          shadow-camera-right={light.castShadow ? 20 : undefined}
          shadow-camera-top={light.castShadow ? 20 : undefined}
          shadow-camera-bottom={light.castShadow ? -20 : undefined}
        />
      ))}
      
      {lighting.pointLights.map((light, index) => (
        <pointLight
          key={`point-${index}`}
          position={light.position}
          intensity={light.intensity}
          color={light.color}
        />
      ))}
    </>
  );
}

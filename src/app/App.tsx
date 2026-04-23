import { useState, useRef, useEffect, useCallback } from 'react';
import { ThumbnailEditor } from './components/ThumbnailEditor';
import { ControlPanel } from './components/ControlPanel';
import { defaultConfig, ThumbnailConfig } from './types';
import { Maximize2, Minimize2 } from 'lucide-react';

export default function App() {
  const [config, setConfig] = useState<ThumbnailConfig>(defaultConfig);
  const thumbnailRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(0.5);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const updateScale = useCallback(() => {
    if (containerRef.current) {
      const w = containerRef.current.getBoundingClientRect().width;
      setPreviewScale(w / 1280);
    }
  }, []);

  useEffect(() => {
    updateScale();
    const observer = new ResizeObserver(updateScale);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [updateScale]);

  const update = useCallback((updater: (prev: ThumbnailConfig) => ThumbnailConfig) => {
    setConfig(updater);
  }, []);

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => update(c => ({ ...c, backgroundImage: ev.target?.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => update(c => ({ ...c, logoImage: ev.target?.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleTitleFontUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const arrayBuffer = await file.arrayBuffer();
      const fontName = `CustomTitleFont_${Date.now()}`;
      const font = new FontFace(fontName, arrayBuffer);
      await font.load();
      document.fonts.add(font);
      update(c => ({ ...c, fontFamily: `'${fontName}', sans-serif` }));
    } catch (err) {
      console.error('Error cargando tipografía del título:', err);
      alert('No se pudo cargar la tipografía. Asegúrate de que es un archivo TTF, OTF o WOFF válido.');
    }
  };

  const handleEpisodeFontUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const arrayBuffer = await file.arrayBuffer();
      const fontName = `CustomEpisodeFont_${Date.now()}`;
      const font = new FontFace(fontName, arrayBuffer);
      await font.load();
      document.fonts.add(font);
      update(c => ({ ...c, episodeFontFamily: `'${fontName}', sans-serif` }));
    } catch (err) {
      console.error('Error cargando tipografía del episodio:', err);
      alert('No se pudo cargar la tipografía. Asegúrate de que es un archivo TTF, OTF o WOFF válido.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 w-10 h-10 rounded-lg flex items-center justify-center">
            <span className="text-black text-lg" style={{ fontWeight: 900 }}>FDC</span>
          </div>
          <div>
            <h1 className="text-white" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px', letterSpacing: '0.05em' }}>
              Fuera De Contexto — Editor de Miniaturas
            </h1>
            <p className="text-gray-400 text-xs">YouTube Thumbnail Editor · 1280×720px</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-200 px-3 py-1.5 rounded-lg text-sm transition-colors border border-gray-700"
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            {isFullscreen ? 'Salir' : 'Pantalla completa'}
          </button>
          <span className="text-gray-500 text-xs bg-gray-800 px-3 py-1 rounded-full">16:9 · PNG</span>
        </div>
      </header>

      <div className={`flex h-[calc(100vh-65px)] ${isFullscreen ? 'flex-col' : ''}`}>
        {/* Left: Preview */}
        <div className={`flex-1 flex flex-col items-center justify-start p-6 overflow-auto ${isFullscreen ? 'p-0' : ''}`}>
          <div className={isFullscreen ? 'w-full h-full flex items-center justify-center' : 'w-full max-w-5xl'}>
            <div className={`bg-gray-900 p-4 border border-gray-800 ${isFullscreen ? 'w-full h-full flex items-center justify-center' : ''}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-400 text-xs uppercase tracking-wider">Vista Previa</span>
                <span className="text-gray-500 text-xs">1280 × 720 px · escala {Math.round(previewScale * 100)}%</span>
              </div>
              {/* Scaled preview container */}
              <div
                ref={containerRef}
                className="relative w-full overflow-hidden bg-black"
                style={{ aspectRatio: '16/9', ...(isFullscreen ? { maxWidth: '100%', maxHeight: 'calc(100vh - 140px)' } : {}) }}
              >
                <div
                  style={{
                    transform: `scale(${previewScale})`,
                    transformOrigin: 'top left',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '1280px',
                    height: '720px',
                  }}
                >
                  <ThumbnailEditor ref={thumbnailRef} config={config} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Control Panel */}
        {!isFullscreen && (
          <div className="w-96 bg-gray-900 border-l border-gray-800 overflow-y-auto flex-shrink-0">
            <ControlPanel
              config={config}
              update={update}
              thumbnailRef={thumbnailRef}
              onBgUpload={handleBgUpload}
              onLogoUpload={handleLogoUpload}
              onTitleFontUpload={handleTitleFontUpload}
              onEpisodeFontUpload={handleEpisodeFontUpload}
            />
          </div>
        )}
      </div>
    </div>
  );
}
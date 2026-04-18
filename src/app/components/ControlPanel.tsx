import { useState } from 'react';
import {
  Upload, Download, ChevronDown, ChevronUp,
  Type, Square, Move, Image, Settings, Sparkles,
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { ThumbnailConfig } from '../types';
import { EPISODE_SHAPES, ShapePreview } from './EpisodeBadge';

// ── Types ──────────────────────────────────────────────────────────────────
interface Props {
  config: ThumbnailConfig;
  update: (updater: (prev: ThumbnailConfig) => ThumbnailConfig) => void;
  thumbnailRef: React.RefObject<HTMLDivElement>;
  onBgUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTitleFontUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEpisodeFontUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// ── Constants ──────────────────────────────────────────────────────────────
const FONTS = [
  { label: 'Bebas Neue', value: "'Bebas Neue', sans-serif" },
  { label: 'Anton', value: "'Anton', sans-serif" },
  { label: 'Impact', value: "Impact, 'Arial Narrow', sans-serif" },
  { label: 'Oswald', value: "'Oswald', sans-serif" },
  { label: 'Montserrat Black', value: "'Montserrat', sans-serif" },
  { label: 'Black Han Sans', value: "'Black Han Sans', sans-serif" },
  { label: 'Righteous', value: "'Righteous', sans-serif" },
  { label: 'Boogaloo', value: "'Boogaloo', sans-serif" },
  { label: 'Arial Black', value: "'Arial Black', 'Arial', sans-serif" },
];

const TEXTURES = [
  { label: 'Sólido', value: 'solid' },
  { label: 'Diagonal ↗', value: 'stripes' },
  { label: 'Horizontal ─', value: 'stripes_h' },
  { label: 'Puntos ·', value: 'dots' },
  { label: 'Cuadrícula #', value: 'grid' },
  { label: 'Tramado ×', value: 'crosshatch' },
  { label: 'Ruido ≋', value: 'noise_white' },
];

const PRESET_TEXTS = [
  '¿QUÉ HICIMOS?',
  'NO LO PUEDO CREER',
  'ESTO ES INCREÍBLE',
  'MOMENTO ÉPICO',
  'SIN PALABRAS',
  'ESTO SALIÓ MAL',
  'NO ES LO QUE PARECE',
];

const PRESET_COLORS = [
  { label: 'Rojo', value: '#DC2626' },
  { label: 'Naranja', value: '#EA580C' },
  { label: 'Amarillo', value: '#D97706' },
  { label: 'Verde', value: '#16A34A' },
  { label: 'Azul', value: '#2563EB' },
  { label: 'Morado', value: '#7C3AED' },
  { label: 'Negro', value: '#0A0A0A' },
  { label: 'Blanco', value: '#FFFFFF' },
];

// ── Sub-components ─────────────────────────────────────────────────────────
function Section({
  title, icon, open, onToggle, children,
}: {
  title: string;
  icon: React.ReactNode;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-gray-800">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-800 transition-colors"
      >
        <div className="flex items-center gap-2 text-gray-200">
          <span className="text-yellow-400">{icon}</span>
          <span className="text-sm" style={{ fontWeight: 600 }}>{title}</span>
        </div>
        {open ? <ChevronUp size={15} className="text-gray-500" /> : <ChevronDown size={15} className="text-gray-500" />}
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-4">
          {children}
        </div>
      )}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-gray-400 text-xs mb-1" style={{ fontWeight: 500 }}>{children}</p>;
}

function Slider({
  label, value, min, max, step = 1, unit = 'px', onChange,
}: {
  label: string; value: number; min: number; max: number; step?: number; unit?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <Label>{label}</Label>
        <span className="text-yellow-400 text-xs tabular-nums">
          {step < 1 ? value.toFixed(2) : Math.round(value)}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 rounded-full cursor-pointer accent-yellow-400"
        style={{
          background: `linear-gradient(to right, #FACC15 0%, #FACC15 ${((value - min) / (max - min)) * 100}%, #374151 ${((value - min) / (max - min)) * 100}%, #374151 100%)`,
        }}
      />
    </div>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <Label>{label}</Label>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-10 h-5 rounded-full transition-colors ${value ? 'bg-yellow-400' : 'bg-gray-700'}`}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-5' : 'translate-x-0.5'}`}
        />
      </button>
    </div>
  );
}

function ColorPicker({
  value, onChange,
}: { value: string; onChange: (v: string) => void }) {
  return (
    <>
      <div className="grid grid-cols-4 gap-1 mb-2">
        {PRESET_COLORS.map(c => (
          <button
            key={c.value}
            onClick={() => onChange(c.value)}
            title={c.label}
            className={`h-7 rounded border-2 transition-all ${value === c.value ? 'border-white scale-110' : 'border-transparent'}`}
            style={{ backgroundColor: c.value }}
          />
        ))}
      </div>
      <div className="flex gap-2 items-center">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-9 h-9 rounded cursor-pointer border border-gray-700 bg-transparent"
        />
        <span className="text-gray-400 text-xs font-mono">{value}</span>
      </div>
    </>
  );
}

function FontUploadBtn({ onChange, isCustom, label }: {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isCustom: boolean;
  label: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <label className="w-full bg-indigo-700 hover:bg-indigo-600 text-white px-3 py-2.5 rounded-lg cursor-pointer flex items-center justify-center gap-2 transition-colors text-sm border border-indigo-600">
        <Upload size={14} />
        Subir fuente (.ttf / .otf / .woff)
        <input type="file" accept=".ttf,.otf,.woff,.woff2" onChange={onChange} className="hidden" />
      </label>
      {isCustom && (
        <p className="text-green-400 text-xs mt-1">✓ Tipografía personalizada activa</p>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export function ControlPanel({
  config, update, thumbnailRef,
  onBgUpload, onLogoUpload, onTitleFontUpload, onEpisodeFontUpload,
}: Props) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    texto: true,
    rectangulo: true,
    episodio: true,
    posiciones: false,
    medios: false,
    highlights: false,
    ajustes: false,
  });

  const [isExporting, setIsExporting] = useState(false);

  const toggleSection = (key: string) =>
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));

  // ── Download ��─────────────────────────────────────────────────────────────
  const handleDownload = async () => {
    if (!thumbnailRef.current) return;
    setIsExporting(true);

    const el = thumbnailRef.current;
    const scaleWrapper = el.parentElement as HTMLElement | null;
    const savedTransform = scaleWrapper?.style.transform ?? '';
    const savedPosition = scaleWrapper?.style.position ?? '';
    const savedTop = scaleWrapper?.style.top ?? '';
    const savedLeft = scaleWrapper?.style.left ?? '';

    if (scaleWrapper) {
      scaleWrapper.style.transform = 'none';
      scaleWrapper.style.position = 'fixed';
      scaleWrapper.style.top = '0';
      scaleWrapper.style.left = '0';
    }

    try {
      const canvas = await html2canvas(el, {
        width: 1280,
        height: 720,
        scale: 1,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#000000',
        logging: false,
        x: 0, y: 0, scrollX: 0, scrollY: 0,
        windowWidth: 1280, windowHeight: 720,
      });

      const link = document.createElement('a');
      const ep = config.episodeNumber.toLowerCase().replace(/[^a-z0-9]/g, '-');
      link.download = `fuera-de-contexto-${ep}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (err) {
      console.error('Export error:', err);
      alert('Error al exportar. Intenta de nuevo.');
    } finally {
      if (scaleWrapper) {
        scaleWrapper.style.transform = savedTransform;
        scaleWrapper.style.position = savedPosition;
        scaleWrapper.style.top = savedTop;
        scaleWrapper.style.left = savedLeft;
      }
      setIsExporting(false);
    }
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  const set = <K extends keyof ThumbnailConfig>(key: K, value: ThumbnailConfig[K]) =>
    update(c => ({ ...c, [key]: value }));

  const setPos = (key: 'logoPos' | 'titlePos' | 'episodePos' | 'highlightPos', axis: 'x' | 'y', val: number) =>
    update(c => ({ ...c, [key]: { ...c[key], [axis]: val } }));

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">

        {/* ── TEXTO PRINCIPAL ── */}
        <Section title="Texto Principal" icon={<Type size={14} />} open={openSections.texto} onToggle={() => toggleSection('texto')}>
          <div>
            <Label>Contenido (2–5 palabras)</Label>
            <textarea
              rows={2}
              value={config.mainText}
              onChange={(e) => set('mainText', e.target.value.toUpperCase())}
              className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg text-sm resize-none focus:outline-none focus:ring-1 focus:ring-yellow-400 border border-gray-700"
              placeholder="¿QUÉ HICIMOS?"
            />
            <p className="text-gray-600 text-xs mt-1">{config.mainText.split(' ').filter(Boolean).length} palabras</p>
          </div>

          <div>
            <Label>Frases rápidas</Label>
            <div className="grid grid-cols-1 gap-1">
              {PRESET_TEXTS.map(t => (
                <button
                  key={t}
                  onClick={() => set('mainText', t)}
                  className={`text-left px-3 py-1.5 rounded text-xs transition-colors border ${
                    config.mainText === t
                      ? 'border-yellow-400 bg-yellow-400/10 text-yellow-300'
                      : 'border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                  style={{ fontFamily: config.fontFamily }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label>Tipografía del título</Label>
            <div className="grid grid-cols-1 gap-1">
              {FONTS.map(f => (
                <button
                  key={f.value}
                  onClick={() => set('fontFamily', f.value)}
                  className={`text-left px-3 py-1.5 rounded text-sm transition-colors border ${
                    config.fontFamily === f.value
                      ? 'border-yellow-400 bg-yellow-400/10 text-yellow-200'
                      : 'border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                  style={{ fontFamily: f.value }}
                >
                  {f.label} — Abc123
                </button>
              ))}
            </div>
          </div>

          <Slider label="Tamaño de fuente" value={config.fontSize} min={40} max={200} onChange={v => set('fontSize', v)} />

          <FontUploadBtn
            label="Tipografía personalizada del título"
            onChange={onTitleFontUpload}
            isCustom={config.fontFamily.includes('CustomTitleFont')}
          />

          <div>
            <Label>Color del texto</Label>
            <ColorPicker value={config.textColor} onChange={v => set('textColor', v)} />
          </div>
        </Section>

        {/* ── RECTÁNGULO ── */}
        <Section title="Rectángulo del Título" icon={<Square size={14} />} open={openSections.rectangulo} onToggle={() => toggleSection('rectangulo')}>
          <div>
            <Label>Color del rectángulo</Label>
            <ColorPicker value={config.rectColor} onChange={v => set('rectColor', v)} />
          </div>

          <div>
            <Label>Textura de fondo</Label>
            <div className="grid grid-cols-2 gap-1">
              {TEXTURES.map(t => (
                <button
                  key={t.value}
                  onClick={() => set('rectTexture', t.value)}
                  className={`px-3 py-2 rounded text-xs border transition-colors ${
                    config.rectTexture === t.value
                      ? 'border-yellow-400 bg-yellow-400/10 text-yellow-300'
                      : 'border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <Slider label="Inclinación" value={config.rectTilt} min={-20} max={20} step={0.5} unit="°" onChange={v => set('rectTilt', v)} />
          <Slider label="Opacidad" value={config.rectOpacity} min={0.2} max={1} step={0.01} unit="" onChange={v => set('rectOpacity', v)} />
          <Slider label="Relleno vertical" value={config.rectPaddingV} min={8} max={80} onChange={v => set('rectPaddingV', v)} />
          <Slider label="Relleno horizontal" value={config.rectPaddingH} min={12} max={100} onChange={v => set('rectPaddingH', v)} />
        </Section>

        {/* ── NÚMERO DE EPISODIO ── */}
        <Section title="Badge del Episodio" icon={<Sparkles size={14} />} open={openSections.episodio} onToggle={() => toggleSection('episodio')}>
          <Toggle label="Mostrar badge" value={config.showEpisode} onChange={v => set('showEpisode', v)} />

          {config.showEpisode && (
            <>
              {/* Text */}
              <div>
                <Label>Texto del badge</Label>
                <input
                  type="text"
                  value={config.episodeNumber}
                  onChange={(e) => set('episodeNumber', e.target.value)}
                  className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-yellow-400 border border-gray-700"
                />
              </div>

              {/* Shape grid */}
              <div>
                <Label>Figura del badge</Label>
                <div className="grid grid-cols-3 gap-1.5">
                  {EPISODE_SHAPES.map(s => (
                    <button
                      key={s.value}
                      onClick={() => set('episodeShape', s.value)}
                      title={s.label}
                      className={`flex flex-col items-center gap-1 px-1 py-2 rounded-lg border transition-all ${
                        config.episodeShape === s.value
                          ? 'border-yellow-400 bg-yellow-400/10'
                          : 'border-gray-700 bg-gray-800 hover:bg-gray-700'
                      }`}
                    >
                      <ShapePreview
                        shape={s.value}
                        color={config.episodeShape === s.value ? '#FACC15' : '#6B7280'}
                        size={28}
                      />
                      <span className="text-gray-400 text-xs leading-none text-center">{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Badge background color */}
              <div>
                <Label>Color de fondo del badge</Label>
                <ColorPicker value={config.episodeBgColor} onChange={v => set('episodeBgColor', v)} />
              </div>

              {/* Badge text color */}
              <div>
                <Label>Color del texto del badge</Label>
                <ColorPicker value={config.episodeTextColor} onChange={v => set('episodeTextColor', v)} />
              </div>

              {/* Badge size */}
              <Slider label="Tamaño del badge" value={config.episodeBadgeSize} min={40} max={220} onChange={v => set('episodeBadgeSize', v)} />

              {/* Episode font — presets */}
              <div>
                <Label>Tipografía del badge</Label>
                <div className="grid grid-cols-1 gap-1 max-h-40 overflow-y-auto">
                  {FONTS.map(f => (
                    <button
                      key={f.value}
                      onClick={() => set('episodeFontFamily', f.value)}
                      className={`text-left px-3 py-1.5 rounded text-xs transition-colors border ${
                        config.episodeFontFamily === f.value
                          ? 'border-yellow-400 bg-yellow-400/10 text-yellow-200'
                          : 'border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                      style={{ fontFamily: f.value }}
                    >
                      {f.label} — EP.12
                    </button>
                  ))}
                </div>
              </div>

              {/* Episode custom font upload */}
              <FontUploadBtn
                label="Tipografía personalizada del badge"
                onChange={onEpisodeFontUpload}
                isCustom={config.episodeFontFamily.includes('CustomEpisodeFont')}
              />
            </>
          )}
        </Section>

        {/* ── POSICIONES ── */}
        <Section title="Posición de Elementos" icon={<Move size={14} />} open={openSections.posiciones} onToggle={() => toggleSection('posiciones')}>
          <div className="space-y-2">
            <p className="text-yellow-400 text-xs" style={{ fontWeight: 600 }}>📌 Título (centrado)</p>
            <Slider label="Y — posición vertical" value={config.titlePos.y} min={400} max={720} onChange={v => setPos('titlePos', 'y', v)} />
          </div>

          <div className="space-y-2">
            <p className="text-yellow-400 text-xs" style={{ fontWeight: 600 }}>🏷 Logo / Branding</p>
            <Slider label="X (horizontal)" value={config.logoPos.x} min={0} max={900} onChange={v => setPos('logoPos', 'x', v)} />
            <Slider label="Y (vertical)" value={config.logoPos.y} min={0} max={500} onChange={v => setPos('logoPos', 'y', v)} />
            <Slider label="Tamaño del logo" value={config.logoHeight} min={30} max={200} onChange={v => set('logoHeight', v)} />
          </div>

          <div className="space-y-2">
            <p className="text-yellow-400 text-xs" style={{ fontWeight: 600 }}>🔢 Badge de episodio</p>
            <Slider label="X (horizontal)" value={config.episodePos.x} min={0} max={1280} onChange={v => setPos('episodePos', 'x', v)} />
            <Slider label="Y (vertical)" value={config.episodePos.y} min={0} max={600} onChange={v => setPos('episodePos', 'y', v)} />
          </div>

          {config.showHighlights && (
            <div className="space-y-2">
              <p className="text-yellow-400 text-xs" style={{ fontWeight: 600 }}>⭕ Círculo de resalte</p>
              <Slider label="X (horizontal)" value={config.highlightPos.x} min={0} max={1100} onChange={v => setPos('highlightPos', 'x', v)} />
              <Slider label="Y (vertical)" value={config.highlightPos.y} min={0} max={620} onChange={v => setPos('highlightPos', 'y', v)} />
              <Slider label="Tamaño" value={config.highlightSize} min={60} max={400} onChange={v => set('highlightSize', v)} />
            </div>
          )}
        </Section>

        {/* ── MEDIOS & LOGO ── */}
        <Section title="Medios & Logo" icon={<Image size={14} />} open={openSections.medios} onToggle={() => toggleSection('medios')}>
          <div>
            <Label>Imagen de fondo</Label>
            <label className="w-full bg-purple-700 hover:bg-purple-600 text-white px-3 py-2.5 rounded-lg cursor-pointer flex items-center justify-center gap-2 transition-colors text-sm border border-purple-600">
              <Upload size={15} />
              Subir fondo (foto de hosts)
              <input type="file" accept="image/*" onChange={onBgUpload} className="hidden" />
            </label>
            <p className="text-gray-600 text-xs mt-1">Recomendado: hosts con expresiones reactivas o divertidas</p>
          </div>

          <Slider label="Brillo" value={config.bgBrightness} min={0.5} max={2} step={0.05} unit="" onChange={v => set('bgBrightness', v)} />
          <Slider label="Contraste" value={config.bgContrast} min={0.5} max={2} step={0.05} unit="" onChange={v => set('bgContrast', v)} />
          <Slider label="Saturación" value={config.bgSaturation} min={0} max={3} step={0.1} unit="" onChange={v => set('bgSaturation', v)} />

          <Toggle label="Mostrar logo / branding" value={config.showLogo} onChange={v => set('showLogo', v)} />

          <div>
            <Label>Logo (PNG con fondo transparente)</Label>
            <label className="w-full bg-blue-700 hover:bg-blue-600 text-white px-3 py-2.5 rounded-lg cursor-pointer flex items-center justify-center gap-2 transition-colors text-sm border border-blue-600">
              <Upload size={15} />
              {config.logoImage ? '✓ Logo cargado — reemplazar' : 'Subir logo'}
              <input type="file" accept="image/*" onChange={onLogoUpload} className="hidden" />
            </label>
            {config.logoImage && (
              <button
                onClick={() => set('logoImage', null)}
                className="w-full mt-1 text-xs text-red-400 hover:text-red-300 py-1"
              >
                Eliminar logo (usar texto)
              </button>
            )}
          </div>

          {!config.logoImage && (
            <div>
              <Label>Texto del branding</Label>
              <input
                type="text"
                value={config.brandText}
                onChange={(e) => set('brandText', e.target.value)}
                className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-yellow-400 border border-gray-700"
              />
            </div>
          )}
        </Section>

        {/* ── RESALTES ── */}
        <Section title="Resaltes" icon={<Sparkles size={14} />} open={openSections.highlights} onToggle={() => toggleSection('highlights')}>
          <Toggle label="Círculo de resalte amarillo" value={config.showHighlights} onChange={v => set('showHighlights', v)} />
        </Section>

        {/* ── RESTABLECER ── */}
        <Section title="Restablecer" icon={<Settings size={14} />} open={openSections.ajustes} onToggle={() => toggleSection('ajustes')}>
          <div className="space-y-2">
            <p className="text-gray-500 text-xs">Vuelve al diseño predeterminado.</p>
            <button
              onClick={() => {
                update(() => ({
                  backgroundImage: config.backgroundImage,
                  bgBrightness: 1.1, bgContrast: 1.2, bgSaturation: 1.3,
                  logoImage: config.logoImage,
                  showLogo: true,
                  logoPos: { x: 40, y: 36 },
                  logoHeight: 72,
                  brandText: 'Fuera De Contexto',
                  mainText: '¿QUÉ HICIMOS?',
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 108,
                  textColor: '#FFFFFF',
                  titlePos: { x: 640, y: 555 },
                  rectColor: '#DC2626',
                  rectTilt: -3,
                  rectTexture: 'stripes',
                  rectOpacity: 0.92,
                  rectWidth: 520,
                  rectPaddingV: 28,
                  rectPaddingH: 44,
                  episodeNumber: config.episodeNumber,
                  showEpisode: true,
                  episodePos: { x: 1150, y: 44 },
                  episodeFontFamily: "'Bebas Neue', sans-serif",
                  episodeShape: 'circle',
                  episodeBgColor: '#FFFFFF',
                  episodeTextColor: '#111111',
                  episodeBadgeSize: 90,
                  showHighlights: false,
                  highlightPos: { x: 330, y: 250 },
                  highlightSize: 200,
                }));
              }}
              className="w-full bg-gray-700 hover:bg-gray-600 text-gray-200 px-3 py-2 rounded-lg text-sm transition-colors border border-gray-600"
            >
              Restablecer diseño
            </button>
          </div>
        </Section>
      </div>

      {/* ── EXPORT (sticky) ── */}
      <div className="sticky bottom-0 bg-gray-900 border-t border-gray-700 p-4">
        <button
          onClick={handleDownload}
          disabled={isExporting}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg"
          style={{ fontWeight: 700 }}
        >
          <Download size={18} />
          {isExporting ? 'Exportando…' : 'Descargar PNG (1280×720)'}
        </button>
        <p className="text-gray-600 text-xs mt-1.5 text-center">Alta calidad · Sin compresión · PNG</p>
      </div>
    </div>
  );
}

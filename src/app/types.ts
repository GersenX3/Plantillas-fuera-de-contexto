export interface ThumbnailConfig {
  // Background
  backgroundImage: string;
  bgBrightness: number;
  bgContrast: number;
  bgSaturation: number;

  // Logo
  logoImage: string | null;
  showLogo: boolean;
  logoPos: { x: number; y: number };
  logoHeight: number;
  brandText: string;

  // Title Text
  mainText: string;
  fontFamily: string;
  fontSize: number;
  textColor: string;
  titlePos: { x: number; y: number };
  titleLineHeight: number;
  titleWordBreak: string;
  titleMaxWidth: number;
  titleWidth: number;

  // Rectangle
  rectColor: string;
  rectTilt: number;
  rectTexture: string;
  rectOpacity: number;
  rectWidth: number;
  rectPaddingV: number;
  rectPaddingH: number;

  // Episode
  episodeNumber: string;
  showEpisode: boolean;
  episodePos: { x: number; y: number };
  episodeFontFamily: string;
  episodeShape: string;
  episodeBgColor: string;
  episodeTextColor: string;
  episodeBadgeSize: number;

  // Highlights
  showHighlights: boolean;
  highlightPos: { x: number; y: number };
  highlightSize: number;
}

export const defaultConfig: ThumbnailConfig = {
  backgroundImage: 'https://images.unsplash.com/photo-1664555182325-e2323f836760?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0d28lMjBmcmllbmRzJTIwbGF1Z2hpbmclMjBwb2RjYXN0JTIwcmVjb3JkaW5nJTIwc3R1ZGlvfGVufDF8fHx8MTc3NjIyMTQ5N3ww&ixlib=rb-4.1.0&q=80&w=1080',
  bgBrightness: 1.1,
  bgContrast: 1.2,
  bgSaturation: 1.3,

  logoImage: null,
  showLogo: true,
  logoPos: { x: 40, y: 36 },
  logoHeight: 72,
  brandText: 'Fuera De Contexto',

  mainText: '¿QUÉ HICIMOS?',
  fontFamily: "'Bebas Neue', sans-serif",
  fontSize: 108,
  textColor: '#FFFFFF',
  titlePos: { x: 640, y: 555 },
  titleLineHeight: 1.0,
  titleWordBreak: 'break-word',
  titleMaxWidth: 520,
  titleWidth: 520,

  rectColor: '#DC2626',
  rectTilt: -3,
  rectTexture: 'stripes',
  rectOpacity: 0.92,
  rectWidth: 520,
  rectPaddingV: 28,
  rectPaddingH: 44,

  episodeNumber: 'EP.12',
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
};
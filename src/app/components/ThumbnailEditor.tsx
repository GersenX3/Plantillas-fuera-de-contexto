import { forwardRef } from 'react';
import { ThumbnailConfig } from '../types';
import { EpisodeBadge } from './EpisodeBadge';

interface Props {
  config: ThumbnailConfig;
}

const TEXTURE_MAP: Record<string, string> = {
  solid: 'none',
  stripes: 'repeating-linear-gradient(45deg, transparent, transparent 9px, rgba(0,0,0,0.18) 9px, rgba(0,0,0,0.18) 18px)',
  stripes_h: 'repeating-linear-gradient(0deg, transparent, transparent 9px, rgba(0,0,0,0.15) 9px, rgba(0,0,0,0.15) 18px)',
  dots: 'radial-gradient(circle, rgba(0,0,0,0.28) 2.5px, transparent 2.5px)',
  grid: 'linear-gradient(rgba(0,0,0,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.18) 1px, transparent 1px)',
  crosshatch: 'repeating-linear-gradient(45deg, rgba(0,0,0,0.12) 1px, transparent 1px, transparent 10px), repeating-linear-gradient(-45deg, rgba(0,0,0,0.12) 1px, transparent 1px, transparent 10px)',
  noise_white: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 4px), repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 4px)',
};

const TEXTURE_SIZE: Record<string, string> = {
  dots: '18px 18px',
  grid: '22px 22px',
};

export const ThumbnailEditor = forwardRef<HTMLDivElement, Props>(({ config }, ref) => {
  const {
    backgroundImage,
    bgBrightness, bgContrast, bgSaturation,
    logoImage, showLogo, logoPos, logoHeight, brandText,
    mainText, fontFamily, fontSize, textColor, titlePos,
    rectColor, rectTilt, rectTexture, rectOpacity, rectWidth, rectPaddingV, rectPaddingH,
    episodeNumber, showEpisode, episodePos,
    episodeFontFamily, episodeShape, episodeBgColor, episodeTextColor, episodeBadgeSize,
    showHighlights, highlightPos, highlightSize,
  } = config;

  const textureCSS = TEXTURE_MAP[rectTexture] || 'none';
  const textureSizeCSS = TEXTURE_SIZE[rectTexture] || undefined;

  return (
    <div
      ref={ref}
      style={{
        width: '1280px',
        height: '720px',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'system-ui, sans-serif',
        userSelect: 'none',
      }}
    >
      {/* ── BACKGROUND IMAGE ── */}
      <div
        style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: `brightness(${bgBrightness}) contrast(${bgContrast}) saturate(${bgSaturation})`,
        }}
      />

      {/* ── GRADIENT OVERLAY ── */}
      <div
        style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.04) 38%, rgba(0,0,0,0.35) 62%, rgba(0,0,0,0.6) 100%)',
        }}
      />

      {/* ── LOGO / BRAND ── */}
      {showLogo && (
        <div
          style={{
            position: 'absolute',
            left: `${logoPos.x}px`,
            top: `${logoPos.y}px`,
            zIndex: 20,
          }}
        >
          {logoImage ? (
            <img
              src={logoImage}
              alt="Logo"
              style={{
                height: `${logoHeight}px`,
                objectFit: 'contain',
                filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.6))',
              }}
            />
          ) : (
            <div
              style={{
                background: 'linear-gradient(135deg, #FBBF24 0%, #F97316 100%)',
                padding: '10px 22px',
                borderRadius: '10px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
              }}
            >
              <span
                style={{
                  fontFamily: "'Bebas Neue', 'Impact', sans-serif",
                  fontWeight: 900,
                  fontSize: `${logoHeight * 0.4}px`,
                  color: '#111',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  whiteSpace: 'nowrap',
                }}
              >
                {brandText}
              </span>
            </div>
          )}
        </div>
      )}

      {/* ── EPISODE NUMBER ── */}
      {showEpisode && (
        <div
          style={{
            position: 'absolute',
            left: `${episodePos.x}px`,
            top: `${episodePos.y}px`,
            zIndex: 20,
            transform: 'translateX(-50%)',
          }}
        >
          <EpisodeBadge
            text={episodeNumber}
            shape={episodeShape}
            bgColor={episodeBgColor}
            textColor={episodeTextColor}
            fontFamily={episodeFontFamily}
            size={episodeBadgeSize}
          />
        </div>
      )}

      {/* ── TILTED TITLE RECTANGLE ── */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: `${titlePos.y}px`,
          zIndex: 10,
          transform: `translateX(-50%) rotate(${rectTilt}deg)`,
          width: '1700px', // wider than canvas so tilt never leaves gaps at edges
        }}
      >
        {/* Background layer (has opacity) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: rectColor,
            backgroundImage: textureCSS,
            backgroundSize: textureSizeCSS,
            opacity: rectOpacity,
            boxShadow: '0 -6px 40px rgba(0,0,0,0.5)',
          }}
        />
        {/* Text layer (full opacity) */}
        <div
          style={{
            position: 'relative',
            padding: `${rectPaddingV}px ${rectPaddingH}px`,
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              fontFamily,
              fontWeight: 900,
              fontSize: `${fontSize}px`,
              color: textColor,
              textTransform: 'uppercase',
              lineHeight: 1.0,
              margin: 0,
              letterSpacing: '-0.01em',
              textShadow: '2px 2px 6px rgba(0,0,0,0.25)',
              wordBreak: 'break-word',
              hyphens: 'auto',
            }}
          >
            {mainText}
          </h1>
        </div>
      </div>

      {/* ── HIGHLIGHT CIRCLE ── */}
      {showHighlights && (
        <div
          style={{
            position: 'absolute',
            left: `${highlightPos.x}px`,
            top: `${highlightPos.y}px`,
            zIndex: 30,
            pointerEvents: 'none',
          }}
        >
          <svg
            width={highlightSize}
            height={highlightSize}
            viewBox={`0 0 ${highlightSize} ${highlightSize}`}
          >
            <defs>
              <filter id="glow-hl">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <circle
              cx={highlightSize / 2}
              cy={highlightSize / 2}
              r={highlightSize / 2 - 8}
              fill="none"
              stroke="#FACC15"
              strokeWidth="8"
              filter="url(#glow-hl)"
            />
          </svg>
          {/* Arrow from circle */}
          <svg
            style={{ position: 'absolute', left: `${highlightSize + 10}px`, top: `${highlightSize * 0.3}px` }}
            width="110"
            height="70"
            viewBox="0 0 110 70"
          >
            <defs>
              <filter id="glow-arrow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path
              d="M 8 10 Q 55 -8 95 28"
              stroke="#FACC15"
              strokeWidth="7"
              fill="none"
              strokeLinecap="round"
              filter="url(#glow-arrow)"
            />
            <polygon
              points="95,28 84,18 90,33"
              fill="#FACC15"
              filter="url(#glow-arrow)"
            />
          </svg>
        </div>
      )}
    </div>
  );
});

ThumbnailEditor.displayName = 'ThumbnailEditor';
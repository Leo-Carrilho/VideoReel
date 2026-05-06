import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

const colors = {
  bg: "#023629ff",
  green: "#22c55e",
  darkGreen: "#14532d",
  cyan: "#00ff95ff",
  text: "#e2e8f0",
  card: "rgba(15,23,42,0.8)",
};

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  @keyframes subtleGrain {
    0%,100% { transform: translate(0,0) }
    10%      { transform: translate(-1px, 1px) }
    20%      { transform: translate(1px, -1px) }
    30%      { transform: translate(-1px, -1px) }
    40%      { transform: translate(1px, 1px) }
    50%      { transform: translate(0, -1px) }
    60%      { transform: translate(-1px, 0) }
    70%      { transform: translate(1px, 0) }
    80%      { transform: translate(0, 1px) }
    90%      { transform: translate(1px, -1px) }
  }

  @keyframes pulseGlow {
    0%, 100% { opacity: 0.4; }
    50%       { opacity: 0.7; }
  }

  @keyframes scanline {
    0%   { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }
`;

const StyleInjector = () => (
  <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
);

const font = {
  display: "'Syne', sans-serif",
  body: "'DM Sans', sans-serif",
};

// ─── Contexto de cena ─────────────────────────────────────────────────────────
// Agora expõe tanto `start` quanto `end` para as funções FadeOut* funcionarem
const SceneContext = React.createContext({ start: 0, end: 9999 });

const Scene = ({ start, end, children }) => (
  <SceneContext.Provider value={{ start, end }}>
    {children}
  </SceneContext.Provider>
);

// ─── FUNÇÕES FADE ORIGINAIS (entrada) ────────────────────────────────────────

const FadeUp = ({ children, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { start } = React.useContext(SceneContext);
  const localFrame = frame - start;
  const progress = spring({ frame: localFrame - delay, fps });
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const translateY = interpolate(progress, [0, 1], [60, 0]);
  return (
    <div style={{ opacity, transform: `translateY(${translateY}px)` }}>
      {children}
    </div>
  );
};

const FadeDown = ({ children, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { start } = React.useContext(SceneContext);
  const localFrame = frame - start;
  const progress = spring({ frame: localFrame - delay, fps });
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const translateY = interpolate(progress, [0, 1], [-60, 0]);
  return (
    <div style={{ opacity, transform: `translateY(${translateY}px)` }}>
      {children}
    </div>
  );
};

const FadeRight = ({ children, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { start } = React.useContext(SceneContext);
  const localFrame = frame - start;
  const progress = spring({ frame: localFrame - delay, fps });
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const translateX = interpolate(progress, [0, 1], [-60, 0]);
  return (
    <div style={{ opacity, transform: `translateX(${translateX}px)` }}>
      {children}
    </div>
  );
};

const FadeLeft = ({ children, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { start } = React.useContext(SceneContext);
  const localFrame = frame - start;
  const progress = spring({ frame: localFrame - delay, fps });
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const translateX = interpolate(progress, [0, 1], [60, 0]);
  return (
    <div style={{ opacity, transform: `translateX(${translateX}px)` }}>
      {children}
    </div>
  );
};

// ─── FUNÇÕES FADE DE SAÍDA ────────────────────────────────────────────────────
// Mesma matemática das originais, mas o `frame` é regressivo:
// conta a partir do momento em que faltam `exitBefore` frames pro fim da cena.
// FadeOutDown  → conteúdo sobe ao sair  (espelho do FadeUp)
// FadeOutUp    → conteúdo desce ao sair (espelho do FadeDown)
// FadeOutRight → conteúdo vai p/ direita ao sair (espelho do FadeLeft)
// FadeOutLeft  → conteúdo vai p/ esquerda ao sair (espelho do FadeRight)

const FadeOutDown = ({ children, exitBefore = 20 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { end } = React.useContext(SceneContext);
  const reverseFrame = exitBefore - (end - frame);
  const progress = spring({ frame: reverseFrame, fps });
  const opacity = interpolate(progress, [0, 1], [1, 0]);
  const translateY = interpolate(progress, [0, 1], [0, -60]);
  return (
    <div style={{ opacity, transform: `translateY(${translateY}px)` }}>
      {children}
    </div>
  );
};

const FadeOutUp = ({ children, exitBefore = 20 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { end } = React.useContext(SceneContext);
  const reverseFrame = exitBefore - (end - frame);
  const progress = spring({ frame: reverseFrame, fps });
  const opacity = interpolate(progress, [0, 1], [1, 0]);
  const translateY = interpolate(progress, [0, 1], [0, 60]);
  return (
    <div style={{ opacity, transform: `translateY(${translateY}px)` }}>
      {children}
    </div>
  );
};

const FadeOutRight = ({ children, exitBefore = 20 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { end } = React.useContext(SceneContext);
  const reverseFrame = exitBefore - (end - frame);
  const progress = spring({ frame: reverseFrame, fps });
  const opacity = interpolate(progress, [0, 1], [1, 0]);
  const translateX = interpolate(progress, [0, 1], [0, 60]);
  return (
    <div style={{ opacity, transform: `translateX(${translateX}px)` }}>
      {children}
    </div>
  );
};

const FadeOutLeft = ({ children, exitBefore = 20 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { end } = React.useContext(SceneContext);
  const reverseFrame = exitBefore - (end - frame);
  const progress = spring({ frame: reverseFrame, fps });
  const opacity = interpolate(progress, [0, 1], [1, 0]);
  const translateX = interpolate(progress, [0, 1], [0, -60]);
  return (
    <div style={{ opacity, transform: `translateX(${translateX}px)` }}>
      {children}
    </div>
  );
};

// ─── Screen premium ───────────────────────────────────────────────────────────
const Screen = ({ children }) => (
  <AbsoluteFill
    style={{
      background: `
        radial-gradient(ellipse 80% 50% at 50% -10%, rgba(0,255,149,0.12) 0%, transparent 60%),
        radial-gradient(ellipse 60% 40% at 80% 110%, rgba(20,83,45,0.3) 0%, transparent 55%),
        linear-gradient(160deg, #021f17 0%, #023629 45%, #011a10 100%)
      `,
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      gap: 20,
      padding: 40,
      fontFamily: font.body,
      color: colors.text,
      overflow: "hidden",
    }}
  >
    <div style={{
      position: "absolute", inset: 0,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
      backgroundSize: "180px 180px", opacity: 0.35, pointerEvents: "none", zIndex: 0,
      animation: "subtleGrain 0.8s steps(1) infinite", mixBlendMode: "overlay",
    }} />
    <div style={{
      position: "absolute", left: 0, right: 0, height: "2px",
      background: "linear-gradient(90deg, transparent, rgba(0,255,149,0.08), transparent)",
      animation: "scanline 6s linear infinite", pointerEvents: "none", zIndex: 0,
    }} />
    <div style={{
      position: "relative", zIndex: 1, display: "flex", flexDirection: "column",
      alignItems: "center", gap: 20, width: "100%",
    }}>
      {children}
    </div>
  </AbsoluteFill>
);

const PremiumCard = ({ children, style = {} }) => (
  <div style={{
    background: "linear-gradient(135deg, rgba(0, 141, 82, 1) 0%, rgba(9, 184, 140, 0.5) 50%, rgba(2,54,41,0.5) 100%)",
    backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
    border: "1px solid rgba(0,255,149,0.15)", borderRadius: 16, padding: "10px 40px",
    boxShadow: "0 4px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(0,255,149,0.1)",
    ...style,
  }}>
    {children}
  </div>
);

const SectionTag = ({ children }) => (
  <div style={{
    display: "inline-flex", alignItems: "center", gap: 20, padding: "4px 14px",
    borderRadius: 999, border: "1px solid rgba(0,255,149,0.3)",
    background: "rgba(0,255,149,0.07)", color: colors.cyan, fontFamily: font.body,
    fontSize: 33, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase",
    marginBottom: 8,
  }}>
    <span style={{
      width: 8, height: 8, borderRadius: "50%", background: colors.cyan,
      display: "inline-block", boxShadow: `0 0 10px ${colors.cyan}`,
    }} />
    {children}
  </div>
);

const Divider = () => (
  <div style={{
    width: "100%", height: 5, borderRadius: 2,
    background: `linear-gradient(90deg, transparent, ${colors.cyan}, transparent)`,
    margin: "4px auto", opacity: 0.5,
  }} />
);

// ─── CENA DRONE CINEMATOGRÁFICA ───────────────────────────────────────────────
const DroneScene = ({ localFrame, totalFrames }) => {
  const progress = localFrame / totalFrames;

  const camX     = interpolate(progress, [0, 1], [0, -60]);
  const camY     = interpolate(progress, [0, 1], [0, 20]);
  const camScale = interpolate(progress, [0, 1], [1.0, 1.08]);

  const droneX    = interpolate(progress, [0, 0.5, 1], [180, 400, 650]);
  const droneY    = interpolate(progress, [0, 0.25, 0.5, 0.75, 1], [280, 260, 275, 255, 270]);
  const droneTilt = interpolate(progress, [0, 0.5, 1], [-8, 0, 6]);

  const floatOffset = Math.sin(localFrame * 0.18) * 5;
  const floatTilt   = Math.sin(localFrame * 0.12) * 2;

  const trailPositions = Array.from({ length: 6 }, (_, i) => {
    const t = Math.max(0, progress - (i + 1) * 0.012);
    return {
      x: interpolate(t, [0, 0.5, 1], [180, 400, 650]),
      y: interpolate(t, [0, 0.25, 0.5, 0.75, 1], [280, 260, 275, 255, 270]),
      opacity: interpolate(i, [0, 5], [0.35, 0.03]),
      scale:   interpolate(i, [0, 5], [0.85, 0.3]),
    };
  });

  const cloud1X = interpolate(progress, [0, 1], [120, 160]);
  const cloud2X = interpolate(progress, [0, 1], [520, 560]);
  const cloud3X = interpolate(progress, [0, 1], [820, 870]);
  const sunGlow = interpolate(Math.sin(localFrame * 0.08), [-1, 1], [0.6, 1.0]);

  return (
    <svg viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#87CEEB" />
          <stop offset="40%"  stopColor="#B8E4F7" />
          <stop offset="100%" stopColor="#D6F0FF" />
        </linearGradient>
        <linearGradient id="fieldGrad1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#4a7c2f" />
          <stop offset="100%" stopColor="#2d5a1b" />
        </linearGradient>
        <linearGradient id="fieldGrad2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#5a9e36" />
          <stop offset="100%" stopColor="#3a7020" />
        </linearGradient>
        <linearGradient id="fieldGrad3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#3d6b25" />
          <stop offset="100%" stopColor="#254515" />
        </linearGradient>
        <linearGradient id="soilGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#8B6914" />
          <stop offset="100%" stopColor="#5a4209" />
        </linearGradient>
        <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
          <stop offset="0%"   stopColor="transparent" />
          <stop offset="100%" stopColor="rgba(0,20,10,0.45)" />
        </radialGradient>
        <filter id="cloudBlur"><feGaussianBlur stdDeviation="8" /></filter>
        <filter id="sunGlowF">
          <feGaussianBlur stdDeviation="18" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="droneShadow">
          <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="rgba(0,0,0,0.5)" />
        </filter>
        <filter id="droneGlowF">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <clipPath id="frameClip">
          <rect x="0" y="0" width="1080" height="1920" />
        </clipPath>
      </defs>

      <g clipPath="url(#frameClip)"
        transform={`translate(${camX}, ${camY}) scale(${camScale})`}
        style={{ transformOrigin: "540px 960px" }}>

        {/* Céu */}
        <rect x="-100" y="0" width="1300" height="1200" fill="url(#skyGrad)" />

        {/* Sol */}
        <circle cx="820" cy="160" r="90" fill="#FFE066" opacity={sunGlow} filter="url(#sunGlowF)" />
        <circle cx="820" cy="160" r="65" fill="#FFD700" opacity="0.95" />
        <circle cx="820" cy="160" r="50" fill="#FFF0A0" opacity="0.9" />

        {/* Nuvem 1 */}
        <g transform={`translate(${cloud1X}, 140)`} opacity="0.92">
          <ellipse cx="0"   cy="0"   rx="100" ry="48" fill="white" />
          <ellipse cx="-60" cy="10"  rx="60"  ry="38" fill="white" />
          <ellipse cx="65"  cy="8"   rx="70"  ry="42" fill="white" />
          <ellipse cx="10"  cy="-15" rx="55"  ry="35" fill="#f5f5f5" />
        </g>
        {/* Nuvem 2 */}
        <g transform={`translate(${cloud2X}, 200)`} opacity="0.85">
          <ellipse cx="0"   cy="0"  rx="75" ry="35" fill="white" />
          <ellipse cx="-45" cy="8"  rx="48" ry="28" fill="white" />
          <ellipse cx="48"  cy="6"  rx="50" ry="30" fill="white" />
        </g>
        {/* Nuvem 3 */}
        <g transform={`translate(${cloud3X}, 120)`} opacity="0.78">
          <ellipse cx="0"   cy="0"   rx="90" ry="42" fill="white" />
          <ellipse cx="-55" cy="10"  rx="52" ry="32" fill="white" />
          <ellipse cx="55"  cy="7"   rx="58" ry="34" fill="white" />
          <ellipse cx="5"   cy="-12" rx="45" ry="28" fill="#f0f0f0" />
        </g>

        {/* Campos */}
        <polygon points="-80,820 480,780 480,1100 -80,1150" fill="url(#fieldGrad1)" />
        {Array.from({ length: 10 }, (_, i) => (
          <line key={`rl-${i}`}
            x1={-80 + i * 60} y1={820 + i * 4}
            x2={-80 + i * 60 + 20} y2={1150 + i * 2}
            stroke="rgba(0,0,0,0.12)" strokeWidth="2" />
        ))}

        <polygon points="480,760 760,770 760,1080 480,1080" fill="url(#fieldGrad2)" />
        {Array.from({ length: 8 }, (_, i) => (
          <line key={`rc-${i}`}
            x1={480 + i * 35} y1={760}
            x2={480 + i * 35} y2={1080}
            stroke="rgba(0,0,0,0.1)" strokeWidth="1.5" />
        ))}

        <polygon points="760,775 1160,800 1160,1140 760,1090" fill="url(#fieldGrad3)" />
        {Array.from({ length: 10 }, (_, i) => (
          <line key={`rr-${i}`}
            x1={760 + i * 45} y1={775 + i * 3}
            x2={760 + i * 45 + 15} y2={1100 + i * 2}
            stroke="rgba(0,0,0,0.1)" strokeWidth="2" />
        ))}

        <polygon points="-80,1140 1160,1120 1160,1300 -80,1300" fill="url(#soilGrad)" />

        {/* Campo frontal com plantas */}
        <polygon points="-80,1260 1160,1240 1160,1650 -80,1680" fill="#3d8c2a" />
        {Array.from({ length: 22 }, (_, col) =>
          Array.from({ length: 5 }, (_, row) => {
            const px = -60 + col * 56;
            const py = 1290 + row * 80;
            return (
              <g key={`pl-${col}-${row}`} transform={`translate(${px}, ${py})`}>
                <ellipse cx="0" cy="-8" rx="10" ry="14" fill="#4ea82d" opacity="0.85" />
                <rect x="-1.5" y="-8" width="3" height="18" fill="#3a7a20" />
              </g>
            );
          })
        )}

        {/* Vinheta */}
        <rect x="-100" y="0" width="1300" height="1920" fill="url(#vignette)" />

        {/* God rays */}
        <g opacity={interpolate(sunGlow, [0.6, 1.0], [0.04, 0.08])}>
          {[0, 15, -15, 28, -28].map((angle, i) => (
            <rect key={`ray-${i}`} x="795" y="150" width="50" height="900"
              fill="rgba(255,240,120,0.4)"
              transform={`rotate(${angle} 820 160)`}
              style={{ transformOrigin: "820px 160px" }} />
          ))}
        </g>

        {/* Rastro */}
        {trailPositions.map((t, i) => (
          <g key={`trail-${i}`}
            transform={`translate(${t.x}, ${t.y + floatOffset}) scale(${t.scale})`}
            opacity={t.opacity}>
            <ellipse cx="0" cy="0" rx="22" ry="8" fill={colors.cyan} />
          </g>
        ))}

        {/* Drone */}
        <g transform={`translate(${droneX}, ${droneY + floatOffset}) rotate(${droneTilt + floatTilt})`}
          filter="url(#droneShadow)"
          style={{ transformOrigin: `${droneX}px ${droneY}px` }}>
          <rect x="-22" y="-10" width="44" height="20" rx="6" ry="6"
            fill="#1a1a2e" stroke={colors.cyan} strokeWidth="1.5" />
          <circle cx="0" cy="12" r="7" fill="#0d0d1a" stroke="#00ccff" strokeWidth="1" />
          <circle cx="0" cy="12" r="4" fill="#001a26" />
          <circle cx="0" cy="-4" r="3" fill={colors.cyan}
            opacity={0.7 + Math.sin(localFrame * 0.4) * 0.3} />
          {[[-36, -30], [36, -30], [-36, 30], [36, 30]].map(([ax, ay], i) => (
            <g key={`arm-${i}`}>
              <line x1="0" y1="0" x2={ax} y2={ay}
                stroke="#333355" strokeWidth="4" strokeLinecap="round" />
              <circle cx={ax} cy={ay} r="8" fill="#222244" stroke="#444466" strokeWidth="1.5" />
              <g transform={`translate(${ax}, ${ay}) rotate(${localFrame * 22 * (i % 2 === 0 ? 1 : -1)})`}
                style={{ transformOrigin: `${ax}px ${ay}px` }}>
                <ellipse cx="0" cy="0" rx="18" ry="3.5" fill={colors.cyan} opacity="0.45" />
              </g>
              <g transform={`translate(${ax}, ${ay}) rotate(${90 + localFrame * 22 * (i % 2 === 0 ? 1 : -1)})`}
                style={{ transformOrigin: `${ax}px ${ay}px` }}>
                <ellipse cx="0" cy="0" rx="18" ry="3.5" fill={colors.cyan} opacity="0.45" />
              </g>
            </g>
          ))}
          <ellipse cx="0" cy="60" rx="30" ry="8"
            fill={colors.cyan} opacity={0.06 + Math.sin(localFrame * 0.15) * 0.03}
            filter="url(#droneGlowF)" />
        </g>

        {/* HUD */}
        <rect x="0" y="0"    width="1080" height="60" fill="rgba(0,0,0,0.55)" />
        <rect x="0" y="1860" width="1080" height="60" fill="rgba(0,0,0,0.55)" />
        <text x="40" y="42" fill={colors.cyan} fontFamily="'Courier New', monospace" fontSize="26" opacity="0.75">
          ZENITH AGRO · ALT 85m · {Math.round(8 + progress * 4)} km/h
        </text>
        <text x="900" y="42" fill="rgba(255,255,255,0.5)" fontFamily="'Courier New', monospace" fontSize="22" opacity="0.6">
          4K · REC
        </text>
        <circle cx="878" cy="34" r="7" fill="#ff3333"
          opacity={0.6 + Math.sin(localFrame * 0.3) * 0.4} />
        <text x="40" y="1895" fill="rgba(255,255,255,0.4)" fontFamily="'Courier New', monospace" fontSize="22" opacity="0.6">
          22°44'S  47°20'W · Americana - SP
        </text>

        {/* Lens flare */}
        {progress > 0.35 && progress < 0.65 && (
          <g opacity={interpolate(progress, [0.35, 0.5, 0.65], [0, 0.18, 0])}>
            <ellipse cx="540" cy="300" rx="600" ry="80"
              fill="rgba(255,255,200,0.6)" filter="url(#cloudBlur)" />
            <circle cx="540" cy="300" r="20" fill="rgba(255,255,255,0.5)" />
          </g>
        )}

      </g>
    </svg>
  );
};

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
//
// Mapa de cenas (30fps):
//   Cena 1 : 0   → 120   Cena 2 : 120 → 240   Cena 3 : 240 → 360
//   Cena 4 : 360 → 480   Cena 5 : 480 → 720   Cena 6 : 720 → 820
//   Cena 7 : 820 → 940   Cena 8 : 940 → 1180  (drone)
//
// Transições: cada elemento tem FadeXxx na entrada + FadeOutXxx na saída.
// As funções FadeOut* usam `end` do SceneContext para o frame regressivo.

export const Main = () => {
  const frame = useCurrentFrame();

  // ── CENA 1 ─────────────────────────────────────────────────────────────────
  if (frame < 120)
    return (
      <Scene start={0} end={120}>
        <Screen>
          <StyleInjector />
          <div style={{
            position: "absolute", width: 600, height: 600, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,255,149,0.07) 0%, transparent 70%)",
            top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            pointerEvents: "none", animation: "pulseGlow 3s ease-in-out infinite",
          }} />

          <FadeUp delay={20}>
            <FadeOutDown exitBefore={22}>
              <div style={{ textAlign: "center" }}>
                <h1 style={{
                  color: colors.cyan, fontSize: 100, marginBottom: 0,
                  fontFamily: font.display, fontWeight: 800, letterSpacing: "-0.04em",
                  lineHeight: 0.9,
                  textShadow: `0 0 80px rgba(0,255,149,0.35), 0 0 160px rgba(0,255,149,0.15)`,
                  WebkitTextStroke: "1px rgba(0,255,149,0.4)",
                }}>ZENITH</h1>
              </div>
            </FadeOutDown>
          </FadeUp>

          <FadeUp delay={40}>
            <FadeOutUp exitBefore={18}>
              <Divider />
              <p style={{
                color: "rgba(250, 252, 255, 0.75)", fontSize: 42, fontFamily: font.body,
                fontWeight: 300, textAlign: "center", letterSpacing: "0.01em",
                marginTop: 16, lineHeight: 1.4,
              }}>
                A sua precisão agrícola{" "}
                <em style={{ color: colors.cyan, fontStyle: "normal", fontWeight: 400 }}>
                  no ponto mais alto
                </em>
              </p>
            </FadeOutUp>
          </FadeUp>
        </Screen>
      </Scene>
    );

  // ── CENA 2 ─────────────────────────────────────────────────────────────────
  if (frame < 240)
    return (
      <Scene start={120} end={240}>
        <Screen>
          <StyleInjector />

          <FadeLeft>
            <FadeOutRight exitBefore={22}>
              <h2 style={{
                color: colors.text, fontSize: 72, textAlign: "center",
                marginBottom: 200, fontFamily: font.display, fontWeight: 700,
                lineHeight: 1.15, letterSpacing: "-0.03em",
              }}>
                Cuidamos da sua{" "}
                <span style={{ color: colors.cyan, fontSize: 96, display: "block", textShadow: `0 0 40px rgba(0,255,149,0.4)`, fontWeight: 800 }}>
                  Plantação
                </span>
                <Divider />
              </h2>
            </FadeOutRight>
          </FadeLeft>

          {[
            { text: "Reduzir perdas na lavoura",          delay: 0  },
            { text: "Aumentar produtividade sustentável", delay: 10 },
            { text: "Economizar insumos",                 delay: 20 },
            { text: "Tomar decisões com dados reais",     delay: 30 },
          ].map(({ text, delay }, i) => (
            <PremiumCard key={i} style={{ width: "90%" }}>
              <FadeUp delay={delay}>
                <FadeOutLeft exitBefore={18}>
                  <p style={{
                    display: "flex", alignItems: "center", gap: 40, margin: "50px 0",
                    color: colors.text, fontFamily: font.body, fontSize: 45,
                    fontWeight: 500, lineHeight: i === 3 ? 2 : 1.3, letterSpacing: "0.3px",
                    borderBottom: i < 3 ? `${i === 3 ? 2 : 1}px solid rgba(0,255,149,0.12)` : "none",
                    paddingBottom: i < 3 ? 14 : 0,
                  }}>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: colors.cyan, flexShrink: 0, boxShadow: `0 0 10px ${colors.cyan}` }} />
                    {text}
                  </p>
                </FadeOutLeft>
              </FadeUp>
            </PremiumCard>
          ))}
        </Screen>
      </Scene>
    );

  // ── CENA 3 ─────────────────────────────────────────────────────────────────
  if (frame < 360)
    return (
      <Scene start={240} end={360}>
        <Screen>
          <StyleInjector />

          <FadeDown>
            <FadeOutDown exitBefore={22}>
              <SectionTag>Especialidades</SectionTag>
            </FadeOutDown>
          </FadeDown>

          <FadeUp delay={5}>
            <FadeOutUp exitBefore={22}>
              <h2 style={{
                color: colors.cyan, fontFamily: font.display, fontWeight: 800,
                fontSize: 82, letterSpacing: "-0.02em", margin: "0 0 80px",
                textShadow: "0 0 30px rgba(34,197,94,0.3)",
              }}>O que fazemos</h2>
            </FadeOutUp>
          </FadeUp>

          <div style={{ width: "100%", display: "grid", gridTemplateColumns: "2fr 2fr", gap: 14 }}>
            {[
              { label: "Monitoramento da lavoura", icon: "◎", span: false },
              { label: "Otimização",               icon: "⬡", span: false },
              { label: "Desempenho",                icon: "▲", span: false },
              { label: "Acessibilidade",            icon: "◈", span: false },
              { label: "Detecção de doenças",       icon: "⬟", span: true  },
            ].map(({ label, icon, span }, i) => (
              <div key={i} style={{ gridColumn: span ? "1 / -1" : undefined }}>
                <FadeUp delay={i * 10}>
                  <FadeOutUp exitBefore={18}>
                    <div style={{
                      background: "linear-gradient(135deg, rgba(0,255,149,0.05), rgba(2,54,41,0.4))",
                      border: "1px solid rgba(0, 243, 142, 0.53)",
                      borderLeft: `3px solid rgba(0, 243, 142, 1)`,
                      borderRadius: 12, padding: span ? "50px 28px" : "50px 18px",
                      display: "flex", flexDirection: span ? "row" : "column",
                      alignItems: span ? "center" : "flex-start", gap: span ? 16 : 10,
                      backdropFilter: "blur(8px)", boxShadow: "0 2px 16px rgba(0,0,0,0.3)",
                      boxSizing: "border-box", width: "100%", height: "100%",
                      marginBottom: span ? 0 : 14,
                    }}>
                      <span style={{ color: colors.cyan, fontSize: 28, opacity: 0.85, fontFamily: "monospace", flexShrink: 0 }}>{icon}</span>
                      <span style={{ color: colors.text, fontFamily: font.body, fontSize: 36, fontWeight: 400, lineHeight: 1.3 }}>{label}</span>
                    </div>
                  </FadeOutUp>
                </FadeUp>
              </div>
            ))}
          </div>
        </Screen>
      </Scene>
    );

  // ── CENA 4 ─────────────────────────────────────────────────────────────────
  if (frame < 480) {
    const CENA4_START  = 360;
    const localFrame4  = frame - CENA4_START;
    const count        = Math.min(5, Math.floor(localFrame4 / 2) + 1);
    const diseases     = [
      { name: "Ferrugem Asiática", severity: "Alta",    color: "#FF6B35" },
      { name: "Mancha Bacteriana", severity: "Média",   color: "#FFA726" },
      { name: "Mancha-alvo",       severity: "Média",   color: "#FF9800" },
      { name: "Cercospora",        severity: "Baixa",   color: "#FFCA28" },
      { name: "Ataque de Lagarta", severity: "Baixa",   color: "#FFCA28" },
      { name: "Saudável",          severity: "Nenhuma", color: "#66BB6A" },
    ];
    return (
      <Scene start={CENA4_START} end={480}>
        <Screen>
          <StyleInjector />

          <FadeDown>
            <FadeOutDown exitBefore={22}>
              <SectionTag>Diagnóstico</SectionTag>
            </FadeOutDown>
          </FadeDown>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", padding: "30px 20px", gap: 24 }}>

            <FadeUp delay={0}>
              <FadeOutUp exitBefore={22}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                  <div style={{ position: "relative", width: 260, height: 260, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ position: "absolute", width: 250, height: 250, borderRadius: "50%", border: "2px solid rgba(0,255,149,0.06)" }} />
                    <h1 style={{
                      position: "relative", color: colors.cyan, fontSize: 140,
                      fontFamily: "monospace", fontWeight: 700, letterSpacing: "-0.06em",
                      lineHeight: 1, margin: 0,
                      textShadow: `0 0 30px rgba(0,255,149,0.9), 0 0 60px rgba(0,255,149,0.5), 0 0 90px rgba(0,255,149,0.3), 0 0 120px rgba(0,255,149,0.15)`,
                    }}>{count}</h1>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ color: colors.text, fontFamily: font.display, fontSize: 56, fontWeight: 700, letterSpacing: "-0.03em", margin: 0, lineHeight: 1.1 }}>Detecção</p>
                    <p style={{ color: colors.text, fontFamily: font.display, fontSize: 56, fontWeight: 700, letterSpacing: "-0.03em", margin: 0, lineHeight: 1.1 }}>de pragas e doenças disponíveis</p>
                    <p style={{ color: colors.cyan, fontFamily: font.display, fontWeight: 800, fontSize: 72, letterSpacing: "-0.03em", margin: "0 0 8px", textShadow: "0 0 30px rgba(34,197,94,0.3)" }}>pela Zenith</p>
                  </div>
                </div>
              </FadeOutUp>
            </FadeUp>

            <br /><br />

            <FadeUp delay={8}>
              <FadeOutUp exitBefore={18}>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "90%", maxWidth: 500 }}>
                  {diseases.map((disease, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "18px 24px", borderRadius: 16,
                      background: "rgba(13, 36, 31, 0.85)", backdropFilter: "blur(16px)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04), 0 0 0 1px rgba(0,255,149,0.04)",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <span style={{ color: "#E2E8F0", fontFamily: font.body, fontSize: 32, fontWeight: 500, letterSpacing: "0.01em", lineHeight: 1.2 }}>{disease.name}</span>
                      </div>
                      <span style={{
                        padding: "8px 18px", borderRadius: 999,
                        background: `${disease.color}15`, border: `1.5px solid ${disease.color}50`,
                        color: disease.color, fontFamily: font.body, fontSize: 26, fontWeight: 600,
                        letterSpacing: "0.05em", boxShadow: `0 0 16px ${disease.color}20, inset 0 0 12px ${disease.color}08`,
                      }}>{disease.severity}</span>
                    </div>
                  ))}
                </div>
              </FadeOutUp>
            </FadeUp>
          </div>
        </Screen>
      </Scene>
    );
  }

  // ── CENA 5 ─────────────────────────────────────────────────────────────────
  if (frame < 720)
    return (
      <Scene start={480} end={720}>
        <Screen>
          <StyleInjector />

          <FadeDown>
            <FadeOutDown exitBefore={22}>
              <SectionTag>Nosso Time</SectionTag>
            </FadeOutDown>
          </FadeDown>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", padding: "30px 20px", gap: 28 }}>

            <FadeUp delay={0}>
              <FadeOutUp exitBefore={22}>
                <div style={{ textAlign: "center" }}>
                  <h2 style={{ color: colors.text, fontFamily: font.display, fontWeight: 700, fontSize: 64, letterSpacing: "-0.03em", margin: "0 0 0", lineHeight: 1.1 }}>Nossos</h2>
                  <h2 style={{ color: colors.cyan, fontFamily: font.display, fontWeight: 700, fontSize: 64, letterSpacing: "-0.03em", margin: "0 0 10px", lineHeight: 1.1, textShadow: `0 0 30px rgba(0,255,149,0.5), 0 0 60px rgba(0,255,149,0.2)` }}>Especialistas</h2>
                  <div style={{ width: "100%", height: 2, background: "linear-gradient(90deg, transparent, rgba(0,255,149,0.4), transparent)", margin: "0 0 100px" }} />
                </div>
              </FadeOutUp>
            </FadeUp>

            <FadeUp delay={5}>
              <FadeOutUp exitBefore={22}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, width: "98%", maxWidth: 620 }}>
                  {[
                    { name: "Leonardo Carrilho", role: "Web/Mobile Developer",      initials: "LC" },
                    { name: "Samuel Vieira",      role: "Backend/Frontend Developer", initials: "SV" },
                    { name: "Octávio Augusto",    role: "ML/Prompt Engineer",         initials: "OA" },
                    { name: "Pietro Gimenez",     role: "Web Developer",              initials: "PG" },
                  ].map((member, i) => (
                    <div key={i} style={{
                      background: "linear-gradient(145deg, rgba(0,255,149,0.05) 0%, rgba(2,54,41,0.4) 100%)",
                      border: "1px solid rgba(0,255,149,0.1)", borderRadius: 18, padding: "72px 58px",
                      backdropFilter: "blur(12px)",
                      boxShadow: "0 6px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03), 0 0 0 1px rgba(0,255,149,0.03)",
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
                      transition: "all 0.3s ease",
                    }}>
                      <div style={{
                        width: 67, height: 67, borderRadius: "50%",
                        background: `linear-gradient(135deg, ${colors.cyan}30, rgba(0,255,149,0.08))`,
                        border: `2px solid ${colors.cyan}40`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: `0 0 20px rgba(0,255,149,0.2), inset 0 0 12px rgba(0,255,149,0.1)`,
                      }}>
                        <span style={{ fontSize: 22, color: colors.cyan, fontFamily: font.display, fontWeight: 700, letterSpacing: "0.02em", textShadow: "0 0 8px rgba(0,255,149,0.4)" }}>{member.initials}</span>
                      </div>
                      <span style={{ color: "#E2E8F0", fontFamily: font.body, fontSize: 28, fontWeight: 500, letterSpacing: "0.01em", lineHeight: 1.2, textAlign: "center" }}>{member.name}</span>
                      <span style={{ color: "rgba(0,255,149,0.5)", fontFamily: font.body, fontSize: 20, fontWeight: 300, letterSpacing: "0.04em", textAlign: "center", lineHeight: 1 }}>{member.role}</span>
                    </div>
                  ))}
                </div>
              </FadeOutUp>
            </FadeUp>
          </div>
        </Screen>
      </Scene>
    );

  // ── CENA 6 ─────────────────────────────────────────────────────────────────
  if (frame < 820)
    return (
      <Scene start={720} end={820}>
        <Screen>
          <StyleInjector />

          <FadeDown>
            <FadeOutDown exitBefore={22}>
              <SectionTag>Localização</SectionTag>
            </FadeOutDown>
          </FadeDown>

          <FadeUp delay={5}>
            <FadeOutUp exitBefore={22}>
              <h2 style={{ color: colors.cyan, fontFamily: font.display, fontWeight: 800, fontSize: 72, letterSpacing: "-0.03em", margin: "0 0 8px", textShadow: "0 0 30px rgba(34,197,94,0.3)" }}>
                Onde estamos
              </h2>
            </FadeOutUp>
          </FadeUp>

          <Divider />

          <FadeUp delay={15}>
            <FadeOutUp exitBefore={18}>
              <p style={{ color: "rgba(226,232,240,0.7)", fontFamily: font.body, fontSize: 36, fontWeight: 300, textAlign: "center", letterSpacing: "0.01em", marginTop: 12 }}>
                Estamos localizados em{" "}
                <span style={{ color: colors.cyan, fontWeight: 500 }}>Americana - SP</span>
              </p>
              <p style={{ color: "rgba(226,232,240,0.5)", fontFamily: font.body, fontSize: 32, fontWeight: 300, textAlign: "center", letterSpacing: "0.04em", textTransform: "uppercase", marginTop: 4 }}>
                Em breve, expandindo para todo o estado
              </p>
            </FadeOutUp>
          </FadeUp>
        </Screen>
      </Scene>
    );

  // ── CENA 7 — Final ZENITH ──────────────────────────────────────────────────
  if (frame < 940)
    return (
      <Scene start={820} end={940}>
        <Screen>
          <StyleInjector />
          <div style={{
            position: "absolute", width: 500, height: 500, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,255,149,0.1) 0%, transparent 65%)",
            animation: "pulseGlow 2.5s ease-in-out infinite", pointerEvents: "none",
          }} />

          <FadeUp delay={0}>
            <FadeOutUp exitBefore={22}>
            <img src="/assets/image/img_logo.jpeg" alt="ZENITH AGRO" />
            </FadeOutUp>
          </FadeUp>

          <Divider />

          <FadeUp delay={20}>
            <FadeOutDown exitBefore={22}>
              <p style={{ color: "rgba(226,232,240,0.55)", fontFamily: font.body, fontSize: 36, fontWeight: 300, letterSpacing: "0.12em", textTransform: "uppercase", position: "relative" }}>
                Acesse:{" "}
                <span style={{ color: colors.cyan, fontWeight: 500, letterSpacing: "0.06em" }}>@zenith.agricola</span>
              </p>
            </FadeOutDown>
          </FadeUp>
        </Screen>
      </Scene>
    );

  // ── CENA 8 — DRONE CINEMATOGRÁFICO ────────────────────────────────────────
  // Duração: frames 940 → 1180 (8s @ 30fps)
  // Atualize durationInFrames: 1180 no root.tsx / index.ts
  const DRONE_START      = 940;
  const DRONE_END        = 1180;
  const droneLocal       = frame - DRONE_START;
  const droneTotalFrames = DRONE_END - DRONE_START;

  return (
    <Scene start={DRONE_START} end={DRONE_END}>
      <AbsoluteFill style={{ background: "#000" }}>
        <StyleInjector />
        <DroneScene localFrame={droneLocal} totalFrames={droneTotalFrames} />

        {/* Título com FadeUp entrada + FadeOutDown saída — mesmas funções */}
        <AbsoluteFill style={{ pointerEvents: "none", zIndex: 10 }}>
          <div style={{
            position: "absolute", bottom: 130, left: 0, right: 0,
            display: "flex", flexDirection: "column", alignItems: "center",
          }}>
            <FadeUp delay={30}>
              <FadeOutDown exitBefore={28}>
                <div style={{
                  background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)",
                  borderTop: `1px solid rgba(0,255,149,0.3)`,
                  borderBottom: `1px solid rgba(0,255,149,0.3)`,
                  padding: "18px 60px", textAlign: "center",
                }}>
                  <p style={{ color: "rgba(255,255,255,0.55)", fontFamily: font.body, fontSize: 28, fontWeight: 300, letterSpacing: "0.18em", textTransform: "uppercase", margin: "0 0 6px" }}>
                    Tecnologia que voa com você
                  </p>
                  <img src="/public/assets/images/zenith-logo.png" alt="ZENITH AGRO" style={{ maxWidth: "100%", height: "auto", margin: "10px 0" }} />
                  <p style={{ color: "rgba(255,255,255,0.4)", fontFamily: font.body, fontSize: 26, fontWeight: 300, letterSpacing: "0.12em", textTransform: "uppercase", margin: "6px 0 0" }}>
                    @zenith.agricola
                  </p>
                </div>
              </FadeOutDown>
            </FadeUp>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </Scene>
  );
};
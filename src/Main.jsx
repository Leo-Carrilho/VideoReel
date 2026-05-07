import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Img,
  staticFile,
} from "remotion";

// ─── PALETA ──────────────────────────────────────────────────────────────────
const colors = {
  bg: "#023629ff",
  green: "#22c55e",
  darkGreen: "#14532d",
  cyan: "#00ff95ff",
  text: "#e2e8f0",
  card: "rgba(15,23,42,0.8)",
};

const font = {
  display: "'Syne', sans-serif",
  body: "'DM Sans', sans-serif",
};

// ─── TIMING CONSTANTS (30 fps) ───────────────────────────────────────────────
export const SCENES = {
  S1: { start: 0,    end: 150  }, // 5s  — Intro
  S2: { start: 150,  end: 330  }, // 6s  — Plantação
  S3: { start: 330,  end: 510  }, // 6s  — Especialidades
  S4: { start: 510,  end: 690  }, // 6s  — Diagnóstico
  S5: { start: 690,  end: 900  }, // 7s  — Nosso Time
  S6: { start: 900,  end: 1050 }, // 5s  — Localização
  S7: { start: 1050, end: 1200 }, // 5s  — Final
};

// ─── CSS GLOBAL ───────────────────────────────────────────────────────────────
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
    0%, 100% { opacity: 0.35; transform: scale(1); }
    50%       { opacity: 0.65; transform: scale(1.06); }
  }

  @keyframes scanline {
    0%   { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-8px); }
  }
`;

const StyleInjector = () => (
  <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
);

// ─── CONTEXT ─────────────────────────────────────────────────────────────────
const SceneContext = React.createContext({ start: 0, end: 9999 });

const Scene = ({ start, end, children }) => (
  <SceneContext.Provider value={{ start, end }}>
    {children}
  </SceneContext.Provider>
);

// ─── SPRING CONFIG PRESETS ───────────────────────────────────────────────────
const SPRING_SMOOTH   = { damping: 18, stiffness: 80,  mass: 1   };
const SPRING_SNAPPY   = { damping: 22, stiffness: 120, mass: 0.8 };
const SPRING_GENTLE   = { damping: 28, stiffness: 60,  mass: 1.2 };

// ─── ANIMAÇÃO HELPERS ─────────────────────────────────────────────────────────

/**
 * Hook que retorna um valor spring de entrada (0→1) relativo à cena.
 */
const useEntrance = (delay = 0, config = SPRING_SMOOTH) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { start } = React.useContext(SceneContext);
  return spring({ frame: frame - start - delay, fps, config });
};

/**
 * Hook que retorna um valor spring de saída (0→1) relativo ao fim da cena.
 */
const useExit = (exitBefore = 20, config = SPRING_SNAPPY) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { end } = React.useContext(SceneContext);
  return spring({ frame: exitBefore - (end - frame), fps, config });
};

// ─── COMPONENTES DE ANIMAÇÃO ──────────────────────────────────────────────────

const FadeUp = ({ children, delay = 0, distance = 55, config }) => {
  const p = useEntrance(delay, config || SPRING_SMOOTH);
  return (
    <div style={{
      opacity: interpolate(p, [0, 1], [0, 1]),
      transform: `translateY(${interpolate(p, [0, 1], [distance, 0])}px)`,
    }}>
      {children}
    </div>
  );
};

const FadeDown = ({ children, delay = 0, distance = 55, config }) => {
  const p = useEntrance(delay, config || SPRING_SMOOTH);
  return (
    <div style={{
      opacity: interpolate(p, [0, 1], [0, 1]),
      transform: `translateY(${interpolate(p, [0, 1], [-distance, 0])}px)`,
    }}>
      {children}
    </div>
  );
};

const FadeRight = ({ children, delay = 0, distance = 55 }) => {
  const p = useEntrance(delay);
  return (
    <div style={{
      opacity: interpolate(p, [0, 1], [0, 1]),
      transform: `translateX(${interpolate(p, [0, 1], [-distance, 0])}px)`,
    }}>
      {children}
    </div>
  );
};

const FadeLeft = ({ children, delay = 0, distance = 55 }) => {
  const p = useEntrance(delay);
  return (
    <div style={{
      opacity: interpolate(p, [0, 1], [0, 1]),
      transform: `translateX(${interpolate(p, [0, 1], [distance, 0])}px)`,
    }}>
      {children}
    </div>
  );
};

const ScaleIn = ({ children, delay = 0, config }) => {
  const p = useEntrance(delay, config || SPRING_GENTLE);
  return (
    <div style={{
      opacity: interpolate(p, [0, 1], [0, 1]),
      transform: `scale(${interpolate(p, [0, 1], [0.82, 1])})`,
    }}>
      {children}
    </div>
  );
};

// ─── FADE OUT ─────────────────────────────────────────────────────────────────

const FadeOutDown = ({ children, exitBefore = 22 }) => {
  const p = useExit(exitBefore);
  return (
    <div style={{
      opacity: interpolate(p, [0, 1], [1, 0]),
      transform: `translateY(${interpolate(p, [0, 1], [0, -50])}px)`,
    }}>
      {children}
    </div>
  );
};

const FadeOutUp = ({ children, exitBefore = 22 }) => {
  const p = useExit(exitBefore);
  return (
    <div style={{
      opacity: interpolate(p, [0, 1], [1, 0]),
      transform: `translateY(${interpolate(p, [0, 1], [0, 50])}px)`,
    }}>
      {children}
    </div>
  );
};

const FadeOutRight = ({ children, exitBefore = 22 }) => {
  const p = useExit(exitBefore);
  return (
    <div style={{
      opacity: interpolate(p, [0, 1], [1, 0]),
      transform: `translateX(${interpolate(p, [0, 1], [0, 55])}px)`,
    }}>
      {children}
    </div>
  );
};

const FadeOutLeft = ({ children, exitBefore = 22 }) => {
  const p = useExit(exitBefore);
  return (
    <div style={{
      opacity: interpolate(p, [0, 1], [1, 0]),
      transform: `translateX(${interpolate(p, [0, 1], [0, -55])}px)`,
    }}>
      {children}
    </div>
  );
};

const FadeOutScale = ({ children, exitBefore = 22 }) => {
  const p = useExit(exitBefore);
  return (
    <div style={{
      opacity: interpolate(p, [0, 1], [1, 0]),
      transform: `scale(${interpolate(p, [0, 1], [1, 0.9])})`,
    }}>
      {children}
    </div>
  );
};

// ─── CARD STAGGERED — helper para cards que entram um por um ──────────────────
/**
 * Cada card entra individualmente após `delay` frames desde o início da cena.
 * Nunca sai sozinho — mantém-se até o FadeOut da cena pai.
 */
const StaggerCard = ({ children, delay = 0, direction = "up", distance = 50 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { start } = React.useContext(SceneContext);
  const localFrame = frame - start - delay;
  const p = spring({ frame: localFrame, fps, config: SPRING_SMOOTH });
  const opacity = interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  let transform = "";
  if (direction === "up")    transform = `translateY(${interpolate(p, [0,1],[distance,0])}px)`;
  if (direction === "right") transform = `translateX(${interpolate(p, [0,1],[-distance,0])}px)`;
  if (direction === "scale") transform = `scale(${interpolate(p, [0,1],[0.85,1])})`;

  return (
    <div style={{ opacity, transform }}>
      {children}
    </div>
  );
};

// ─── LAYOUT PRIMITIVOS ────────────────────────────────────────────────────────

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
    {/* Noise grain overlay */}
    <div style={{
      position: "absolute", inset: 0,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
      backgroundSize: "180px 180px", opacity: 0.35, pointerEvents: "none", zIndex: 0,
      animation: "subtleGrain 0.8s steps(1) infinite", mixBlendMode: "overlay",
    }} />
    {/* Scanline */}
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
    background: "linear-gradient(135deg, rgba(0,141,82,1) 0%, rgba(9,184,140,0.5) 50%, rgba(2,54,41,0.5) 100%)",
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

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export const Main = () => {
  const frame = useCurrentFrame();
  const { S1, S2, S3, S4, S5, S6, S7 } = SCENES;

  // ── CENA 1 — Intro ZENITH ─────────────────────────────────────────────────
  if (frame < S1.end)
    return (
      <Scene start={S1.start} end={S1.end}>
        <Screen>
          <StyleInjector />

          {/* Glowing orb de fundo */}
          <div style={{
            position: "absolute", width: 700, height: 700, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,255,149,0.08) 0%, transparent 70%)",
            top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            pointerEvents: "none", animation: "pulseGlow 3.5s ease-in-out infinite",
          }} />

          <ScaleIn delay={0} config={SPRING_GENTLE}>
            <FadeUp exitBefore={25}>
              <div style={{ textAlign: "center" }}>
                <h1 style={{
                  color: colors.cyan, fontSize: 120, marginBottom: 0,
                  fontFamily: font.display, fontWeight: 800, letterSpacing: "-0.04em",
                  lineHeight: 0.9,
                  textShadow: `0 0 80px rgba(0,255,149,0.4), 0 0 160px rgba(0,255,149,0.18)`,
                  WebkitTextStroke: "1px rgba(0,255,149,0.4)",
                  animation: "float 4s ease-in-out infinite",
                }}>ZENITH</h1>
              </div>
            </FadeUp>
          </ScaleIn>

          <FadeUp delay={20} config={SPRING_GENTLE}>
            <FadeOutUp exitBefore={22}>
              <Divider />
              <p style={{
                color: "rgba(250,252,255,0.75)", fontSize: 42, fontFamily: font.body,
                fontWeight: 300, textAlign: "center", letterSpacing: "0.01em",
                marginTop: 18, lineHeight: 1.4,
              }}>
                A sua precisão agrícola{" "}
                <em style={{ color: colors.cyan, fontStyle: "normal", fontWeight: 400 }}>
                  no ponto mais alto
                </em>
              </p>
            </FadeOutUp>
          </FadeUp>

          <FadeUp delay={40} config={SPRING_GENTLE}>
            <FadeOutUp exitBefore={18}>
              <p style={{
                color: colors.cyan, fontFamily: font.body,
                fontSize: 28, fontWeight: 300, letterSpacing: "0.22em",
                textTransform: "uppercase", textAlign: "center", marginTop: 8,
              }}>
                Tecnologia · Precisão · Resultado
              </p>
            </FadeOutUp>
          </FadeUp>
        </Screen>
      </Scene>
    );

  // ── CENA 2 — Plantação ────────────────────────────────────────────────────
  if (frame < S2.end)
    return (
      <Scene start={S2.start} end={S2.end}>
        <Screen>
          <StyleInjector />

          <FadeLeft delay={0}>
            <FadeOutRight exitBefore={22}>
              <h2 style={{
                color: colors.text, fontSize: 72, textAlign: "center",
                marginBottom: 28, fontFamily: font.display, fontWeight: 700,
                lineHeight: 1.15, letterSpacing: "-0.03em",
              }}>
                Cuidamos da sua{" "}
                <span style={{
                  color: colors.cyan, fontSize: 96, display: "block",
                  textShadow: `0 0 40px rgba(0,255,149,0.4)`, fontWeight: 800,
                }}>
                  Plantação
                </span>
                <Divider />
              </h2>
            </FadeOutRight>
          </FadeLeft>

          {[
            { text: "Reduzir perdas na lavoura",          delay: 8  },
            { text: "Aumentar produtividade sustentável", delay: 20 },
            { text: "Economizar insumos",                 delay: 32 },
            { text: "Tomar decisões com dados reais",     delay: 44 },
          ].map(({ text, delay }, i) => (
            <StaggerCard key={i} delay={delay} direction="right" distance={60}>
              <FadeOutLeft exitBefore={18}>
                <PremiumCard
                    style={{
                      width: 980, // todos ficam exatamente com a mesma largura
                      minHeight: 105,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      borderRadius: 30,
                      padding: "0 34px",
                      background:
                        "linear-gradient(150deg, rgba(8, 163, 96, 0.85) 30%, rgba(8, 84, 46, 0.95) 100%)",
                      border: "1px solid rgba(0,255,149,0.18)",
                      backdropFilter: "blur(18px)",
                      boxShadow:
                        "0 10px 40px rgba(0,0,0,0.35), 0 0 25px rgba(0,255,149,0.08)",
                    }}
                  >
                  <p style={{
                    display: "flex", alignItems: "center", gap: 40, margin: "46px 0",
                    color: colors.text, fontFamily: font.body, fontSize: 45,
                    fontWeight: 500, lineHeight: i === 3 ? 2 : 1.3, letterSpacing: "0.3px",
                    borderBottom: i < 3 ? `1px solid rgba(0,255,149,0.12)` : "none",
                    paddingBottom: i < 3 ? 14 : 0,
                  }}>
                    <span style={{
                      width: 10, height: 10, borderRadius: "50%",
                      background: colors.cyan, flexShrink: 0,
                      boxShadow: `0 0 15px ${colors.cyan}`,
                    }} />
                    {text}
                  </p>
                </PremiumCard>
              </FadeOutLeft>
            </StaggerCard>
          ))}
        </Screen>
      </Scene>
    );

  // ── CENA 3 — Especialidades ───────────────────────────────────────────────
  if (frame < S3.end)
    return (
      <Scene start={S3.start} end={S3.end}>
        <Screen>
          <StyleInjector />

          <FadeDown delay={0}>
            <FadeOutDown exitBefore={22}>
              <SectionTag>Especialidades</SectionTag>
            </FadeOutDown>
          </FadeDown>

          <FadeUp delay={6}>
            <FadeOutUp exitBefore={22}>
              <h2 style={{
                color: colors.cyan, fontFamily: font.display, fontWeight: 800,
                fontSize: 82, letterSpacing: "-0.02em", margin: "0 0 60px",
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
                <StaggerCard delay={i * 14 + 12} direction="up" distance={40}>
                  <FadeOutUp exitBefore={18}>
                    <div style={{
                      background: "linear-gradient(135deg, rgba(0,255,149,0.05), rgba(2,54,41,0.4))",
                      border: "1px solid rgba(0,243,142,0.53)",
                      borderLeft: `3px solid rgba(0,243,142,1)`,
                      borderRadius: 12, padding: span ? "46px 28px" : "46px 18px",
                      display: "flex", flexDirection: span ? "row" : "column",
                      alignItems: span ? "center" : "flex-start", gap: span ? 16 : 10,
                      backdropFilter: "blur(8px)", boxShadow: "0 2px 16px rgba(0,0,0,0.3)",
                      boxSizing: "border-box", width: "100%",
                      marginBottom: span ? 0 : 14,
                    }}>
                      <span style={{ color: colors.cyan, fontSize: 28, opacity: 0.85, fontFamily: "monospace", flexShrink: 0 }}>{icon}</span>
                      <span style={{ color: colors.text, fontFamily: font.body, fontSize: 36, fontWeight: 400, lineHeight: 1.3 }}>{label}</span>
                    </div>
                  </FadeOutUp>
                </StaggerCard>
              </div>
            ))}
          </div>
        </Screen>
      </Scene>
    );

  // ── CENA 4 — Diagnóstico (cards escalonados) ─────────────────────────────
  if (frame < S4.end) {
    const localFrame = frame - S4.start;
    const count = Math.min(5, Math.floor(localFrame / 4) + 1);
    const diseases = [
      { name: "Ferrugem Asiática", severity: "Alta",    color: "#FF6B35" },
      { name: "Mancha Bacteriana", severity: "Média",   color: "#FFA726" },
      { name: "Mancha-alvo",       severity: "Média",   color: "#FF9800" },
      { name: "Cercospora",        severity: "Baixa",   color: "#FFCA28" },
      { name: "Ataque de Lagarta", severity: "Baixa",   color: "#FFCA28" },
      { name: "Saudável",          severity: "Nenhuma", color: "#66BB6A" },
    ];

    return (
      <Scene start={S4.start} end={S4.end}>
        <Screen>
          <StyleInjector />

          <FadeDown delay={0}>
            <FadeOutDown exitBefore={22}>
              <SectionTag>Diagnóstico</SectionTag>
            </FadeOutDown>
          </FadeDown>

          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", width: "100%", padding: "20px 20px", gap: 20,
          }}>
            {/* Contador central */}
            <FadeUp delay={0}>
              <FadeOutUp exitBefore={22}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                  <div style={{
                    position: "relative", width: 240, height: 240,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <div style={{
                      position: "absolute", width: 230, height: 230, borderRadius: "50%",
                      border: "2px solid rgba(0,255,149,0.1)",
                    }} />
                    <div style={{
                      position: "absolute", width: 190, height: 190, borderRadius: "50%",
                      border: "1px solid rgba(0,255,149,0.05)",
                    }} />
                    <h1 style={{
                      position: "relative", color: colors.cyan, fontSize: 130,
                      fontFamily: "monospace", fontWeight: 700, letterSpacing: "-0.06em",
                      lineHeight: 1, margin: 0,
                      textShadow: `0 0 30px rgba(0,255,149,0.9), 0 0 60px rgba(0,255,149,0.5),
                                   0 0 90px rgba(0,255,149,0.3), 0 0 120px rgba(0,255,149,0.15)`,
                    }}>{count}</h1>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ color: colors.text, fontFamily: font.display, fontSize: 50, fontWeight: 700, letterSpacing: "-0.03em", margin: 0, lineHeight: 1.1 }}>Detecção</p>
                    <p style={{ color: colors.text, fontFamily: font.display, fontSize: 44, fontWeight: 700, letterSpacing: "-0.03em", margin: 0, lineHeight: 1.1 }}>de pragas e doenças disponíveis</p>
                    <p style={{ color: colors.cyan, fontFamily: font.display, fontWeight: 800, fontSize: 64, letterSpacing: "-0.03em", margin: "4px 0 0", textShadow: "0 0 30px rgba(34,197,94,0.3)" }}>pela Zenith</p>
                  </div>
                </div>
              </FadeOutUp>
            </FadeUp>

            {/* Cards escalonados — cada um entra separado */}
            <div style={{ display: "flex", flexDirection: "column", gap: 18, width: 820 }}>
              {diseases.map((disease, i) => (
                <StaggerCard key={i} delay={i * 16 + 10} direction="right" distance={70}>
                  <FadeOutUp exitBefore={16}>
                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "22px 32px", minHeight: 96, borderRadius: 20,
                      background: "rgba(13,36,31,0.85)", backdropFilter: "blur(16px)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      boxShadow: `0 8px 24px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.04), 0 0 0 1px rgba(0,255,149,0.04)`,
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <span style={{
                          width: 8, height: 8, borderRadius: "50%",
                          background: disease.color, flexShrink: 0,
                          boxShadow: `0 0 8px ${disease.color}80`,
                        }} />
                        <span style={{
                          color: "#E2E8F0", fontFamily: font.body, fontSize: 32,
                          fontWeight: 500, letterSpacing: "0.01em", lineHeight: 1.2,
                        }}>{disease.name}</span>
                      </div>
                      <span style={{
                        padding: "7px 16px", borderRadius: 999,
                        background: `${disease.color}15`, border: `1.5px solid ${disease.color}50`,
                        color: disease.color, fontFamily: font.body, fontSize: 24, fontWeight: 600,
                        letterSpacing: "0.05em",
                        boxShadow: `0 0 16px ${disease.color}20, inset 0 0 12px ${disease.color}08`,
                      }}>{disease.severity}</span>
                    </div>
                  </FadeOutUp>
                </StaggerCard>
              ))}
            </div>
          </div>
        </Screen>
      </Scene>
    );
  }

  // ── CENA 5 — Nosso Time (cards escalonados em grid) ──────────────────────
  if (frame < S5.end) {
    const members = [
      { name: "Leonardo Carrilho", role: "Web/Mobile Developer",       initials: "LC" },
      { name: "Samuel Vieira",     role: "Back/Front Developer",  initials: "SV" },
      { name: "Octávio Augusto",   role: "ML Engineer",          initials: "OA" },
      { name: "Pietro Gimenez",    role: "Web Developer",               initials: "PG" },
    ];

    return (
      <Scene start={S5.start} end={S5.end}>
        <Screen>
          <StyleInjector />

          <FadeDown delay={0}>
            <FadeOutDown exitBefore={22}>
              <SectionTag>Nosso Time</SectionTag>
            </FadeOutDown>
          </FadeDown>

          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", width: "100%", padding: "10px 10px", gap: 8,
          }}>
            <FadeUp delay={0}>
              <FadeOutUp exitBefore={22}>
                <div style={{ textAlign: "center" }}>
                  <h2 style={{ color: colors.text, fontFamily: font.display, fontWeight: 700, fontSize: 64, letterSpacing: "-0.03em", margin: "0 0 0", lineHeight: 1.1 }}>Nossos</h2>
                  <h2 style={{
                    color: colors.cyan, fontFamily: font.display, fontWeight: 700,
                    fontSize: 64, letterSpacing: "-0.03em", margin: "0 0 10px", lineHeight: 1.1,
                    textShadow: `0 0 30px rgba(0,255,149,0.5), 0 0 60px rgba(0,255,149,0.2)`,
                  }}>Especialistas</h2>
                  <div style={{
                    width: "100%", height: 2,
                    background: "linear-gradient(90deg, transparent, rgba(0,255,149,0.4), transparent)",
                    margin: "0 0 30px",
                  }} />
                </div>
              </FadeOutUp>
            </FadeUp>

            {/* Grid com cards escalonados */}
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24,
              width: "100%", padding: "0 10px",
            }}>
              {members.map((member, i) => (
                <StaggerCard key={i} delay={i * 18 + 10} direction="up" distance={55}>
                  <FadeOutScale exitBefore={20}>
                    <div style={{
                      background: "linear-gradient(145deg, rgba(0,255,149,0.05) 0%, rgba(2,54,41,0.4) 100%)",
                      border: "1px solid rgba(0,255,149,0.1)", borderRadius: 24,
                      padding: "80px 40px", minHeight: 380, width: "100%",
                      backdropFilter: "blur(12px)",
                      boxShadow: "0 6px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)",
                      display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "center",
                      gap: 20, boxSizing: "border-box",
                    }}>
                      <div style={{
                        width: 72, height: 72, borderRadius: "50%",
                        background: `linear-gradient(135deg, ${colors.cyan}30, rgba(0,255,149,0.08))`,
                        border: `2px solid ${colors.cyan}40`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: `0 0 22px rgba(0,255,149,0.2), inset 0 0 12px rgba(0,255,149,0.1)`,
                      }}>
                        <span style={{
                          fontSize: 24, color: colors.cyan, fontFamily: font.display,
                          fontWeight: 700, letterSpacing: "0.02em",
                          textShadow: "0 0 8px rgba(0,255,149,0.4)",
                        }}>{member.initials}</span>
                      </div>
                      <span style={{
                        color: "#E2E8F0", fontFamily: font.body, fontSize: 35, fontWeight: 500,
                        letterSpacing: "0.01em", lineHeight: 1.2, textAlign: "center", marginTop: 10,
                      }}>{member.name}</span>
                      <span style={{
                        color:colors.cyan, fontFamily: font.display, fontSize: 30,
                        fontWeight: 700, letterSpacing: "0.04em", textAlign: "center", lineHeight: 1,
                      }}>{member.role}</span>
                    </div>
                  </FadeOutScale>
                </StaggerCard>
              ))}
            </div>
          </div>
        </Screen>
      </Scene>
    );
  }

  // ── CENA 6 — Localização ─────────────────────────────────────────────────
  if (frame < S6.end)
    return (
      <Scene start={S6.start} end={S6.end}>
        <Screen>
          <StyleInjector />

          <FadeDown delay={0}>
            <FadeOutDown exitBefore={22}>
              <SectionTag>Localização</SectionTag>
            </FadeOutDown>
          </FadeDown>

          <FadeUp delay={8}>
            <FadeOutUp exitBefore={22}>
              <h2 style={{
                color: colors.cyan, fontFamily: font.display, fontWeight: 800,
                fontSize: 72, letterSpacing: "-0.03em", margin: "0 0 8px",
                textShadow: "0 0 30px rgba(34,197,94,0.3)",
              }}>
                Onde estamos
              </h2>
            </FadeOutUp>
          </FadeUp>

          <StaggerCard delay={18} direction="up" distance={40}>
            <FadeOutUp exitBefore={22}>
              <Divider />
            </FadeOutUp>
          </StaggerCard>

          <StaggerCard delay={28} direction="up" distance={50}>
            <FadeOutUp exitBefore={18}>
              <p style={{
                color: "rgba(226,232,240,0.7)", fontFamily: font.body, fontSize: 36,
                fontWeight: 300, textAlign: "center", letterSpacing: "0.01em", marginTop: 14,
              }}>
                Estamos localizados em{" "}
                <span style={{ color: colors.cyan, fontWeight: 500 }}>Americana - SP</span>
              </p>
            </FadeOutUp>
          </StaggerCard>

          <StaggerCard delay={44} direction="up" distance={50}>
            <FadeOutUp exitBefore={18}>
              <p style={{
                color: "rgba(226,232,240,0.5)", fontFamily: font.body, fontSize: 32,
                fontWeight: 300, textAlign: "center", letterSpacing: "0.04em",
                textTransform: "uppercase", marginTop: 4,
              }}>
                Em breve, expandindo para todo o estado
              </p>
            </FadeOutUp>
          </StaggerCard>

          {/* Detalhe visual extra */}
          <StaggerCard delay={60} direction="scale" distance={0}>
            <FadeOutScale exitBefore={18}>
              <div style={{
                marginTop: 32, padding: "18px 48px", borderRadius: 999,
                border: "1px solid rgba(0,255,149,0.2)",
                background: "rgba(0,255,149,0.05)",
                display: "flex", alignItems: "center", gap: 16,
              }}>
                <span style={{
                  color: "rgba(226,232,240,0.6)", fontFamily: font.body,
                  fontSize: 28, fontWeight: 300, letterSpacing: "0.06em",
                }}>Estado de São Paulo · Brasil</span>
              </div>
            </FadeOutScale>
          </StaggerCard>
        </Screen>
      </Scene>
    );

  // ── CENA 7 — Final ZENITH ─────────────────────────────────────────────────
  if (frame < S7.end)
    return (
      <Scene start={S7.start} end={S7.end}>
        <Screen>
          <StyleInjector />

          {/* Orb pulsante de fundo */}
          <div style={{
            position: "absolute", width: 550, height: 550, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,255,149,0.1) 0%, transparent 65%)",
            animation: "pulseGlow 2.5s ease-in-out infinite", pointerEvents: "none",
          }} />

          <ScaleIn delay={0} config={SPRING_GENTLE}>
            <FadeOutScale exitBefore={24}>
              <Img
                src={staticFile("/assets/image/logo-redonda.png")}
                alt="ZENITH AGRO"
                style={{
                  width: 700, height: "auto", marginBottom: 24,
                }}
              />
            </FadeOutScale>
          </ScaleIn>

          <FadeUp delay={18}>
            <FadeOutUp exitBefore={22}>
              <Divider />
            </FadeOutUp>
          </FadeUp>

          <FadeUp delay={30}>
            <FadeOutDown exitBefore={22}>
              <p style={{
                color: "rgba(226,232,240,0.55)", fontFamily: font.body,
                fontSize: 36, fontWeight: 300, letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}>
                Acesse:{" "}
                <span style={{ color: colors.cyan, fontWeight: 500, letterSpacing: "0.06em" }}>
                  @zenith.agricola
                </span>
              </p>
            </FadeOutDown>
          </FadeUp>

          <FadeUp delay={50}>
            <FadeOutUp exitBefore={18}>
              <p style={{
                color: colors.cyan, fontFamily: font.body,
                fontSize: 24, fontWeight: 300, letterSpacing: "0.2em",
                textTransform: "uppercase", marginTop: 8, textAlign: "center",
              }}>
                Tecnologia a serviço do campo
              </p>
            </FadeOutUp>
          </FadeUp>
        </Screen>
      </Scene>
    );

  return null;
};
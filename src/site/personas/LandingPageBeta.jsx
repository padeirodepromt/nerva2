import React, { useEffect, useState } from "react";

const BG_IMAGE =
  "https://myyavzcjwaspnoswzvcq.supabase.co/storage/v1/object/public/Prana/download%20(1).jpg";

const conversation = [
  {
    id: 1,
    role: "assistant",
    author: "Ash",
    text:
      "Percebo um aumento de criatividade se aproximando. Antes de agir, vale proteger sua energia.",
    style: { top: 40, left: "6%" },
    delay: 400,
  },
  {
    id: 2,
    role: "system",
    author: "Sistema",
    text:
      "Pico cognitivo estimado para as próximas 48h. Atenção ao risco de sobrecarga.",
    style: { top: 140, right: "12%" },
    delay: 1600,
  },
  {
    id: 3,
    role: "user",
    author: "Você",
    text: "Quero criar sem entrar em exaustão.",
    style: { bottom: 80, left: "36%" },
    delay: 3000,
  },
  {
    id: 4,
    role: "assistant",
    author: "Ash",
    text:
      "Então vamos reduzir ruído, respeitar seus ciclos e direcionar foco apenas ao essencial.",
    style: { bottom: 180, right: "30%" },
    delay: 4200,
  },
];

export default function HolisticHero() {
  return (
    <section style={styles.hero}>
      <img src={BG_IMAGE} alt="" style={styles.bg} />
      <div style={styles.overlay} />

      <div style={styles.inner}>
        {/* TEXTO CENTRAL */}
        <div style={styles.copy}>
          <h1 style={styles.h1}>
            Desenvolva sua vida
            <br />
            <span style={styles.h1Span}>no ritmo certo</span>
          </h1>
          <p style={styles.p}>
            Prana entende seus ciclos, respeita sua biologia e transforma intenção
            em criação sustentável.
          </p>
        </div>

        {/* CAMPO DE CONVERSA */}
        <div style={styles.field}>
          {conversation.map((msg) => (
            <ChatBubble key={msg.id} {...msg} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ChatBubble({ role, author, text, delay, style }) {
  const [visible, setVisible] = useState("");

  useEffect(() => {
    const t = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        setVisible((v) => v + text[i]);
        i++;
        if (i >= text.length) clearInterval(interval);
      }, 20);
    }, delay);
    return () => clearTimeout(t);
  }, [text, delay]);

  const isUser = role === "user";
  const isSystem = role === "system";

  return (
    <div
      style={{
        ...styles.bubble,
        ...(isUser ? styles.user : {}),
        ...(isSystem ? styles.system : {}),
        ...style,
      }}
    >
      <div style={styles.author}>{author}</div>
      <div>{visible}</div>
    </div>
  );
}

const styles = {
  hero: {
    position: "relative",
    minHeight: "100vh",
    overflow: "hidden",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, Inter, system-ui, sans-serif",
    color: "#111",
  },

  bg: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: 0,
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to bottom, rgba(255,255,255,0.35), rgba(255,255,255,0.6))",
    zIndex: 1,
  },

  inner: {
    position: "relative",
    zIndex: 2,
    minHeight: "100vh",
    padding: "80px 40px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  copy: {
    textAlign: "center",
    maxWidth: 820,
    marginBottom: 90,
  },

  h1: {
    fontSize: "clamp(44px, 6vw, 76px)",
    fontWeight: 500,
    lineHeight: 1.05,
    marginBottom: 24,
    color: "#111",
  },

  h1Span: {
    opacity: 0.6,
    fontWeight: 300,
  },

  p: {
    fontSize: 18,
    color: "#333",
    lineHeight: 1.6,
  },

  field: {
    position: "relative",
    width: "100%",
    maxWidth: 1200,
    height: 520,
  },

  bubble: {
    position: "absolute",
    maxWidth: 360,
    padding: "18px 22px",
    fontSize: 14,
    lineHeight: 1.55,
    background: "rgba(255,255,255,0.75)",
    backdropFilter: "blur(16px)",
    borderRadius: 20,
    border: "1px solid rgba(255,255,255,0.6)",
    boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
    color: "#111",
  },

  user: {
    background: "rgba(245,245,245,0.85)",
    borderRadius: "20px 20px 6px 20px",
  },

  system: {
    background: "rgba(255,255,255,0.55)",
    fontSize: 12,
    opacity: 0.85,
  },

  author: {
    fontSize: 11,
    fontWeight: 600,
    opacity: 0.45,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
};

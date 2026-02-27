/* canvas: tailwind.config.js */
/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
      "./index.html", 
      "./src/**/*.{ts,tsx,js,jsx}"
    ],
    theme: {
      container: {
        center: true,
        padding: "2rem",
        screens: { "2xl": "1400px" },
      },
      extend: {
        borderRadius: {
            lg: 'var(--radius)',
            md: 'calc(var(--radius) - 2px)',
            sm: 'calc(var(--radius) - 4px)'
        },
        colors: {
            border: "rgb(var(--border) / <alpha-value>)",
            input: "rgb(var(--input) / <alpha-value>)",
            ring: "rgb(var(--ring) / <alpha-value>)",
            background: "rgb(var(--background) / <alpha-value>)",
            foreground: "rgb(var(--foreground) / <alpha-value>)",
            primary: {
                DEFAULT: "rgb(var(--primary) / <alpha-value>)",
                foreground: "rgb(var(--primary-foreground) / <alpha-value>)",
            },
            secondary: {
                DEFAULT: "rgb(var(--secondary) / <alpha-value>)",
                foreground: "rgb(var(--secondary-foreground) / <alpha-value>)",
            },
            destructive: {
                DEFAULT: "rgb(var(--destructive) / <alpha-value>)",
                foreground: "rgb(var(--destructive-foreground) / <alpha-value>)",
            },
            muted: {
                DEFAULT: "rgb(var(--muted) / <alpha-value>)",
                foreground: "rgb(var(--muted-foreground) / <alpha-value>)",
            },
            accent: {
                DEFAULT: "rgb(var(--accent) / <alpha-value>)",
                foreground: "rgb(var(--accent-foreground) / <alpha-value>)",
            },
            popover: {
                DEFAULT: "rgb(var(--popover) / <alpha-value>)",
                foreground: "rgb(var(--popover-foreground) / <alpha-value>)",
            },
            card: {
                DEFAULT: "rgb(var(--card) / <alpha-value>)",
                foreground: "rgb(var(--card-foreground) / <alpha-value>)",
            },
        },
        animation: {
            'wave': 'wave 1.2s ease-in-out infinite',
            'pulse-glow': 'pulse-glow 3s infinite',
            'bg-pan': 'bg-pan 25s ease-in-out infinite',
            'chat-flow': 'chat-flow 3s linear infinite', // Adicionado
            "accordion-down": "accordion-down 0.2s ease-out",
            "accordion-up": "accordion-up 0.2s ease-out",
        },
        keyframes: {
            wave: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-4px)' } },
            'pulse-glow': { '0%, 100%': { filter: 'drop-shadow(0 0 4px rgba(var(--primary), 0.4))' }, '50%': { filter: 'drop-shadow(0 0 12px rgba(var(--primary), 0.7))' } },
            'bg-pan': { '0%': { backgroundPosition: '0% 50%' }, '50%': { backgroundPosition: '100% 50%' }, '100%': { backgroundPosition: '0% 50%' } },
            'chat-flow': { '0%': { strokeDashoffset: '200' }, '100%': { strokeDashoffset: '0' } },
            "accordion-down": {
                from: { height: "0" },
                to: { height: "var(--radix-accordion-content-height)" },
            },
            "accordion-up": {
                from: { height: "var(--radix-accordion-content-height)" },
                to: { height: "0" },
            },
        }
      }
    },
    plugins: [require("tailwindcss-animate")],
}
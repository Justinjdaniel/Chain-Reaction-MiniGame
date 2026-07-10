/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#090d16",
        neonGreen: "#00ff66",
        neonRed: "#ff0055",
        neonBlue: "#00f0ff",
        neonYellow: "#ffea00",
        neonPurple: "#d000ff",
        neonOrange: "#ff8800",
        neonPink: "#ff00aa",
        neonCyan: "#00ffff"
      },
      boxShadow: {
        'neon-green': '0 0 10px #00ff66, 0 0 20px #00ff66',
        'neon-red': '0 0 10px #ff0055, 0 0 20px #ff0055',
        'neon-blue': '0 0 10px #00f0ff, 0 0 20px #00f0ff',
        'neon-yellow': '0 0 10px #ffea00, 0 0 20px #ffea00',
        'neon-purple': '0 0 10px #d000ff, 0 0 20px #d000ff',
        'neon-orange': '0 0 10px #ff8800, 0 0 20px #ff8800',
        'neon-pink': '0 0 10px #ff00aa, 0 0 20px #ff00aa',
        'neon-cyan': '0 0 10px #00ffff, 0 0 20px #00ffff',
      }
    },
  },
  plugins: [],
}

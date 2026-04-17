import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#10222f",
        mist: "#eef5f3",
        shell: "#fbf7ef",
        brand: "#0d6b63",
        ember: "#dc7c3f",
        pine: "#1f4f47",
        sand: "#d8c8a2",
        cloud: "#dfe6e3"
      },
      boxShadow: {
        panel: "0 24px 60px rgba(17, 35, 48, 0.12)"
      },
      fontFamily: {
        sans: ["Aptos", "Segoe UI", "PingFang SC", "Microsoft YaHei", "sans-serif"],
        display: ["Iowan Old Style", "Palatino Linotype", "Book Antiqua", "Georgia", "serif"]
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at top left, rgba(216, 200, 162, 0.38), transparent 28%), radial-gradient(circle at 80% 10%, rgba(13, 107, 99, 0.16), transparent 24%), linear-gradient(135deg, rgba(251, 247, 239, 0.98), rgba(238, 245, 243, 0.96))"
      }
    }
  },
  plugins: []
};

export default config;

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 基於Figma設計的配色方案
        primary: {
          50: '#fcfaf7',    // rgba(252,250,247,1) - 主背景色
          100: '#f9f9f9',   // rgba(249,249,249,1) - 卡片背景
          200: '#f4efe5',   // rgba(244,239,229,1) - 按鈕背景
          300: '#ede4d3',   // 按鈕hover狀態
          400: '#c4ae87',   // 中間色調
          500: '#b3996b',   // 中間色調
          600: '#9e8747',   // rgba(158,135,71,1) - 金棕色
          700: '#8c7c59',   // rgba(140,124,89,1) - 次要金棕色
          800: '#1c160f',   // rgba(28,22,12,1) - 深棕色文字
          900: '#19160f',   // rgba(25,22,15,1) - 最深棕色文字
        },
        // 保留一些功能性顏色
        success: {
          500: '#22c55e',
          600: '#16a34a',
        },
        warning: {
          500: '#f59e0b',
          600: '#d97706',
        },
        // 外在驅動型配色 - 深藍+活力橙
        competitive: {
          blue: {
            50: '#eff6ff',
            500: '#3b82f6',
            700: '#1d4ed8',
          },
          orange: {
            50: '#fff7ed',
            500: '#f97316',
            600: '#ea580c',
          }
        }
      },
      fontFamily: {
        'lexend': ['Lexend', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
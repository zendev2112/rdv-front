import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    '*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
            screens: {
        'xl': '1280px',    // When sidelines appear
        '2xl': '1600px',   // Wider sidelines on very large screens
      },
      maxWidth: {
        'content': '1200px', // Main content max width
      },
      colors: {
        // Our custom colors
        cream: '#faf6ef',
        'primary-red': '#ff0808',
        'dark-gray': '#292929',
        politics: '#0a3d62',
        business: '#2c6e49',
        opinion: '#5e3b73',
        sports: '#e67e22',
        lifestyle: '#2a9d8f',
        tech: '#3498db',
        agro: '#558b2f',
      },
      borderColor: {
        DEFAULT: '#e5e5e5',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

export default config

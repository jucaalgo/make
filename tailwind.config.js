/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                make: {
                    purple: '#6e44ff',
                    dark: '#1a1a2e',
                    panel: '#16213e',
                    card: '#0f3460'
                }
            }
        },
    },
    plugins: [],
}

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
                },
                app: {
                    sheets: '#10b981', // Emerald 500
                    telegram: '#0ea5e9', // Sky 500
                    google: '#f59e0b', // Amber 500
                    openai: '#10a37f',
                    webhook: '#ef4444', // Red 500
                    default: '#6366f1' // Indigo 500
                }
            }
        },
    },
    plugins: [],
}

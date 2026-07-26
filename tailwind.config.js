/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Amazigh heritage palette.
                // indigo  — the dye of the "blue people" of the Sahara; primary brand
                // saffron — spice/sun tones; accent and highlights
                // clay    — terracotta of Atlas earthen architecture; secondary accent
                // sand    — warm paper neutral for light surfaces
                // night   — warm-shifted charcoal for dark surfaces
                indigo: {
                    50: '#EEF1F8',
                    100: '#D6DCEC',
                    200: '#AEBAD9',
                    300: '#8394C4',
                    400: '#4F6293',
                    500: '#3F5189',
                    600: '#2B3A67',
                    700: '#223052',
                    800: '#1A2440',
                    900: '#131A2E',
                    950: '#0C1120',
                },
                saffron: {
                    50: '#FEF7EC',
                    100: '#FCEACB',
                    200: '#F8D294',
                    300: '#F2B95E',
                    400: '#E8A33D',
                    500: '#D98A22',
                    600: '#A25D14',
                    700: '#945318',
                    800: '#78421A',
                    900: '#63371A',
                },
                clay: {
                    50: '#FDF4F0',
                    100: '#F7E8E0',
                    200: '#EFCDBD',
                    300: '#E2A98F',
                    400: '#D28560',
                    500: '#C1663F',
                    600: '#A64F30',
                    700: '#883E29',
                    800: '#6F3426',
                    900: '#5C2E23',
                },
                sand: {
                    50: '#FDFCF9',
                    100: '#F9F6EF',
                    200: '#F5F1E8',
                    300: '#EAE3D4',
                    400: '#D9CFBA',
                    500: '#C2B49A',
                },
                night: {
                    700: '#242430',
                    800: '#1A1A24',
                    900: '#12121A',
                    950: '#0A0A0F',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['"Fraunces"', 'Georgia', 'serif'],
                tifinagh: ['"Noto Sans Tifinagh"', 'sans-serif'],
            },
            boxShadow: {
                panel: '0 1px 2px rgba(19, 26, 46, 0.04), 0 8px 24px -8px rgba(19, 26, 46, 0.10)',
                'panel-lg': '0 2px 4px rgba(19, 26, 46, 0.05), 0 16px 40px -12px rgba(19, 26, 46, 0.16)',
            },
        },
    },
    plugins: [],
}

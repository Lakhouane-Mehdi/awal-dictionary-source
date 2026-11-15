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
                // indigo — the dye of the "blue people" of the Sahara; primary brand
                // accent — the green of the Amazigh flag; highlights and links
                // ruby   — the red of the yaz on the flag; secondary accent
                // sand   — clean cool whites for light surfaces
                // No orange anywhere: the owner does not want it in the design.
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
                accent: {
                    50: '#EFF8EE',
                    100: '#D9F0D6',
                    200: '#B4E0AE',
                    300: '#85CC7D',
                    400: '#56B54D',
                    500: '#3A9F34',
                    600: '#2E8329',
                    700: '#276A24',
                    800: '#22551F',
                    900: '#1D451B',
                },
                ruby: {
                    50: '#FDF0EF',
                    100: '#FADBD9',
                    200: '#F4B5B1',
                    300: '#EC8781',
                    400: '#E4554D',
                    500: '#E2231A',
                    600: '#B91C14',
                    700: '#961811',
                    800: '#76150F',
                    900: '#5E130E',
                },
                sand: {
                    50: '#FFFFFF',
                    100: '#F8F9FC',
                    200: '#F1F3F8',
                    300: '#E3E7F0',
                    400: '#CBD2E1',
                    500: '#A7B1C7',
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

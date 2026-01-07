module.exports = {
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#f3f8ff',
                    100: '#dbeeff',
                    200: '#b7ddff',
                    300: '#87c9ff',
                    400: '#4daeff',
                    500: '#1e90ff',
                    600: '#1a78e6',
                    700: '#1459b3',
                    800: '#0f3d80',
                    900: '#09284d'
                }
            },
            boxShadow: {
                'soft-lg': '0 10px 30px rgba(15, 41, 77, 0.12), 0 2px 8px rgba(15, 41, 77, 0.06)'
            },
            backdropBlur: {
                xs: '2px'
            }
        },
    },
    plugins: [],
}

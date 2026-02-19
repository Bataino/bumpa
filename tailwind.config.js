/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],
    theme: {
        extend: {
            fontFamily: {
                display: ['"Space Grotesk"', 'sans-serif'],
                body: ['"Inter"', 'sans-serif'],
            },
        },
    },
    plugins: [],
};

/** @type {import("prettier").Config} */
const config = {
  plugins: ["prettier-plugin-tailwindcss"], // important: string, not require()
  singleQuote: true,
  semi: true,
};

export default config;
import config from "@jgarber/eslint-config";

export default [
  { ignores: ["coverage", "dist"] },
  ...config,
  {
    files: ["src/*.js"],
    languageOptions: {
      globals: {
        window: "readonly",
      },
    },
  },
  {
    files: ["test/*.js"],
    rules: {
      "regexp/no-super-linear-backtracking": "off",
    },
  },
];

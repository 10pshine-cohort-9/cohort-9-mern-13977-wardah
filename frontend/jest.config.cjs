module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  transform: {
    "^.+\\.(js|jsx)$": [
      "babel-jest",
      {
        presets: [
          [
            "@babel/preset-env",
            { targets: { node: "current" }, modules: "commonjs" },
          ],
          ["@babel/preset-react", { runtime: "automatic" }],
        ],
        plugins: ["babel-plugin-transform-vite-meta-env"],
      },
    ],
  },
  transformIgnorePatterns: ["/node_modules/"],
};

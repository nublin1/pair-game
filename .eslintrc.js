module.exports = {
  extends: ["eslint:recommended"],
  env: {
    browser: true,
    node: true,
  },
  parser: "babel-eslint",
  rules: {
    "no-alert": 0,
    "no-param-reassign": [2, { props: false }],
    "no-plusplus": 0,
    "no-iterator": 0,
    "no-restricted-syntax": [2, "WithStatement"],
    "func-style": 0,
  },
  "ignorePatterns": ["src/**/*.test.ts", "src/frontend/generated/*"]
};

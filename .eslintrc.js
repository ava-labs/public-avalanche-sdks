module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `@avalabs/eslint`
  extends: ['@avalabs/eslint'],
  settings: {
    next: {
      rootDir: ['packages/*/'],
    },
  },
};

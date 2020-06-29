module.exports = {
  root: true,
  extends: '@react-native-community',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    "no-undef": "off",
    "no-alert": "off",
    "react-hooks/exhaustive-deps": "off",
    "react-native/no-inline-styles": "off"
  }
};

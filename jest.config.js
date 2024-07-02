module.exports = {
  preset: "react-native",
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  moduleNameMapper: {
    "^react-native$": "react-native-web",
  },
  setupFilesAfterEnv: ["<rootDir>/setupTests.js"],
};

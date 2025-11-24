module.exports = {
  testEnvironment: "node",
  moduleFileExtensions: ["js"],
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  testMatch: ["**/__tests__/**/*.test.js"],
  setupFilesAfterEnv: ["<rootDir>/__tests__/setup.js"],

  collectCoverageFrom: [
    "src/**/*.js",
    "!src/init.js",
  ],

  moduleNameMapper: {
    "^phaser$": "<rootDir>/__tests__/mocks/phaserMock.js",
    "\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/__tests__/mocks/fileMock.js",
  },
};

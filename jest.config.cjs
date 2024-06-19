module.exports = {
  testEnvironment: "node",
  clearMocks: true,
  coverageDirectory: "coverage",
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  setupFiles: ["./jest.setup.js"],
};

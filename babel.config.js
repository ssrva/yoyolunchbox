module.exports = function(api) {
  api.cache(true);
  const plugins = [
    ['react-native-reanimated/plugin', {}],
    [
      "module-resolver",
      {
        "root": ["./src"],
        "alias": {
          "api": "./api",
          "store": "./store",
          "yoyoconstants": "./constants"
        }
      }
    ]
  ];
  return {
    presets: ['babel-preset-expo'],
    plugins: plugins,
  };
};

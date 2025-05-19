// // const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Добавляем поддержку Lottie
config.resolver.assetExts.push('lottie');

// Настраиваем поддержку SVG
config.transformer = {
	...config.transformer,
	babelTransformerPath: require.resolve('react-native-svg-transformer'),
};

config.resolver = {
	...config.resolver,
	assetExts: config.resolver.assetExts.filter((ext) => ext !== 'svg'),
	sourceExts: [...config.resolver.sourceExts, 'svg'],
};

module.exports = config;




// // const path = require("path");
// // const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");

// // const defaultConfig = getDefaultConfig(__dirname);
// // const { resolver: { sourceExts, assetExts } } = defaultConfig;

// // /**
// //  * Metro configuration
// //  * https://facebook.github.io/metro/docs/configuration
// //  *
// //  * @type {import('metro-config').MetroConfig}
// //  */
// // const config = {
// //   transformer: {
// //     babelTransformerPath: require.resolve("react-native-svg-transformer"),
// //   },
// //   resolver: {
// //     assetExts: assetExts.filter((ext) => ext !== "svg"),
// //     sourceExts: [...sourceExts, "svg"],
// //     resolverMainFields: ["sbmodern", "react-native", "browser", "main"],
// //   },
// //   watchFolders: [path.resolve(__dirname, "../")],
// // };

// // module.exports = mergeConfig(defaultConfig, config);
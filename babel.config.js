module.exports = function (api) {
	api.cache(true)
	return {
		presets: ['babel-preset-expo'],
		plugins: [
			// Required for expo-router
			'react-native-reanimated/plugin',
			[
				'module-resolver',
				{
					root: ['.'],
					alias: {
						'@': './',
						'@app': './app',
						'@processes': './processes',
						'@widgets': './widgets',
						'@features': './features',
						'@entities': './entities',
						'@shared': './shared',
					},
				},
			],
		],
	}
}

import Colors from '@/constants/Colors'
import useFetchDeckSvg from '@/features/hooks/useFetchDeckSvg'
import Loader from '@/modules/Loader'
import { Link } from 'expo-router'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SvgXml } from 'react-native-svg'

interface DeckInfoProps {
	title: string | undefined
	id: string | number
	imageId: string
}

const DeckInfo: React.FC<DeckInfoProps> = ({ title, id, imageId }) => {
	const { t } = useTranslation()
	const { svgData, isLoadingImage, error: errorSvg } = useFetchDeckSvg(imageId)

	return (
		<View style={styles.commonInformaion}>
			{isLoadingImage ? (
				<Loader />
			) : svgData ? (
				<View style={{ position: 'absolute', bottom: 95 }}>
					<SvgXml xml={svgData} width={83} height={70} />
				</View>
			) : (
				<Text>SVG not available</Text>
			)}

			<View style={{ width: '100%', position: 'absolute', bottom: 52 }}>
				<Text numberOfLines={1} style={styles.text}>
					{title?.toLowerCase()}
				</Text>
			</View>
			<Link href={`/decks/${id}`} asChild>
				<TouchableOpacity style={styles.button}>
					<Text style={{ color: 'white', fontSize: 16, marginBottom: 5 }}>
						{t('play')}
					</Text>
				</TouchableOpacity>
			</Link>
		</View>
	)
}

const styles = StyleSheet.create({
	commonInformaion: {
		flex: 1,
		zIndex: 100,
		height: '100%',

		flexDirection: 'column',
		justifyContent: 'center',

		alignItems: 'center'
	},
	text: {
		bottom: 0,
		textAlign: 'center',
		color: Colors.deepGray,
		fontSize: 16,
		fontWeight: 'bold'
	},
	button: {
		position: 'absolute',
		justifyContent: 'center',
		alignItems: 'center',
		height: 32,
		width: 86,
		backgroundColor: Colors.orange,
		borderRadius: 24.5,
		bottom: 0
	}
})

export default DeckInfo

import Colors from '@/constants/Colors'
import Loader from '@/modules/Loader'
import { IDeck } from '@/services/types/types'
import { AntDesign } from '@expo/vector-icons'
import {
	ImageSourcePropType,
	StyleSheet,
	Text,
	TouchableOpacity,
	View
} from 'react-native'
import { SvgXml } from 'react-native-svg'
interface TopContentProps {
	goBack: () => void
	imgSource?: ImageSourcePropType
	selectedDeck: IDeck | undefined
	svgData: string
	isLoadingImage: boolean
}

export const DeckTopContent: React.FC<TopContentProps> = ({
	goBack,
	imgSource,
	selectedDeck,
	svgData,
	isLoadingImage
}) => {
	const styles = StyleSheet.create({
		topContent: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center'
		},
		deckProgress: {
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center'
		},
		text: {
			color: Colors.deepGray,
			fontSize: 16,
			fontWeight: 'bold'
		},
		img: {
			height: 32,
			width: 32
		}
	})

	return (
		<View style={styles.topContent}>
			<View style={styles.deckProgress}>
				{isLoadingImage ? (
					<Loader />
				) : svgData ? (
					<View>
						<SvgXml xml={svgData} width={24} height={24} />
					</View>
				) : (
					<Text>SVG not available</Text>
				)}
			</View>
			<Text style={styles.text}>{selectedDeck?.name.toLowerCase()}</Text>
			<TouchableOpacity onPress={goBack}>
				<AntDesign name='close' size={30} color={Colors.primary} />
			</TouchableOpacity>
		</View>
	)
}

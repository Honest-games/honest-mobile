import Colors from '@/constants/Colors'
import { AntDesign } from '@expo/vector-icons'
import {
	Image,
	ImageSourcePropType,
	StyleSheet,
	Text,
	TouchableOpacity,
	View
} from 'react-native'
interface TopContentProps {
	goBack: () => void
	imgSource: ImageSourcePropType
}

export const DeckTopContent: React.FC<TopContentProps> = ({
	goBack,
	imgSource
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
				<Image source={imgSource} style={styles.img} />
			</View>
			<Text style={styles.text}>lets be friends</Text>
			<TouchableOpacity onPress={goBack}>
				<AntDesign name='close' size={30} color={Colors.primary} />
			</TouchableOpacity>
		</View>
	)
}

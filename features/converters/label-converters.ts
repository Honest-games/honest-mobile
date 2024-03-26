import Colors from '@/constants/Colors'

export interface ILabelColor {
	labelColor: string
}
export function getLabelColor(inputText: string) {
	let labelColor

	switch (inputText) {
		case 'besties':
			labelColor = Colors.dimGreen
			break
		case 'good to start':
			labelColor = Colors.dimBlue
			break
		case 'couples':
			labelColor = Colors.dimOrange
			break
		case 'friends':
			labelColor = Colors.dimBrown
			break
		case 'party':
			labelColor = Colors.dimBrown
			break
		default:
			labelColor = Colors.dimBlue
	}

	return labelColor
}

export default getLabelColor

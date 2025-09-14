import Colors from '@/shared/config/styles/colors'

export interface ILabelColor {
	labelColor: string
}
export function getLabelColor(inputText: string) {
	let labelColor

	switch (inputText) {
		case 'besties':
			labelColor = Colors.green
			break
		case 'good to start':
			labelColor = Colors.deepBlue
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
			labelColor = Colors.lightGreen
	}

	return labelColor
}

export default getLabelColor

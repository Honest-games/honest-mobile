import Colors from '@/constants/Colors'

export interface IQuestonLevelAndColor {
	levelTitle: string
	levelBgColor: string
}
export function getQuestionLevelAndColor(inputText: string) {
	let levelTitle, levelBgColor

	switch (inputText) {
		case '🙂 Знакомство':
		case '🙂 Dots':
		case 'light':
			levelTitle = 'light'
			levelBgColor = Colors.darkOrange
			break
		case '😏 Погружение':
		case '😏 Parallels':
		case 'medium':
		case 'Лайт':
			levelTitle = 'medium'
			levelBgColor = Colors.deepBlue
			break
		case '😌 Рефлексия':
		case '😌 Figures':
		case 'deep':
		case 'Глубина':
			levelTitle = 'deep'
			levelBgColor = Colors.green
			break
		default:
			levelTitle = inputText
			levelBgColor = Colors.deepBlue
	}

	return { levelTitle, levelBgColor }
}

export default getQuestionLevelAndColor

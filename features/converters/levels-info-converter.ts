export interface ILevelsInfo {
	labelsCount: number
}
export function getLevelsInfo(labelsCount: number) {
	let levelsInfoString = ''

	switch (labelsCount) {
		case 1:
			levelsInfoString = 'levelInfoOne'
			break
		case 2:
			levelsInfoString = 'levelInfoTwo'
			break
		case 3:
			levelsInfoString = 'levelInfoThree'
			break
		case 0:
			levelsInfoString = 'levelInfoEmpty'
			break
		default:
			levelsInfoString = 'levelInfoEmpty'
	}

	return levelsInfoString
}

export default getLevelsInfo

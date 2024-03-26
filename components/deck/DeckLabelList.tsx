import getLabelColor from '@/features/converters/label-converters'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { CustomLabel } from '../../UI/CustomLabel'

interface LabelListProps {
	labels: any
}

const LabelList: React.FC<LabelListProps> = ({ labels }) => {
	return (
		<View style={styles.deckLabels}>
			{labels.map((label: string, index: number) => (
				<CustomLabel labelColor={getLabelColor(label)} key={index}>
					{label}
				</CustomLabel>
			))}
		</View>
	)
}
const styles = StyleSheet.create({
	deckLabels: {
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		gap: 8
	}
})
export default LabelList

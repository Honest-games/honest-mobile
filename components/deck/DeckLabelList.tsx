import getLabelColor from '@/features/converters/label-converters'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { CustomLabel } from '../../UI/CustomLabel'

interface LabelListProps {
	labels: { id: number; title: string }[]
}

const LabelList: React.FC<LabelListProps> = ({ labels }) => {
	return (
		<View style={styles.deckLabels}>
			{labels.map(label => (
				<CustomLabel labelColor={getLabelColor(label.title)} key={label.id}>
					{label.title}
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

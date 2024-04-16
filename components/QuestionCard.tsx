import CardTopContent from "./card/CardTopContent";
import CardText from "./card/CardText";
import Colors from "@/constants/Colors";
import CardLikeButton from "./card/CardLikeButton";
import {StyleSheet, Text, View} from "react-native";
import React from "react";
import {IQuestonLevelAndColor} from "@/features/converters/button-converters";
import {IQuestion} from "@/services/types/types";
import {useTranslation} from "react-i18next";

interface QuestionCardProps {
    buttonState?: IQuestonLevelAndColor
    question: IQuestion
}

const QuestionCard = (props: QuestionCardProps)=>{
    const { buttonState, question } = props
    const {t} = useTranslation()
    return <View style={styles.questionCardWrapper}>
        {(
            <>
                <CardTopContent level={buttonState} />
                <View style={{ alignItems: 'center', flexDirection: 'column', gap: 22 }}>
                    {question.additional_text && (
                        <Text style={styles.additionalText}>{t(question.additional_text)}</Text>
                    )}
                    <Text style={{...styles.cardText, color: buttonState ? buttonState?.levelBgColor : Colors.deepBlue}}>
                        {t(question?.text)}</Text>
                </View>
                <CardLikeButton
                    level={buttonState}
                    handleLike={()=>{}}
                    isLiked={false}
                />
            </>
        )}
    </View>
}

export default QuestionCard;

export const TakeFirstCard = ()=>{
    const {t} = useTranslation()
    return (
			<View style={{...styles.questionCardWrapper, ...styles.takeFirstCardWrapper}}>
						<Text style={{ ...styles.cardText, ...styles.takeFirstCardText }}>
							{t('firstCard')}
						</Text>
			</View>
		)
}

const styles = StyleSheet.create({
    questionCardWrapper: {
        flex: 1,
        margin: 0,
        zIndex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        borderRadius: 20,
        padding: 16,
        backgroundColor: Colors.beige
    },
    takeFirstCardWrapper: {
        justifyContent: 'center',
    },
    cardText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    takeFirstCardText: {
        fontSize: 25,
        color: Colors.deepBlue
    },
    additionalText: {
        fontSize: 16,
        textAlign: 'center',
        color: Colors.grey1
    }
})

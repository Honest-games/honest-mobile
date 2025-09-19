import { IDisplayedCard } from "@/entities/card/ui";
import Colors from "@/shared/config/styles/colors";
import { getLevelColor } from "@/features/converters/button-converters";
import { useAppDispatch, useAppSelector } from "@/features/hooks/useRedux";
import { useDislikeQuestionMutation, useLikeQuestionMutation } from "@/features/question-likes";
import { IQuestion } from "@/services/types/types";
import { addQuestionId, removeQuestionId } from "@/features/question-likes/model";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { useUserId } from "@/features/hooks";
import { Loader } from "@/shared/ui/loader";
import * as Haptics from "expo-haptics";
import { CardTopContent, CardTopBackground } from "@/entities/card/ui";
import { CardLikeButton } from "@/features/card-likes/ui/card-like-button";
import useFetchDeckSvg from "@/features/hooks/useFetchDeckSvg";
import { Svg, SvgXml } from "react-native-svg";
import useGoBack from "@/features/hooks/useGoBack";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { TouchableOpacity } from "react-native";
import Octicons from '@expo/vector-icons/Octicons';

interface QuestionCardProps {
  displayData: IDisplayedCard;
  question?: IQuestion;
  isFetchingQuestion?: boolean;
  questionId?: string;
}

export const QuestionCard: React.FC<QuestionCardProps> = (props) => {
  const { displayData, question, isFetchingQuestion, questionId } = props;
  const dispatch = useAppDispatch();
  const questionsLikesSet: Set<any> = useAppSelector((state) => state.questionsLikes.questionsLikesSet);

  const [like, setLike] = useState<boolean>(false);

  useEffect(() => {
    if (!isFetchingQuestion && questionId && questionsLikesSet && typeof questionsLikesSet.has === "function") {
      setLike(!!questionsLikesSet.has(questionId));
    }
  }, [isFetchingQuestion, questionId, questionsLikesSet]);

  const userId = useUserId();
  const [likeQuestion] = useLikeQuestionMutation();
  const [dislikeQuestion] = useDislikeQuestionMutation();
  const { goBack } = useGoBack();

  const { svgData, isLoadingImage } = useFetchDeckSvg(displayData.level?.cardBackgroundImageId || "");
  const isValidSvg = typeof svgData === "string" && svgData.trim().toLowerCase().startsWith("<svg");

  const handleLike = async () => {
    try {
      if (questionsLikesSet && questionsLikesSet instanceof Set && questionId) {
        if (questionsLikesSet.has(questionId)) {
          await dislikeQuestion({ questionId, userId });
          dispatch(removeQuestionId(questionId));
        } else {
          await likeQuestion({ questionId, userId });
          dispatch(addQuestionId(questionId));
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      } else {
        console.error("questionsLikesSet is not a valid Set instance or questionId is undefined");
      }
    } catch (e) {
      console.error("Error handling like:", e);
    }
  };

  if (displayData.customText) {
    return (
      <View style={{ ...styles.questionCardWrapper, ...styles.takeFirstCardWrapper }}>
        <Text style={{ ...styles.cardText, ...styles.takeFirstCardText }}>{displayData.customText}</Text>
      </View>
    );
  }

  const color = displayData.level ? getLevelColor(displayData.level.color) : undefined;
  const hasBackgroundImage = displayData.level?.cardBackgroundImageId && isValidSvg && svgData && !isLoadingImage;

  const cardWrapperStyle = hasBackgroundImage
    ? { ...styles.questionCardWrapper, backgroundColor: "transparent" }
    : styles.questionCardWrapper;

  const textColor = hasBackgroundImage ? "#FFFFFF" : color;

  return (
    <View style={cardWrapperStyle}>
      {hasBackgroundImage && (
        <View style={[StyleSheet.absoluteFillObject, { borderRadius: 25, overflow: "hidden" }]}>
          <SvgXml xml={svgData} width="100%" height="100%" preserveAspectRatio="none" opacity={1} style={StyleSheet.absoluteFillObject} />
        </View>
      )}
      {displayData.shouldShowLevelOnCard && displayData.level && (
        hasBackgroundImage ? (
          <CardTopBackground level={displayData.level} />
        ) : (
          <CardTopContent level={displayData.level} />
        )
      )}
      <View style={styles.cardTextsWrapper}>
        {question ? (
          <>
            {question.additional_text && (
              <View style={styles.cardAdditionalTextWrapper}>
                <Text style={[styles.additionalText, { color: hasBackgroundImage ? "#FFFFFF" : Colors.grey1 }]}>
                  {question.additional_text}
                </Text>
              </View>
            )}
            <View style={styles.cardMainTextWrapper}>
              <Text style={{ ...styles.cardText, color: textColor }}>{question.text}</Text>
            </View>
          </>
        ) : (
          <Loader />
        )}
      </View>
      {displayData.level &&
        (hasBackgroundImage ? (
          <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={goBack} style={styles.backButton}>
              <Octicons name="undo" size={20} color={Colors.deepBlue} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLike} style={styles.likeButton}>
              <FontAwesome name={like ? "heart" : "heart-o"} size={20} color={Colors.deepBlue} />
            </TouchableOpacity>
          </View>
        ) : (
          <CardLikeButton color={color || Colors.white} handleLike={handleLike} isLiked={like} />
        ))}
    </View>
  );
};

export const TakeFirstCard: React.FC = () => {
  const { t } = useTranslation();
  return (
    <View style={{ ...styles.questionCardWrapper, ...styles.takeFirstCardWrapper }}>
      <Text style={{ ...styles.cardText, ...styles.takeFirstCardText }}>{t("firstCard")}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  questionCardWrapper: {
    flex: 1,
    margin: 0,
    zIndex: 1,
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    height: "100%",
    borderRadius: 20,
    padding: 16,
    backgroundColor: Colors.beige,
  },
  takeFirstCardWrapper: {
    justifyContent: "center",
  },
  cardTextsWrapper: {
    flexDirection: "column",
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cardAdditionalTextWrapper: {},
  cardMainTextWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
  },
  cardText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  takeFirstCardText: {
    fontSize: 25,
    color: Colors.deepBlue,
  },
  additionalText: {
    fontSize: 16,
    textAlign: "center",
    color: Colors.grey1,
  },
  buttonsContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
    flexDirection: "row",
    backgroundColor: Colors.white,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    // shadowColor: '#000',
    // shadowOffset: {
    // 	width: 0,
    // 	height: 2,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 3.84,
    // elevation: 5,
  },
  backButton: {
    padding: 8,
    backgroundColor: Colors.lightBeige,
    borderRadius: "50%",
  },
  likeButton: {
    marginLeft: 4,
    padding: 8,
    backgroundColor: Colors.lightBeige,
    borderRadius: "50%",
  },
});

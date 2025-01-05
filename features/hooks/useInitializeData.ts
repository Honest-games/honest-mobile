import { useEffect } from "react";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";
import { useDeck, useUserId } from "@/features/hooks";
import { IDeck } from "@/services/types/types";
import { useAppDispatch } from "./useRedux";
import { useGetAllLikesQuery } from "@/services/api";
import { setDecksLikesSet } from "@/store/reducer/deck-likes-slice";
import { setQuestionsLikesSet } from "@/store/reducer/question-like-slice";

interface UseInitializeDataProps {
  onDataReady: () => void;
  locale: string;
}

const useInitializeData = ({ onDataReady, locale }: UseInitializeDataProps) => {
  const userId = useUserId();
  const dispatch = useAppDispatch();
  const { decks, isLoadingDecks, isFetchingDecks } = useDeck(userId);
  const { data: likes, isFetching: isFetchingLikes } = useGetAllLikesQuery(userId);

  useEffect(() => {
    const initialize = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("user_id");
        if (!storedUserId) {
          const newUserId = uuid.v4();
          await AsyncStorage.setItem("user_id", newUserId.toString());
        }
      } catch (error) {
        console.error("Ошибка при инициализации UUID:", error);
      }
    };
    initialize();
  }, []);

  useEffect(() => {
    if (likes) {
      if (likes.decks) dispatch(setDecksLikesSet(likes.decks));
      if (likes.questions) dispatch(setQuestionsLikesSet(likes.questions));
    }
  }, [likes, dispatch]);

  useEffect(() => {
    if (!isLoadingDecks && !isFetchingDecks && !isFetchingLikes) {
      onDataReady();
    }
  }, [isLoadingDecks, isFetchingDecks, isFetchingLikes, onDataReady]);
};

export default useInitializeData;

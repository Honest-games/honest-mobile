if (__DEV__) {
	require('../ReactotronConfig')
}
import { AnimateSplashScreen } from "@/components/screens";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import * as Localization from "expo-localization";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import uuid from "react-native-uuid";
import { Provider } from "react-redux";
import "../constants/i18n/i18n.config";
import store from "../store/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { setSplashAnimationFinished } from "@/store/reducer/splash-animation-slice";
import { useAppDispatch, useAppSelector } from "@/features/hooks/useRedux";
import { setUserId } from "@/store/reducer/user-slice";
import { useDeck } from "@/features/hooks";
import { useGetAllLikesQuery } from "@/services/api";
import { setContentReady } from "@/store/reducer/app-slice";
import { setDecks } from "@/store/reducer/deck-slice";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

function AppContent() {
  const isContentReady = useAppSelector((state) => state.app.isContentReady);
  const splashAnimationFinished = useAppSelector((state) => state.splash.splashAnimationFinished);
  const userId = useAppSelector((state) => state.user.userId); // Из Redux

  const dispatch = useAppDispatch();
  const [appReady, setAppReady] = useState(false);
  const router = useRouter();
  let [locale, setLocale] = useState<string>(Localization.getLocales()[0].languageCode || "ru");
  const { decks, isLoadingDecks, isFetchingDecks, refetch: refetchDecks } = useDeck(userId || "");
  const { data: likes, isFetching: isFetchingLikes } = useGetAllLikesQuery(userId);
  useEffect(() => {
    const loadInitialData = async () => {
      const deviceLanguage = locale;
      try {
        await AsyncStorage.setItem("language", deviceLanguage);
      } catch (e) {
        console.error("Ошибка при сохранении языка в AsyncStorage:", e);
      }

      const user = await AsyncStorage.getItem("user_id");
      if (!user) {
        try {
          const id = uuid.v4();
          dispatch(setUserId(id.toString()));
          await AsyncStorage.setItem("user_id", id.toString());
          console.log("UUID успешно сохранен:", id);
        } catch (error) {
          console.error("Ошибка при сохранении UUID в AsyncStorage:", error);
        }
      } else {
        console.log("UUID успешно получен:", user);
      }

      setAppReady(true);
    };

    loadInitialData();
  }, [locale]);
  
  useEffect(() => {
    if (!isLoadingDecks && !isFetchingDecks && !isFetchingLikes) {
      dispatch(setContentReady(true));
    }
  }, [isLoadingDecks, isFetchingDecks, isFetchingLikes]);

  useEffect(() => {
    if (decks) {
      dispatch(setDecks(decks));
    }
  }, [decks, dispatch]);
  const showAnimatedSplash = !appReady || !splashAnimationFinished || !isContentReady;

  if (showAnimatedSplash) {
    return (
      <AnimateSplashScreen
        onAnimationFinish={(isCancelled) => {
          if (!isCancelled) {
            dispatch(setSplashAnimationFinished(true));
          }
        }}
      />
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="decks/[id]" options={{ headerShown: false }} />
        </Stack>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontsError] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });
  const query = new QueryClient();

  useEffect(() => {
    if (fontsError) throw fontsError;
  }, [fontsError]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <QueryClientProvider client={query}>
        <AppContent />
      </QueryClientProvider>
    </Provider>
  );
}

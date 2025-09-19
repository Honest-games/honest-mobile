// if (__DEV__) {
// 	require('../ReactotronConfig')
// }
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
import "../shared/config/i18n/i18n.config";
import store from "../shared/config/_providers/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProfileProvider } from "@shared/config/_providers/ProfileProvider";
import { useAppDispatch, useAppSelector } from "@/features/hooks/useRedux";
import { setUserId } from "@/entities/user/model/slice";
import { useDeck } from "@/features/hooks";
import { useGetAllLikesQuery } from "@/features/deck-likes";
import { setDecks } from "@/entities/deck/model/slice";
import { initializeProfile, updateProfile } from "@/entities/profile/model";
import { setSplashAnimationFinished } from "@/features/animation/model/slice";
import { setContentReady } from "@shared/config/app-slice";
import { AnimateSplashScreen } from "@/shared/ui/animations";
import { DevOnboardingControls, resetOnboarding } from "@/features/onboarding";
import { DEV_ONBOARDING_CONFIG } from "@/features/onboarding/config/dev-config";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

function AppContent() {
  const isContentReady = useAppSelector((state) => state.app.isContentReady);
  const splashAnimationFinished = useAppSelector((state) => state.splash.splashAnimationFinished);
  const userId = useAppSelector((state) => state.user.userId); // Из Redux
  const hasCompletedOnboarding = useAppSelector((state) => state.onboarding?.hasCompletedOnboarding ?? false);
  const hasSkippedOnboarding = useAppSelector((state) => state.onboarding?.hasSkippedOnboarding ?? false);
  const shouldShowOnboarding = !hasCompletedOnboarding && !hasSkippedOnboarding;

  const dispatch = useAppDispatch();
  const [appReady, setAppReady] = useState(false);
  const router = useRouter();
  let [locale, setLocale] = useState<string>(Localization.getLocales()[0].languageCode || "ru");
  const { decks, isLoadingDecks, isFetchingDecks, refetch: refetchDecks } = useDeck(userId || "", { skip: !userId });
  const { data: likes, isFetching: isFetchingLikes } = useGetAllLikesQuery(userId, { skip: !userId });

  useEffect(() => {
    dispatch(initializeProfile());

    // Auto-reset onboarding in development mode on app reload
    if (__DEV__ && DEV_ONBOARDING_CONFIG.AUTO_RESET_ON_RELOAD) {
      console.log('🔄 Auto-resetting onboarding for development...');
      dispatch(resetOnboarding());
    }
  }, [dispatch]);

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
          // console.log("UUID успешно сохранен:", id);

          dispatch(updateProfile({ id: id.toString() }));
        } catch (error) {
          console.error("Ошибка при сохранении UUID в AsyncStorage:", error);
        }
      } else {
        // console.log("UUID успешно получен:", user);
        dispatch(setUserId(user));
        dispatch(updateProfile({ id: user }));
      }

      setAppReady(true);
    };

    loadInitialData();
  }, [locale, dispatch]);

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

  // Redirect to onboarding if needed after splash screen
  useEffect(() => {
    if (appReady && splashAnimationFinished && shouldShowOnboarding) {
      router.replace('/onboarding');
    }
  }, [appReady, splashAnimationFinished, shouldShowOnboarding, router]);

  const showAnimatedSplash = !appReady || !splashAnimationFinished

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
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        </Stack>
        {/* {__DEV__ && DEV_ONBOARDING_CONFIG.SHOW_DEV_CONTROLS && <DevOnboardingControls />} */}
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontsError] = useFonts({
    Poppins: require("../assets/fonts/Poppins-Regular.ttf"),
    MakanHatiCyrillic: require("../assets/fonts/MakanHatiCyrillic.otf"),
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
        <ProfileProvider>
          <AppContent />
        </ProfileProvider>
      </QueryClientProvider>
    </Provider>
  );
}

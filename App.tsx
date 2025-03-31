import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { initializeI18n } from './constants/i18n/i18n.config';
import { setLanguage } from './store/reducer/language-slice';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAppDispatch } from './features/hooks/useRedux';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AppContent = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const setupLanguage = async () => {
      const initialLanguage = await initializeI18n();
      dispatch(setLanguage(initialLanguage));
    };
    setupLanguage();
  }, [dispatch]);

  return (
    <NavigationContainer>
      {/* Ваша навигация */}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
} 
import { PanResponder } from "react-native";
import {
  withTiming,
  withSpring,
  SharedValue,
} from "react-native-reanimated";

export const getPanResponder = (
  swipeX: SharedValue<number>,
  swipeY: SharedValue<number>,
  setUserSwipeState: (swiped: boolean) => void
) => PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, { dx, dy }) => {
        swipeX.value = dx;
        swipeY.value = dy;
    },

    onPanResponderRelease: (_, gestureState) => {
        const { dx, dy, vx, vy } = gestureState;
        let isActionActive = Math.abs(dx) > 150;
        if (isActionActive) {
            // Определяем, в какую сторону должен улетать элемент
            const direction = dx < 0 ? -1 : 1;
            const velocityX = Math.max(Math.abs(vx), 1) * direction; // Убедимся, что скорость не равна 0
            const duration = Math.abs(velocityX) * 100; // регулируем длительность анимации на основе скорости

            // Start animation WITHOUT callbacks
            swipeX.value = withTiming(velocityX * 500, { duration });
            swipeY.value = withTiming(dy, { duration });

            // Notify about swipe completion via state change (safer than callback)
            setTimeout(() => {
                setUserSwipeState(true);
            }, duration + 50); // Small buffer after animation
        } else {
            // Если свайп не достиг активационной точки, плавно возвращаем карточку на место
            swipeX.value = withSpring(0, { stiffness: 100, damping: 10 });
            swipeY.value = withSpring(0, { stiffness: 100, damping: 10 });
        }
    }
}); 
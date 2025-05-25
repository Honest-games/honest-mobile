import { Animated, PanResponder } from "react-native";

export const getPanResponder = (swipe: Animated.ValueXY, onAnimationEnd: () => void) => PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, { dx, dy }) => {
        swipe.setValue({ x: dx, y: dy })
    },

    onPanResponderRelease: (_, gestureState) => {
        const { dx, dy, vx, vy } = gestureState
        let isActionActive = Math.abs(dx) > 150
        if (isActionActive) {
            // Определяем, в какую сторону должен улетать элемент
            const direction = dx < 0 ? -1 : 1
            const velocityX = Math.max(Math.abs(vx), 1) * direction // Убедимся, что скорость не равна 0

            Animated.timing(swipe, {
                toValue: { x: velocityX * 500, y: dy }, // используем скорость и направление
                useNativeDriver: true,
                duration: Math.abs(velocityX) * 100 // регулируем длительность анимации на основе скорости
            }).start(onAnimationEnd)
        } else {
            // Если свайп не достиг активационной точки, плавно возвращаем карточку на место
            Animated.spring(swipe, {
                toValue: { x: 0, y: 0 },
                useNativeDriver: true,
                friction: 5 // Можно отрегулировать фрикцию для более плавного возврата
            }).start()
        }
    }
}); 
// Accessibility constants for onboarding and general app use

export const ACCESSIBILITY_LABELS = {
  ONBOARDING: {
    PROGRESS_INDICATOR: 'Индикатор прогресса онбординга',
    NEXT_BUTTON: 'Следующий шаг',
    BACK_BUTTON: 'Предыдущий шаг',
    SKIP_BUTTON: 'Пропустить онбординг',
    COMPLETE_BUTTON: 'Завершить онбординг',
    STEP_COUNTER: (current: number, total: number) => `Шаг ${current} из ${total}`,
    SWIPE_HINT: 'Проведите влево для следующего шага, вправо для предыдущего'
  },
  BUTTONS: {
    PRIMARY: 'Основная кнопка',
    SECONDARY: 'Дополнительная кнопка',
    CLOSE: 'Закрыть',
    MENU: 'Меню'
  }
};

export const ACCESSIBILITY_HINTS = {
  ONBOARDING: {
    NAVIGATION: 'Используйте кнопки или жесты для навигации между экранами',
    PROGRESS: 'Показывает текущий прогресс прохождения онбординга',
    CONTENT: 'Информация о функциях приложения'
  }
};

export const ACCESSIBILITY_ROLES = {
  BUTTON: 'button',
  TEXT: 'text',
  IMAGE: 'image',
  PROGRESS_BAR: 'progressbar',
  TAB: 'tab',
  NAVIGATION: 'navigation'
} as const;

// Minimum touch target sizes (iOS HIG & Android Material Design)
export const TOUCH_TARGET_SIZES = {
  MINIMUM: 44, // iOS minimum
  RECOMMENDED: 48, // Material Design recommendation
  LARGE: 56
};

// Color contrast ratios for WCAG compliance
export const CONTRAST_RATIOS = {
  AA_NORMAL: 4.5,
  AA_LARGE: 3,
  AAA_NORMAL: 7,
  AAA_LARGE: 4.5
};
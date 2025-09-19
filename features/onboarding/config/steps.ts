import { OnboardingStep } from '../types';

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 1,
    title: 'Добро пожаловать в Честно!',
    subtitle: 'Социальная игра для глубокого общения',
    description: 'Откройте для себя новые грани друзей и близких через увлекательные вопросы разной глубины',
    illustration: 'welcome',
    primaryAction: 'Начать знакомство',
    secondaryAction: 'Пропустить'
  },
  {
    id: 2,
    title: 'Выберите тему для разговора',
    subtitle: 'Разнообразные колоды вопросов',
    description: 'От легких и веселых до глубоких и личных - найдите подходящую тему для любой компании',
    illustration: 'topics',
    primaryAction: 'Посмотреть темы',
    secondaryAction: 'Назад'
  },
  {
    id: 3,
    title: 'Три уровня глубины',
    subtitle: 'Контролируйте интимность беседы',
    description: 'Начните с легких вопросов и постепенно углубляйтесь в более личные темы',
    illustration: 'levels',
    primaryAction: 'Понятно',
    secondaryAction: 'Назад'
  },
  {
    id: 4,
    title: 'Как играть?',
    subtitle: 'Простые правила для глубоких разговоров',
    description: 'Выберите колоду, уровень глубины и наслаждайтесь честными ответами друг друга',
    illustration: 'gameplay',
    primaryAction: 'Попробовать',
    secondaryAction: 'Назад'
  },
  {
    id: 5,
    title: 'Развивайтесь вместе',
    subtitle: 'Открывайте новые достижения',
    description: 'Играйте регулярно, открывайте новые колоды и углубляйте отношения с близкими',
    illustration: 'achievements',
    primaryAction: 'Начать игру!',
    secondaryAction: 'Назад'
  }
];
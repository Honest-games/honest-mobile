# Feature-Sliced Design Architecture

## Статус миграции: ✅ ЗАВЕРШЕНО

Проект полностью мигрирован на архитектуру Feature-Sliced Design (FSD). Все компоненты, API и бизнес-логика распределены по соответствующим слоям.

## Текущая структура проекта

```
honest-mobile/
├── app/                    # ✅ Инициализация приложения, роутинг (expo-router)
│   ├── (tabs)/            # Табы навигации
│   ├── decks/             # Страницы колод
│   └── _layout.tsx        # Главный лейаут
├── pages/                  # ✅ Композитные страницы и модальные окна
│   └── deck-bottom-sheet/ # Модальное окно информации о колоде
├── widgets/                # ✅ Крупные UI-блоки
│   ├── deck-list/         # Список колод
│   ├── deck-info-sheet/   # Информационный блок колоды
│   ├── deck-with-levels/  # Колода с уровнями
│   ├── level-list/        # Список уровней
│   └── splash-screen/     # Экран загрузки
├── features/               # ✅ Пользовательская функциональность
│   ├── deck-likes/        # Лайки колод
│   ├── question-likes/    # Лайки вопросов
│   ├── card-likes/        # Лайки карточек
│   ├── deck-resume/       # Возобновление игры
│   ├── deck-shuffle/      # Перемешивание колод
│   ├── language/          # Управление языком
│   ├── converters/        # Конвертеры данных
│   ├── hooks/             # Переиспользуемые хуки
│   └── animations/        # Анимации
├── entities/               # ✅ Бизнес-сущности
│   ├── deck/              # Колоды
│   │   ├── api/           # API для работы с колодами
│   │   ├── model/         # Типы и состояние колод
│   │   └── ui/            # UI компоненты колод
│   ├── level/             # Уровни
│   │   ├── api/           # API для работы с уровнями
│   │   ├── model/         # Типы и состояние уровней
│   │   └── ui/            # UI компоненты уровней
│   ├── question/          # Вопросы
│   │   ├── api/           # API для работы с вопросами
│   │   ├── model/         # Типы вопросов
│   │   └── ui/            # UI компоненты вопросов
│   ├── user/              # Пользователь
│   │   ├── api/           # API пользователя (промокоды)
│   │   └── model/         # Типы пользователя
│   ├── card/              # Карточки
│   │   └── ui/            # UI компоненты карточек
│   ├── profile/           # Профиль пользователя
│   │   ├── model/         # Состояние профиля
│   │   └── ui/            # UI компоненты профиля
│   └── achievement/       # Достижения
│       ├── model/         # Типы достижений
│       └── ui/            # UI компоненты достижений
└── shared/                 # ✅ Переиспользуемый код
    ├── api/               # Базовая API конфигурация
    ├── config/            # Конфигурации, стили, i18n
    ├── lib/               # Вспомогательные библиотеки
    └── ui/                # Переиспользуемые UI компоненты
```

## Слои архитектуры

1. **app** - точка входа, роутинг expo-router, глобальные провайдеры
2. **pages** - модальные окна и композитные страницы
3. **widgets** - крупные UI-блоки, композиция фич и сущностей
4. **features** - пользовательская функциональность
5. **entities** - модели данных, API, базовые UI компоненты
6. **shared** - переиспользуемый код, утилиты, базовые UI компоненты

## API архитектура

Вся API архитектура переведена на единую базу:

```
shared/api/base-api.ts      # ✅ Единая базовая API (RTK Query)
├── entities/deck/api/      # API колод
├── entities/level/api/     # API уровней
├── entities/question/api/  # API вопросов
├── entities/user/api/      # API пользователя
├── features/deck-likes/api/     # API лайков колод
└── features/question-likes/api/ # API лайков вопросов
```

## Правила импортов

✅ Все импорты соответствуют FSD правилам:
- `app` → любой другой слой
- `pages` → `widgets`, `features`, `entities`, `shared`
- `widgets` → `features`, `entities`, `shared`
- `features` → `entities`, `shared`
- `entities` → `shared`
- `shared` → только внутри `shared`

## Алиасы

Используются стандартные алиасы:
- `@/` - корень проекта
- `@shared` - shared слой
- `@entities` - entities слой
- `@features` - features слой

## Примеры использования

```tsx
// ✅ Правильные импорты после миграции
import { Button } from '@shared/ui';
import { useGetDecksQuery } from '@entities/deck';
import { useLikeDeckMutation } from '@features/deck-likes';
import { DeckInfoSheet } from '@widgets/deck-info-sheet';

// ✅ API используется через единую базу
import { api } from '@shared/api';
```

## Миграция завершена

- ✅ Все компоненты перенесены в FSD структуру
- ✅ API полностью мигрирован на единую архитектуру
- ✅ Удалены старые директории (components/, UI/, services/api.ts)
- ✅ Исправлены все импорты и типы
- ✅ Сохранена функциональность приложения 
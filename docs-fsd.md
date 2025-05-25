# Feature-Sliced Design Architecture

## Обзор

Проект организован по принципам Feature-Sliced Design (FSD), который разделяет код на независимые слои и фичи.

## Структура проекта

```
src/
├── app/               # Инициализация приложения, глобальные провайдеры, конфигурация
├── processes/         # Крупные бизнес-процессы, объединяющие фичи
├── pages/             # Страницы приложения
├── widgets/           # Крупные UI-блоки, композиция фич и сущностей
├── features/          # Функциональность пользователя
│   ├── deck-likes/    # Функциональность лайков колод
│   ├── language/      # Управление языком
│   └── ...
├── entities/          # Бизнес-сущности
│   ├── deck/          # Сущность колоды
│   ├── level/         # Сущность уровня
│   ├── question/      # Сущность вопроса
│   └── ...
└── shared/            # Переиспользуемый код
    ├── api/           # Работа с API
    ├── config/        # Конфигурации
    ├── lib/           # Вспомогательные библиотеки
    └── ui/            # UI компоненты
```

## Слои архитектуры

1. **app** - точка входа в приложение, конфигурация, инициализация
2. **processes** - сложные бизнес-процессы (например, flow регистрации)
3. **pages** - страницы приложения, организуют виджеты
4. **widgets** - сборка фич и сущностей в крупные блоки
5. **features** - функциональность, доступная пользователю
6. **entities** - модели данных, бизнес-логика
7. **shared** - переиспользуемый код, утилиты, UI-компоненты

## Правила импортов

Слои могут импортировать только нижестоящие слои:
- `app` → любой другой слой
- `pages` → `widgets`, `features`, `entities`, `shared`
- `widgets` → `features`, `entities`, `shared`
- `features` → `entities`, `shared`
- `entities` → `shared`
- `shared` → только внутри `shared`

## Алиасы

Для упрощения импортов используются следующие алиасы:
- `@app` - src/app
- `@processes` - src/processes
- `@pages` - src/pages
- `@widgets` - src/widgets
- `@features` - src/features
- `@entities` - src/entities
- `@shared` - src/shared

## Примеры использования

```tsx
// Правильный импорт
import { Button } from '@shared/ui';
import { useGetDecksQuery } from '@entities/deck';
import { useLikeDeckMutation } from '@features/deck-likes';

// Неправильный импорт (нарушение слоев)
import { DeckCard } from '@widgets/deck-card'; // ❌ Нельзя импортировать из entities в features
``` 
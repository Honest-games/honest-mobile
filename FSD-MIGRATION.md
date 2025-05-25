# Миграция на Feature-Sliced Design (FSD)

## Что сделано

1. ✅ Настроена базовая FSD-структура проекта:
   - `app` - существующий каталог expo-router (не изменен)
   - `app/_providers` - для глобальных провайдеров и конфигурации приложения
   - `entities` - для бизнес-сущностей (deck, level, question, user, etc.)
   - `features` - для функционального кода (deck-likes, question-likes, language, etc.)
   - `widgets` - для композиционных компонентов (deck-list, profile-card, etc.)
   - `processes` - для крупных бизнес-процессов
   - `shared` - для переиспользуемого кода (ui, api, lib, config, etc.)

2. ✅ Настроены алиасы импортов:
   - `@app` → `./app`
   - `@entities` → `./entities`
   - `@features` → `./features`
   - `@widgets` → `./widgets`
   - `@processes` → `./processes`
   - `@shared` → `./shared`

3. ✅ Подготовлена базовая инфраструктура:
   - Провайдер Redux в `app/_providers`
   - Хуки для работы с Redux в `shared/lib/hooks`
   - API клиент в `shared/api`
   - Ключевые сущности и фичи в соответствующих директориях

## Что нужно сделать

### 1. Перенести UI компоненты 

- [x] UI/Switcher.tsx → shared/ui/switcher
- [x] UI/Label.tsx → shared/ui/label
- [x] UI/SearchBar.tsx → shared/ui/search-bar
- [x] UI/CustomLabel.tsx → shared/ui/custom-label
- [x] UI/LevelInfo.tsx → entities/level/ui или widgets/level-info
- [x] UI/DeckLikeButton.tsx → features/deck-likes/ui

### 2. Перенести компоненты из /components

- [x] components/deck/DeckInfo.tsx → entities/deck/ui/deck-info
- [x] components/deck/ShuffleDialog.tsx → features/deck-shuffle/ui/shuffle-dialog
- [x] components/deck/ResumeDeckDialog.tsx → features/deck-resume/ui/resume-dialog
- [x] components/deck/DeckLabelList.tsx → entities/deck/ui/deck-label-list
- [x] components/deck/DeckScrollView.tsx → entities/deck/ui/deck-scroll-view
- [x] components/deck/DeckTopContent.tsx → entities/deck/ui/deck-top-content
- [x] components/deck/DeckAdditionalButton.tsx → entities/deck/ui/deck-additional-button
- [x] components/card → entities/card/ui и features/card-likes/ui
- [x] components/train → features/training/ui
- [x] components/default → shared/ui
- [x] components/profile → entities/profile/ui или features/profile/ui
- [x] components/screens → widgets
- [x] components/achievements → entities/achievement/ui

### 3. Перенести модули

- [x] modules/Decks → widgets/deck-list

### 4. Перенести оставшиеся редьюсеры

- [x] store/reducer/levels-slice.ts → entities/level/model/slice.ts
- [x] store/reducer/profile-slice.ts → entities/profile/model/slice.ts
- [x] store/reducer/question-like-slice.ts → features/question-likes/model/slice.ts
- [x] store/reducer/splash-animation-slice.ts → features/animation/model/slice.ts
- [ ] store/reducer/user-slice.ts → entities/user/model/slice.ts
- [ ] store/reducer/app-slice.ts → app/_providers/model/slice.ts

### 5. Обновить импорты в основных файлах приложения

- [x] app/(tabs)/profile.tsx - обновлены импорты на новые пути согласно FSD
- [ ] app/(tabs)/index.tsx 
- [ ] app/(tabs)/decks.tsx
- [ ] app/decks/[id].tsx

## Правила FSD

1. **Слои могут импортировать только нижестоящие слои**:
   - `app` → любой слой
   - `processes` → widgets, features, entities, shared
   - `widgets` → features, entities, shared
   - `features` → entities, shared
   - `entities` → shared
   - `shared` → только внутри shared

2. **Структура каждого слайса**:
   - `model/` - данные, состояние (types.ts, slice.ts, etc.)
   - `api/` - работа с внешним API
   - `ui/` - компоненты, относящиеся к слайсу
   - `lib/` - вспомогательные функции
   - `index.ts` - публичное API слайса

3. **Использование алиасов**:
   ```tsx
   // Правильно
   import { Button } from '@shared/ui';
   import { useGetDecksQuery } from '@entities/deck';
   
   // Неправильно
   import { Button } from '../../shared/ui/button';
   import { useGetDecksQuery } from '@entities/deck/api/decks-api';
   ```

## Проверка архитектуры

Для проверки соблюдения правил FSD используйте команду:
```
yarn check-fsd
```

Эта команда проверит нарушения импортов между слоями. 
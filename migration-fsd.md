# План миграции на FSD

## Что уже сделано

1. Создана базовая FSD структура
2. Настроены алиасы импортов
3. Перенесены базовые сущности и API:
   - entities/deck
   - entities/level
   - entities/question
   - entities/user
   - features/deck-likes
   - features/question-likes
   - features/language
   - shared/api
   - shared/config
   - shared/ui/button
   - shared/lib/hooks

## Что нужно сделать

### 1. Перенести оставшиеся UI компоненты

- [ ] UI/Switcher.tsx → shared/ui/switcher
- [ ] UI/Label.tsx → shared/ui/label
- [ ] UI/SearchBar.tsx → shared/ui/search-bar
- [ ] UI/CustomLabel.tsx → shared/ui/custom-label
- [ ] UI/LevelInfo.tsx → entities/level/ui или widgets/level-info
- [ ] UI/DeckLikeButton.tsx → features/deck-likes/ui

### 2. Перенести компоненты из /components

- [ ] components/card → entities/card/ui
- [ ] components/deck → entities/deck/ui
- [ ] components/train → features/training/ui
- [ ] components/default → shared/ui
- [ ] components/profile → entities/profile/ui или features/profile/ui
- [ ] components/screens → pages или widgets
- [ ] components/achievements → entities/achievement/ui

### 3. Перенести модули

- [ ] modules/Decks → widgets/deck-list

### 4. Перенести оставшиеся store слайсы

- [ ] store/reducer/levels-slice.ts → entities/level/model/slice.ts
- [ ] store/reducer/profile-slice.ts → entities/profile/model/slice.ts
- [ ] store/reducer/question-like-slice.ts → features/question-likes/model/slice.ts
- [ ] store/reducer/splash-animation-slice.ts → features/animation/model/slice.ts
- [ ] store/reducer/user-slice.ts → entities/user/model/slice.ts
- [ ] store/reducer/app-slice.ts → app/model/slice.ts

### 5. Перенести роутинг (для expo-router)

- [ ] app → src/pages с соответствующими индексными файлами

### Порядок миграции

1. Начать с перемещения общих UI компонентов в shared/ui
2. Затем мигрировать сущности (entities)
3. Перенести функционал в features
4. Объединить в widgets
5. Настроить pages и routing
6. Последними обновить processes и app

### Рекомендации

1. Делать по одному компоненту за раз
2. После каждого переноса проверять, что всё работает
3. Использовать консистентные именования файлов: ui.tsx, styles.ts, index.ts, etc.
4. Следовать правилам импортов FSD (не нарушать слои)
5. Обновлять index.ts файлы для упрощения экспортов 
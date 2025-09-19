# Onboarding Wireframes & Layout Specifications

## Screen 1: Welcome
```
┌─────────────────────────────────────┐
│            ● ○ ○ ○ ○                │ Progress Dots
│                                     │
│                                     │
│         ┌─────────────┐             │
│         │     🎯      │             │ Main Illustration
│         │   Welcome   │             │ (Circular design with
│         │    Icon     │             │  colored elements)
│         └─────────────┘             │
│                                     │
│                                     │
│      Добро пожаловать в Честно!     │ Main Title
│                                     │ (MakanHatiCyrillic)
│     Социальная игра для глубокого    │ Subtitle
│           общения                   │ (Poppins Semibold)
│                                     │
│   Откройте для себя новые грани      │ Description
│   друзей и близких через            │ (Poppins Regular)
│   увлекательные вопросы разной      │
│        глубины                      │
│                                     │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │     Начать знакомство          │ │ Primary Button
│  └─────────────────────────────────┘ │
│               Пропустить            │ Secondary Button
└─────────────────────────────────────┘
```

## Screen 2: Topics
```
┌─────────────────────────────────────┐
│            ○ ● ○ ○ ○                │ Progress Dots
│                                     │
│                                     │
│    ┌───┐    ┌───┐    ┌───┐          │
│    │🎭 │    │💭 │    │❤️ │          │ Topic Cards
│    │   │    │   │    │   │          │ (Overlapping,
│    └───┘    └───┘    └───┘          │  rotated)
│       ┌───┐    ┌───┐                │
│       │🎯 │    │🌟 │                │
│       │   │    │   │                │
│       └───┘    └───┘                │
│                                     │
│   Выберите тему для разговора       │ Main Title
│                                     │
│     Разнообразные колоды вопросов   │ Subtitle
│                                     │
│   От легких и веселых до глубоких   │ Description
│   и личных - найдите подходящую     │
│   тему для любой компании           │
│                                     │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │      Посмотреть темы           │ │ Primary Button
│  └─────────────────────────────────┘ │
│               Назад                 │ Secondary Button
└─────────────────────────────────────┘
```

## Screen 3: Levels
```
┌─────────────────────────────────────┐
│            ○ ○ ● ○ ○                │ Progress Dots
│                                     │
│                                     │
│    ○     ◉     ●                    │ Level Circles
│   (S)   (M)   (L)                   │ (Small to Large,
│                                     │  different colors)
│   1️⃣    2️⃣    3️⃣                     │ Level Numbers
│                                     │
│                                     │
│                                     │
│        Три уровня глубины           │ Main Title
│                                     │
│   Контролируйте интимность беседы   │ Subtitle
│                                     │
│   Начните с легких вопросов и       │ Description
│   постепенно углубляйтесь в более   │
│        личные темы                  │
│                                     │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │           Понятно              │ │ Primary Button
│  └─────────────────────────────────┘ │
│               Назад                 │ Secondary Button
└─────────────────────────────────────┘
```

## Screen 4: Gameplay
```
┌─────────────────────────────────────┐
│            ○ ○ ○ ● ○                │ Progress Dots
│                                     │
│    ┌─────────────────────────────┐   │
│    │        Вопрос карточка      │   │ Question Card
│    │    ________________        │   │ (With placeholder
│    │    ________________        │   │  text lines)
│    │    ____________            │   │
│    └─────────────────────────────┘   │
│               ↓                     │ Arrow/Flow
│                                     │
│      👤    👤    👤                  │ Player Icons
│                                     │ (Small circles)
│                                     │
│           Как играть?               │ Main Title
│                                     │
│   Простые правила для глубоких      │ Subtitle
│          разговоров                 │
│                                     │
│   Выберите колоду, уровень глубины  │ Description
│   и наслаждайтесь честными ответами │
│           друг друга                │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │         Попробовать            │ │ Primary Button
│  └─────────────────────────────────┘ │
│               Назад                 │ Secondary Button
└─────────────────────────────────────┘
```

## Screen 5: Achievements
```
┌─────────────────────────────────────┐
│            ○ ○ ○ ○ ●                │ Progress Dots
│                                     │
│                                     │
│           🏆                        │ Trophy Icon
│          ┌─┐                        │ (Large, golden)
│          └─┘                        │
│                                     │
│        ⭐  ⭐  ⭐                      │ Achievement Stars
│                                     │
│                                     │
│        Развивайтесь вместе          │ Main Title
│                                     │
│     Открывайте новые достижения     │ Subtitle
│                                     │
│    Играйте регулярно, открывайте    │ Description
│    новые колоды и углубляйте        │
│    отношения с близкими             │
│                                     │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │        Начать игру!            │ │ Primary Button
│  └─────────────────────────────────┘ │
│               Назад                 │ Secondary Button
└─────────────────────────────────────┘
```

## Layout Specifications

### Grid System
- **Container**: 20px horizontal padding
- **Vertical spacing**: 16px, 24px, 32px increments
- **Text margins**: 12px, 16px between elements

### Component Dimensions
```
Progress Indicator:
- Dots: 8px diameter, 8px gap
- Container: 20px vertical padding

Illustration Area:
- Container: 80% screen width
- Height: Flexible, maintains aspect ratio
- Centered horizontally

Text Container:
- Max width: Screen width - 40px
- Bottom padding: 40px
- Text horizontal padding: 16px

Navigation Controls:
- Bottom padding: 40px
- Button gap: 16px
- Primary button height: 54px minimum
- Secondary button height: 44px minimum
```

### Responsive Adaptations

#### Small Devices (< 375px)
```
- Reduce illustration size to 70% screen width
- Title font size: 24px
- Subtitle font size: 16px
- Body font size: 14px
- Tighter spacing: 12px, 16px, 24px
```

#### Large Devices (> 414px)
```
- Illustration size: 85% screen width
- Title font size: 32px
- Subtitle font size: 20px
- Body font size: 18px
- Generous spacing: 20px, 28px, 40px
```

### Animation Flow
```
Screen Enter:
1. Progress dots update (300ms)
2. Illustration fade in + scale (500ms)
3. Text content slide up + fade (400ms)
4. Buttons appear (200ms delay)

Screen Exit:
1. Content fade out (200ms)
2. Slide out horizontally (300ms)
3. New screen preparation
```

### Gesture Areas
```
Swipe Detection:
- Left 20% of screen: Previous step
- Right 20% of screen: Next step
- Center 60%: Content interaction
- Minimum velocity: 500px/s
- Minimum distance: 20% screen width
```

### Accessibility Landmarks
```
- Progress: Role="progressbar"
- Main content: Role="main"
- Navigation: Role="navigation"
- Buttons: Role="button"
- Text blocks: Proper heading hierarchy
```
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native mobile application built with Expo, using Feature-Sliced Design (FSD) architecture. The app is written in TypeScript and uses Redux Toolkit for state management, TanStack React Query for data fetching, and Expo Router for navigation.

## Development Commands

### Core Development
- `yarn start` - Start Expo development server
- `yarn android` - Run on Android device/emulator
- `yarn ios` - Run on iOS device/simulator
- `yarn web` - Run on web platform

### Code Quality
- `yarn lint` - Run ESLint to check code quality
- `yarn test` - Run Jest tests in watch mode
- `yarn check-fsd` - Validate FSD architecture import rules

## Architecture: Feature-Sliced Design (FSD)

The project follows FSD architecture with these layers (from highest to lowest):

1. **app** - Application initialization, routing, and global providers
2. **processes** - Complex business processes (currently unused)
3. **pages** - Route components (currently minimal, using Expo Router file-based routing)
4. **widgets** - Large composite UI blocks
5. **features** - Business features and user interactions
6. **entities** - Business entities and their logic
7. **shared** - Reusable utilities, UI components, and configurations

### Import Rules
- Each layer can only import from layers below it
- The `scripts/check-fsd-imports.js` script validates these rules
- Use the TypeScript path aliases defined in `tsconfig.json`:
  - `@app/*` for app layer
  - `@widgets/*` for widgets
  - `@features/*` for features
  - `@entities/*` for entities
  - `@shared/*` for shared utilities

### Key Architecture Points
- **State Management**: Redux Toolkit slices in `features/*/model/slice.ts` and `entities/*/model/slice.ts`
- **API Layer**: TanStack React Query hooks in `features/*/api/` directories
- **UI Components**: Shared components in `shared/ui/`, feature-specific in `features/*/ui/`
- **Navigation**: Expo Router with file-based routing in `app/` directory
- **Internationalization**: i18next configuration in `shared/config/i18n/`

## Technology Stack

### Core Technologies
- **React Native**: 0.81.4 with React 19.1.0
- **Expo**: ~54.0.7 with Expo Router for navigation
- **TypeScript**: ~5.9.2 with strict mode enabled
- **State Management**: Redux Toolkit + Redux Persist
- **Data Fetching**: TanStack React Query with AsyncStorage persistence
- **Styling**: StyleSheet API with custom color system in `shared/config/styles/colors.ts`

### Key Libraries
- **UI**: @gorhom/bottom-sheet, react-native-reanimated, react-native-gesture-handler
- **Icons**: @expo/vector-icons
- **Animations**: Lottie (lottie-react-native)
- **Storage**: @react-native-async-storage/async-storage
- **Utilities**: UUID generation, emoji picker, toast notifications

## Animation Requirements

**IMPORTANT**: All animations in this project MUST use `react-native-reanimated`. Do not use:
- React Native's built-in `Animated` API
- CSS animations or transitions
- Any other animation libraries

Always import and use reanimated for any animation work:
```typescript
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming
} from 'react-native-reanimated';
```

## Development Guidelines

### Code Style (from .cursor/rules/)
- Use functional components with hooks over class components
- Prefer camelCase for variables/functions, PascalCase for components
- Use lowercase hyphenated names for directories
- Implement React.memo() for performance optimization
- Use StyleSheet.create() for consistent styling
- Avoid anonymous functions in FlatList renderItem

### File Organization
- Each feature should have its own directory with model/, ui/, and api/ subdirectories
- Use index.ts files for clean exports
- Keep components focused on single responsibility
- Group related functionality by feature, not by file type

### Performance Considerations
- The project includes react-performance-optimization rules for monitoring and improving performance
- Use memoization patterns where appropriate
- Optimize FlatList components with proper props
- Implement lazy loading for large components

## Common Patterns

### Feature Structure
```
features/
  feature-name/
    api/           # API calls and React Query hooks
    model/         # Redux slices and types
    ui/            # UI components
    index.ts       # Public API exports
```

### Shared UI Components
All reusable UI components are in `shared/ui/` with consistent naming:
- Component file: `ui.tsx` or `component-name.tsx`
- Export file: `index.ts`
- Styles (if separate): `styles.ts`

### State Management
- Use Redux Toolkit for global state
- Feature-specific slices in `features/*/model/slice.ts`
- Entity slices in `entities/*/model/slice.ts`
- Custom hooks in `features/hooks/` for common state operations

## Testing
- Jest configured with `jest-expo` preset
- Tests can be run with `yarn test` in watch mode
- Test files should follow standard Jest conventions
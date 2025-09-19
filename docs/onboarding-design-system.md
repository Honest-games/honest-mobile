# Onboarding Design System Documentation

## Overview
This document outlines the comprehensive design system for the onboarding experience in the Честно mobile application. The design follows modern UX principles while maintaining the app's friendly and approachable aesthetic.

## Design Principles

### 1. Simplicity First
- Clear visual hierarchy
- Minimal cognitive load
- Focus on one concept per screen

### 2. Accessibility by Default
- WCAG 2.1 AA compliance
- Screen reader support
- Minimum 44pt touch targets
- High contrast ratios

### 3. Responsive Design
- Adaptive layouts for different screen sizes
- Scalable typography
- Flexible spacing system

### 4. Performance Conscious
- Optimized animations
- Efficient component architecture
- Lightweight illustrations

## Color System

### Primary Colors
- **Primary Blue**: `#00405F` - Main brand color, CTAs
- **Accent Yellow**: `#D8D463` - Highlights, positive actions
- **Light Green**: `#7C9C7E` - Success states, nature theme
- **Orange**: `#EF592A` - Attention, energy
- **Beige**: `#F3ECE0` - Backgrounds, warmth

### Supporting Colors
- **Deep Gray**: `#333333` - Primary text
- **Light Grey**: `#AAAAAA` - Secondary text, disabled states
- **Red**: `#FF4B4B` - Errors, warnings

### Background Variations
Each onboarding screen uses a contextual background:
- Welcome: `beige` (#F3ECE0)
- Topics: `lightBeige` (#FDF5EB)
- Levels: `dimGreen` (#BCCDBF)
- Gameplay: `dimBlue` (#B4BDD1)
- Achievements: `dimOrange` (#F7AC94)

## Typography

### Font Families
- **Poppins**: Primary font for body text, UI elements
- **MakanHatiCyrillic**: Accent font for headlines, brand elements

### Type Scale (Responsive)
```
Title: 24-36px (MakanHatiCyrillic, Bold)
Subtitle: 16-24px (Poppins, Semibold)
Body: 14-22px (Poppins, Regular)
Caption: 12-20px (Poppins, Regular)
```

### Responsive Behavior
- Small devices (< 375px): Reduced sizes
- Large devices (> 414px): Increased sizes
- 1.4x line height ratio for readability

## Spacing System

Based on 4px grid system:
```
xs: 4px   - Tight spacing
sm: 8px   - Default small
md: 16px  - Default medium
lg: 24px  - Section spacing
xl: 32px  - Large spacing
xxl: 48px - Hero spacing
```

## Component Architecture

### OnboardingContainer
Main wrapper component that handles:
- Step navigation logic
- Gesture handling (swipe navigation)
- Animation orchestration
- State management integration

### OnboardingScreen
Individual screen component featuring:
- Contextual background colors
- Animated content transitions
- Responsive text rendering
- Accessibility labels

### ProgressIndicator
Shows user progress with:
- Two variants: dots and progress bar
- Smooth animations between steps
- Accessible progress announcements

### NavigationControls
Bottom navigation with:
- Primary action button (adaptive text)
- Secondary action button (Back/Skip)
- Touch target optimization
- Screen reader support

### Illustration
Custom illustrations for each step:
- Geometric, friendly design language
- Brand color integration
- Scalable vector approach
- Animation support

## Accessibility Guidelines

### Screen Reader Support
- Meaningful accessibility labels
- Progress announcements
- Content structure markup
- Navigation hints

### Touch Targets
- Minimum 44pt for all interactive elements
- 48pt recommended for primary actions
- Adequate spacing between targets

### Color Contrast
- AA compliance for all text combinations
- 4.5:1 ratio for normal text
- 3:1 ratio for large text (18px+)

### Motion & Animation
- Respects reduced motion preferences
- Smooth spring animations (damping: 15)
- Reasonable duration (200-500ms)
- Purposeful, not decorative

## Animation Specifications

### Screen Transitions
```typescript
// Content fade and slide
opacity: withTiming(0 → 1, { duration: 300 })
translateY: withSpring(20 → 0, { damping: 15 })
```

### Button Interactions
```typescript
// Press feedback
scale: withSequence(
  withSpring(0.95),
  withSpring(1)
)
```

### Progress Animation
```typescript
// Smooth progress updates
progress: withTiming(newValue, { duration: 300 })
```

### Illustration Entry
```typescript
// Staggered entrance
opacity: withSpring(1, { damping: 15 })
scale: withSequence(
  withSpring(1.1, { damping: 15 }),
  withSpring(1, { damping: 15 })
)
```

## Gesture Support

### Swipe Navigation
- Horizontal pan gesture recognition
- Velocity threshold: 500px/s
- Distance threshold: 20% screen width
- Visual feedback during gesture
- Bounce-back animation on invalid swipes

## Responsive Breakpoints

### Small Devices
- Width < 375px or Height < 667px
- Reduced font sizes
- Tighter spacing
- Simplified illustrations

### Standard Devices
- iPhone 6/7/8 baseline
- Standard sizing
- Optimal spacing

### Large Devices
- Width > 414px or Height > 896px
- Increased font sizes
- More generous spacing
- Enhanced illustrations

## Implementation Guidelines

### File Structure
```
features/onboarding/
├── types/           # TypeScript definitions
├── config/          # Step configurations
├── model/           # Redux state management
├── hooks/           # Custom React hooks
├── ui/              # UI components
│   ├── progress-indicator/
│   ├── navigation-controls/
│   ├── illustration/
│   ├── onboarding-screen/
│   └── onboarding-container/
└── index.ts         # Public API
```

### Performance Considerations
- React.memo() for preventing unnecessary re-renders
- Shared values for animations
- Efficient gesture handling
- Lazy loading preparation

### Testing Considerations
- Screen reader testing
- Different device sizes
- Various iOS/Android versions
- Network conditions
- Memory constraints

## State Management

### Redux Integration
```typescript
interface OnboardingState {
  currentStep: number;
  isCompleted: boolean;
  hasSkipped: boolean;
}
```

### Persistence
- onboarding completion status saved
- step progress tracking
- user preferences retention

## Future Enhancements

### Planned Features
- Micro-interactions on illustrations
- Lottie animation integration
- Dynamic content based on user data
- A/B testing framework integration
- Analytics event tracking

### Internationalization
- RTL language support preparation
- Cultural adaptation for illustrations
- Local color preferences
- Region-specific content

## Quality Checklist

### Design Review
- [ ] Brand consistency
- [ ] Visual hierarchy clarity
- [ ] Color accessibility compliance
- [ ] Typography readability
- [ ] Animation purposefulness

### Development Review
- [ ] Component reusability
- [ ] Performance optimization
- [ ] Accessibility implementation
- [ ] Cross-platform consistency
- [ ] Error handling

### User Testing
- [ ] First-time user comprehension
- [ ] Navigation intuitiveness
- [ ] Completion rates
- [ ] Accessibility with assistive technology
- [ ] Various device testing
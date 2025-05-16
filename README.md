# Honest-mobile

Мобильное приложение на React Native (Expo) для iOS и Android.

## [Процесс разработки](./docs/dev-process.md)

## Локальная установка

### Общие требования
- Node.js 18.18 или новее
- Git
- Watchman (для macOS)
- Yarn или npm

### Для iOS (только macOS)
- macOS
- Xcode 15 или новее
- CocoaPods
- Ruby 2.7.6 или новее

### Для Android (Windows/macOS/Linux)
- Android Studio Hedgehog или новее
- Java Development Kit (JDK) 17
- Android SDK:
  - Android SDK Platform 35 (Android 15 - VanillaIceCream)
  - Android SDK Build-Tools 35.0.0
  - Intel x86 Atom_64 System Image или Google APIs Intel x86 Atom System Image
  - Android SDK Command-line Tools
  - Android SDK Platform-Tools
  - Google Play services
  - Google Play APK Expansion library

## Настройка окружения

### macOS

1. Установите Homebrew:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

2. Установите Node.js и Watchman:
```bash
brew install node
brew install watchman
```

3. Установите JDK 17:
```bash
brew install --cask zulu@17
```

4. Добавьте JAVA_HOME в ~/.zshrc:
```bash
export JAVA_HOME=/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home
```

5. Установите Android Studio и настройте переменные окружения в ~/.zshrc:
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### Windows

1. Установите Node.js с [официального сайта](https://nodejs.org/)

2. Установите JDK 17 с [Azul Zulu](https://www.azul.com/downloads/?package=jdk#download-openjdk)

3. Установите Android Studio и настройте переменные окружения:
```powershell
setx ANDROID_HOME "%LOCALAPPDATA%\Android\Sdk"
setx PATH "%PATH%;%ANDROID_HOME%\platform-tools"
```

## Установка проекта

1. Клонируйте репозиторий:
```bash
git clone [URL репозитория]
cd O-frontend-mobile
```

2. Установите зависимости:
```bash
yarn install
# или
npm install
```

3. Установите зависимости iOS (только для macOS):
```bash
cd ios && pod install && cd ..
```

## Запуск приложения

### iOS (только macOS)
```bash
yarn ios
# или
npm run ios
```

### Android
```bash
yarn android
# или
npm run android
```

### Запуск Metro сервера
```bash
yarn start
# или
npm start
```

## Зависимости проекта

Основные зависимости:
- expo: ~50.0.6
- react: 18.2.0
- react-native: 0.73.4
- @react-navigation/native: ^6.0.2
- @reduxjs/toolkit: ^2.2.1
- react-redux: ^9.1.0

Полный список зависимостей можно найти в package.json.

## Troubleshooting

### Android

1. Если возникают проблемы с SDK:
   - Откройте Android Studio
   - Перейдите в SDK Manager
   - Убедитесь, что установлены все необходимые компоненты из раздела "Требования к системе"

2. Проблемы с эмулятором:
   - Создайте новый эмулятор через AVD Manager
   - Выберите Android 15 (API Level 35)
   - Убедитесь, что установлен HAXM для лучшей производительности

### iOS

1. Проблемы с CocoaPods:
```bash
sudo gem install cocoapods
cd ios && pod install
```

2. Очистка кэша:
```bash
yarn start --reset-cache
# или
npm start -- --reset-cache
```

## Полезные ссылки

- [Документация React Native](https://reactnative.dev/docs/getting-started)
- [Документация Expo](https://docs.expo.dev/)
- [Настройка окружения React Native](https://reactnative.dev/docs/environment-setup)
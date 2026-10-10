# GameHub 

A mobile application built with **React Native** and **Expo**. GameHub enables users to discover, search, filter, explore, and bookmark their favorite casual games with persistent offline storage.

---

## Screenshots

| 01. Home Discovery | 02. Added to favourites | 03. Game Details | 04. Saved Favourites |
|:---:|:---:|:---:|:---:|
| ![Home](screenshots\home-screen.jpeg) | ![Added to favourites](screenshots\added-to-favourite-page.jpeg) | ![Game Details](screenshots\game-details-screen.jpeg) | ![Favourites](screenshots\favourites-screen.jpeg) |

---

## Versions & Major Libraries

| Library | Version | Purpose |
|---|---|---|
| **React Native** | `0.86.3` | Core mobile UI framework |
| **Expo SDK** | `~57.0.27` | Tooling, runtime, and cross-platform mobile APIs |
| **React** | `19.2.3` | Component and hooks state architecture |
| **@react-navigation/native** | `^7.5.0` | Navigation container and routing state |
| **@react-navigation/native-stack** | `^7.20.0` | Native performance stack transitions |
| **@react-native-async-storage/async-storage** | `2.2.0` | Asynchronous local device persistence for favorites |
| **react-native-safe-area-context** | `~5.7.0` | Safe inset handling for notched & punch-hole screens |
| **react-native-screens** | `~4.26.0` | Native view hierarchy optimization for navigation |
| **@expo/vector-icons** | `^15.0.2` | Vector iconography (Ionicons) |

---

## Project Structure

```text
GameHub/
├── App.js
├── app.json
├── package.json
├── package-lock.json
├── assets/
├── screenshots/
│   ├── 01-home.png
│   ├── 02-search-filter.png
│   ├── 03-game-details.png
│   └── 04-favorites.png
└── src/
    ├── components/
    │   ├── GameCard.js
    │   ├── SearchBar.js
    │   ├── CategoryChip.js
    │   └── EmptyState.js
    ├── context/
    │   └── FavoritesContext.js
    ├── data/
    │   └── games.json
    ├── navigation/
    │   └── AppNavigator.js
    ├── screens/
    │   ├── HomeScreen.js
    │   ├── GameDetailsScreen.js
    │   └── FavoritesScreen.js
    └── services/
        └── gameService.js

```

---

## Setup & Run Instructions

### Prerequisites
- **Node.js** (v18 or newer recommended)
- **npm** or **bun**
- **Expo Go** mobile app (iOS / Android) or an Android Studio Emulator / iOS Simulator

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npx expo start
```

### 3. Open on Your Device
- **Physical Mobile Phone**: Scan the QR code displayed in the terminal using the **Expo Go** app (Android) or Camera app (iOS).
- **Android Emulator**: Ensure an emulator is running in Android Studio, then press **`a`** in the terminal.
- **iOS Simulator**: Press **`i`** in the terminal (macOS required).
- **Web Browser**: Press **`w`** in the terminal to preview in browser.

---

## Assumptions & Known Limitations

### Assumptions
1. **Offline-First Dataset**: The app utilizes a local dataset (`src/data/games.json`) wrapped in an async service layer (`gameService.js`) with simulated 400ms latency to realistically mimic a cloud REST API without requiring an external backend server to run.
2. **Network Connection for Artwork**: Game image thumbnails are loaded from Unsplash CDN; an active internet connection is assumed for remote images to load on first launch.
3. **Local Device Persistence**: Bookmarked games are persisted locally per device using `@react-native-async-storage/async-storage`.

### Known Limitations
1. **Single-Device Scope**: Favorites are stored in the device's native local storage; multi-device cloud synchronization or user authentication accounts are not implemented.
2. **Catalog Scope**: The catalog contains a curated set of 10 casual games. Adding new games dynamically requires updating `games.json` or connecting to a live REST endpoint.
3. **Discovery Focus**: The app focuses on game discovery, search, specifications, and bookmarking; interactive in-app playable games are outside the scope of this assessment.

---

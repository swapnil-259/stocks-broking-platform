## groww_assignment_cli — React Native mini-app

This repository contains a small React Native application used for a coding assignment. The app demonstrates:

- Global light/dark theming (nativewind + ThemeProvider)
- Bottom tab navigation with two main tabs: Explore (Stocks) and Watchlists
- Product detail screen with price chart (sparkline) and OHLC-like stats
- Named watchlists (multiple lists), add/remove stocks to lists, and persistence to AsyncStorage
- Simple in-memory + AsyncStorage caching layer for API responses

This README explains how to run the app, configure an API key, and where to look for important pieces of code.

## Quick start

Prerequisites (standard React Native setup):

- Node >= 18
- Yarn or npm
- Xcode (for iOS) / Android Studio (for Android)
- CocoaPods for iOS native deps

Install JavaScript dependencies:

```sh
# from project root
npm install
# or
yarn install
```

Install iOS pods (macOS):

```sh
cd ios && bundle install || true
bundle exec pod install
cd ..
```

Run Metro and the app:

```sh
# Start Metro
npm start

# Android
npm run android

# iOS
npm run ios
```

If you see build failures related to native modules (charting or svg), run `pod install` again and rebuild from Xcode/Android Studio.

## Configuration — AlphaVantage API key

The app uses AlphaVantage for stock price data. To run real network requests you must provide an API key.

1. Copy the example config: `src/config.example.ts` -> `src/config.ts` (this repo keeps `src/config.ts` out of version control).
2. Edit `src/config.ts` and set `ALPHAVANTAGE_API_KEY` to your key.

If `src/config.ts` is missing, the app will use a demo key and/or fallback data in many places. Expect rate limits from AlphaVantage on free keys.

Note: The API client lives at `src/api/alphavantage.ts` and currently uses a simple cache layer. Consider adding a rate limiter (e.g., Bottleneck) for heavy testing.

## Key project files

- `App.tsx` — app root, initializes cache and providers (Theme + Watchlist providers) and registers navigation.
- `src/providers/ThemeProvider.tsx` — manages light/dark theme and syncs nativewind theme tokens.
- `src/context/WatchlistsCollectionContext.tsx` — named watchlists (create/list/delete/toggle stocks) persisted to AsyncStorage.
- `src/context/WatchListContext.tsx` — flat watchlist context (single list) for quick bookmarking style persistence.
- `src/components/PriceChart.tsx` — central chart component (uses react-native-chart-kit + react-native-svg); sanitizes data for reliable rendering.
- `src/components/WatchlistModal.tsx` — modal UI for creating and toggling watchlists for a stock.
- `src/screens/ProductScreen.tsx` — product detail page (chart + description + add-to-watchlist modal).
- `src/screens/ExploreScreen.tsx` — main stocks screen with search and lists (Top Gainers / Top Losers fallback data).
- `src/screens/WatchlistsScreen.tsx` — grid of named watchlists and drill-in to view stocks in a list.
- `src/utils/cache.ts` — in-memory cache + AsyncStorage persistence utilities.

## Theming notes

The app uses nativewind for styling and a `ThemeProvider` to persist the user preference. The theme also affects navigation chrome and the chart colors. If you change theme tokens, run a full rebuild on native to see changes in native modules.

## Running TypeScript checks and tests

TypeScript checks (no emit):

```sh
npx tsc --noEmit
```

Unit tests (Jest) are present for a minimal smoke test. Run:

```sh
npm test
```

## Debugging and common issues

- Chart rendering: `react-native-chart-kit` depends on `react-native-svg`. If charts appear as blank boxes, ensure `react-native-svg` is properly linked and pods installed, then rebuild.
- Provider hooks error: if you see "Hook used outside provider", ensure `App.tsx` mounts providers in the correct order and that `initCacheFromStorage()` completes before components attempt to read persisted data.
- Rate limiting: AlphaVantage free tier will throttle requests. Use local caching (implemented) and avoid firing many requests in parallel.

## Developer notes and next steps

- README updates: keep `src/config.ts` out of repo. Use `src/config.example.ts` to show the shape.
- Consider adding a rate limiter (Bottleneck) in `src/api/alphavantage.ts` and moving caching into a shared HTTP layer.
- Remove or redirect debug console.log statements before shipping.

## License

This project is provided as-is for a coding assignment. See individual files for any licenses of third-party libraries.

---

If you want me to (I can):

- wire in Bottleneck for API rate-limiting and update `src/api/alphavantage.ts` (small change),
- remove debug logs and run the TypeScript checks, or
- add a short CONTRIBUTING.md with local development tips.

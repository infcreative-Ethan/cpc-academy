# CPC Academy — Vocabulary V0.1

Mobile-first bilingual self-study app for foundational US medical terminology.

## Features
- English/Chinese medical vocabulary cards, search, and category filters
- US English pronunciation using browser speech synthesis (en-US voices)
- Listening recognition and typed dictation
- Word-part/root study and Chinese meaning recall
- Daily target of 20 new words
- Local progress, review queue, and weak-word tracking
- Responsive mobile navigation
- Android APK packaging through Capacitor

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000.

## Build Android APK
The repository's GitHub Actions workflow builds a debug APK automatically after changes are pushed to `main`.

1. Open the repository's **Actions** tab.
2. Select **Build CPC Academy Android APK**.
3. Open the latest successful run.
4. Download the `CPC-Academy-Android-APK` artifact and extract the APK.

For local Android development, install Node.js 22+, Android Studio 2025.2.1+, and Android SDK API 36, then run:
```bash
npm install
npm run build
npx cap add android
npx cap sync android
cd android
./gradlew assembleDebug
```

## Notes
- Progress is stored locally in the current device/browser using localStorage.
- Pronunciation uses the device's available en-US speech synthesis voice; Android may need an English voice downloaded in system Text-to-Speech settings.
- The app shell is packaged locally; the initial vocabulary and learning features do not require a server.
- The initial vocabulary set is a starter dataset and should be reviewed against the learner's selected course materials before being treated as an authoritative glossary.
- The generated debug APK is intended for direct testing and sideload installation, not Play Store distribution.

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

## Build an Android APK with GitHub Actions
The public repository includes a GitHub Actions workflow at `.github/workflows/android-apk.yml`.

1. Open the repository's **Actions** tab.
2. Select **Build CPC Academy Android APK**.
3. If you want to build without making a code change, select **Run workflow** and choose the `main` branch.
4. Open the completed workflow run.
5. In **Artifacts**, download `CPC-Academy-Android-APK`.
6. Extract the downloaded ZIP and install `app-debug.apk` on your Android phone.

A push to the `main` branch also starts a build automatically. The workflow uses the standard `ubuntu-24.04` GitHub-hosted runner. Standard GitHub-hosted runners are free for public repositories. The APK artifact is retained for 7 days; download it before it expires.

## Local Android build
Install Node.js 22+, Java 21, Android Studio, and Android SDK API 36, then run:
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
- The debug APK is signed with Android's debug key and is intended for direct testing/sideload installation, not Play Store distribution.

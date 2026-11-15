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

## Build Android APK with Codemagic
The repository includes `codemagic.yaml` for building an installable Android debug APK on Codemagic.

1. Create an individual account at https://codemagic.io/.
2. Connect your GitHub account and grant read access to the private `infcreative-Ethan/cpc-academy` repository.
3. Add the CPC Academy application and select the `main` branch.
4. Let Codemagic detect the `codemagic.yaml` configuration at the repository root.
5. Select the **CPC Academy Android APK** workflow and start a manual build.
6. When the build succeeds, download `app-debug.apk` from the Artifacts section.

The workflow uses the `mac_mini_m2` build machine. Codemagic's individual Free plan currently includes 500 macOS M2 build minutes per month. Do not enable pay-as-you-go billing unless you explicitly want paid builds.

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

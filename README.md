# CPC Academy — Vocabulary V0.2.2

Mobile-first bilingual self-study app for foundational US medical terminology.

## Features
- 2,306 textbook Mini-Dictionary terms with the book’s pronunciation respellings and English definitions
- 878 glossary word parts (combining forms, prefixes, and suffixes)
- English/Chinese medical vocabulary cards, search, and category filters
- Pre-generated US English MP3 pronunciation library for all 2,306 textbook terms and glossary word parts
- Offline playback through the Android media player; no phone TTS engine or downloaded voice pack required
- Normal and slow playback for vocabulary, roots, and available clinical example sentences
- Listening recognition and typed dictation
- Word-part/root study and Chinese meaning recall
- Daily target of 20 new words
- User-selected 1, 2, 3, 5, or 10 review rounds, with per-round accuracy history
- In-app “Check for updates” shortcut to the latest successful APK build on GitHub Actions
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

A push to the `main` branch also starts a build automatically. The workflow uses the standard `ubuntu-24.04` GitHub-hosted runner. Standard GitHub-hosted runners are free for public repositories. The APK artifact is retained for 30 days; download it before it expires.

## Local Android build
Install Node.js 22+, Python 3.11, FFmpeg, Java 21, Android Studio, and Android SDK API 36. Install `piper-tts==1.4.2`, download `en_US-kristin-medium` with `python -m piper.download_voices en_US-kristin-medium --data-dir .piper`, then run:
```bash
npm install
npm run build
python scripts/generate-audio.py --model .piper/en_US-kristin-medium.onnx --output-dir out/audio
npx cap add android
npx cap sync android
cd android
./gradlew assembleDebug
```

## Notes
- Progress is stored locally in the current device/browser using localStorage.
- Pronunciation uses pre-generated en-US MP3 files bundled into the APK. Playback does not call Android Text-to-Speech or require an installed voice pack.
- The app shell is packaged locally; the initial vocabulary and learning features do not require a server.
- The initial vocabulary set is a starter dataset and should be reviewed against the learner's selected course materials before being treated as an authoritative glossary.
- The debug APK is signed with Android's debug key and is intended for direct testing/sideload installation, not Play Store distribution.

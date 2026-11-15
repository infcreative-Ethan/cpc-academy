# CPC Academy — Medical Vocabulary + CPC Learning Center V1.0 Beta

Mobile-first bilingual self-study app for US medical terminology and the CPC coding pathway.

## Features
- 2,306 textbook Mini-Dictionary terms with the book’s pronunciation respellings and English definitions
- 878 glossary word parts (combining forms, prefixes, and suffixes)
- English/Chinese medical vocabulary cards, search, and category filters
- Pre-generated US English MP3 pronunciation library for textbook terms, English definitions, and glossary word parts
- Audio clips include 300 ms leading and 150 ms trailing silence to reduce first-syllable clipping on Android devices
- Reuses a persistent Android WebView audio player, with normal and slow playback
- Chinese medical term meanings, English-definition translations, and Chinese root/affix meanings are enriched before the static app build
- Tap English words inside definitions or word-part descriptions to open the bundled offline English-Chinese dictionary
- Add selected definition words to a persistent personal vocabulary list under the `Other` category
- English definitions have their own offline US-English narration clips
- Daily study sets: choose 20 or 30 new words, keep them in a separate daily list, and study one word per screen with previous/next navigation
- After completing the daily word set, the app offers a direct transition to configurable multi-round review
- Listening recognition and typed dictation
- Word-part/root study and Chinese meaning recall
- Daily target of 20 new words
- User-selected 1, 2, 3, 5, or 10 review rounds, with per-round accuracy history
- In-app “Check for updates” shortcut to the latest successful APK build on GitHub Actions
- Local progress, review queue, and weak-word tracking
- Responsive mobile navigation
- Android APK packaging through Capacitor



## Independent Medical Lessons (pilot)

- New static-export-compatible `/cpc/learn/` course route with full 22-chapter navigation.
- 66 independently authored learning sessions across Chapters 1–14 (initial subset only), 132 knowledge-check questions, mock clinical records, concept diagrams, offline pronunciation where vocabulary assets exist, and local mastery records.
- Per-lesson mastery is recorded after a knowledge check; chapter outline tags alone no longer count as completed study.
- Chapters and sections without authored content explicitly state that lesson content is not ready.
- Medical lesson progress is stored separately under `cpc-academy-medical-lessons-v1`, preserving legacy study records.
- Source relationship: textbook table-of-contents and topic organization; explanations and questions are original educational material, not transcriptions of textbook prose.

## CPC Learning Center V1.0 Beta

The `/cpc/` learning center is integrated into the existing vocabulary app and includes:

- The 22 chapter titles and chapter-topic navigation from *The Language of Medicine*, 13th Edition
- Anatomy-by-system reference cards linked to the textbook chapters
- A terminology lookup panel using the same 2,306+ book terms and 878+ word parts as the vocabulary system
- Reuse of the existing offline MP3 assets for medical terms, English definitions, and word parts
- Four simulated clinical documentation cases with answer explanations and local score tracking
- Introductory ICD-10-CM, CPT®, and HCPCS Level II workflows, with official update links
- Separate local progress for chapter completion and case practice

The textbook navigation is based on the uploaded 13th-edition table of contents. It does not reproduce textbook chapter prose. CPT® code tables and descriptors are not bundled; CPT® content requires appropriate AMA licensing.

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


## Bilingual vocabulary data
Before the static build, `scripts/enrich-chinese.py` matches the book terms against bilingual medical terminology and English-Chinese dictionary sources, then fills remaining gaps with Chinese machine-translation references. Machine-translated term meanings are marked in the app for review. The English source definition remains visible alongside its Chinese explanation. The script prints coverage totals in the GitHub Actions log.


## Daily study flow
1. Choose a 20-word or 30-word daily target.
2. Generate a separate daily set from terms not yet marked as known (review-queue terms are excluded when enough new terms remain).
3. Study each term on its own focused screen with audio, Chinese meaning, English and Chinese definitions, word parts, and examples.
4. Navigate backward or forward; completing the final term opens the daily review handoff.
5. The daily set, chosen size, current index, and completion state are stored locally on the device.

## Professional Coding Individual Lessons (pilot)

- 12 detailed independent professional coding lessons with 24 original quiz questions: ICD-10-CM foundations, Alphabetic Index, and CPT® foundations.
- `/cpc/coding/lesson/` uses query parameters for static-export-compatible navigation and records mastery after passing knowledge checks.
- The 100 coding-lesson outline entries remain visible. Entries without authored teaching content are labeled pending rather than being freely marked complete.
- Previous manual checkmarks are preserved in legacy local storage but are not counted as proven mastery. New mastery is saved in the `passedCodingLessons` field.

## Chapters 10–14 course expansion

- 25 independently authored lessons, 50 original knowledge checks, and 25 fictional clinical-record mini-cases covering nervous, cardiovascular, respiratory, blood, lymphatic and immune systems.
- Five additional on-device SVG concept illustrations: nervous system, cardiopulmonary circulation, respiratory tract, blood cells and lymphatic/immune flow. These are instructional schematics, not medical reference scans.
- Every medical lesson links to the separate professional coding course and retains individual mastery progress in localStorage.
- Chapters 15–22 remain in the textbook outline and are not falsely reported as fully authored.

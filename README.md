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

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000.

## Notes
- Progress is stored locally in the current browser using localStorage.
- Pronunciation uses the device/browser's available en-US speech voice; no external audio files are bundled.
- The initial vocabulary set is a starter dataset and should be reviewed against the learner's selected course materials before being treated as an authoritative glossary.

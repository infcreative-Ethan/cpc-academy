# CPC Academy — Product Requirements Document

**Product:** CPC Academy Android learning app  
**Target release:** V1.0 beta  
**Base:** Existing CPC Academy 0.2.5 app and its medical vocabulary/audio assets  
**Primary outcome:** Move from medical-term recognition to structured CPC coding-workflow literacy.

## 1. Product principles

1. Preserve the existing medical vocabulary library, pronunciation assets, daily word sets, multi-round review, custom vocabulary, and local progress.
2. Keep the textbook's 22-chapter organization visible as a learning index. The textbook is the terminology foundation, not a substitute for CPC coding references.
3. Teach coding as a documentation-first workflow: read the record, identify what is documented, distinguish diagnosis from service, choose the correct code set, then verify the current official instructions.
4. Never invent codes, descriptors, modifiers, or payer rules. V1.0 teaches code-set selection and documentation analysis; exact code assignment must be verified against the applicable current codebook and official updates.
5. Keep the app usable offline for its core study modules. Official-source links require an internet connection.
6. Preserve the existing main branch as the stable version while developing V1 on feature/cpc-academy-v1.

## 2. Users and use cases

**Primary user:** A learner preparing for U.S. professional medical coding work and the AAPC CPC pathway, starting with medical terminology and anatomy.

Key use cases:
- Learn and review medical terminology from the existing book vocabulary data.
- Navigate the 22 textbook chapters and understand how each connects to coding work.
- Review anatomy by body system and connect structures to clinical documentation.
- Read short simulated outpatient records and extract documented diagnosis, site/laterality, procedure, and missing details.
- Distinguish the purpose of ICD-10-CM, CPT®, and HCPCS Level II.
- Open official sources for current guidelines, code files, and licensing information.

## 3. V1.0 scope

### 3.1 Existing terminology learning (retain)
- 2,306 existing textbook Mini-Dictionary terms and existing word-part dataset.
- Daily set of 20 or 30 words; one-word-per-screen learning; previous/next navigation.
- English word and definition audio using bundled MP3 files.
- Chinese meaning, English definition, word-part breakdown, examples where available.
- Tap-to-translate English words and add custom vocabulary to the Other category.
- Dictation, Chinese-to-English, English-to-Chinese, and multi-round review.
- Local progress and review queue.

### 3.2 Offline English–Chinese dictionary (repair)
- Replace the empty dictionary payload at build time with a filtered, single-word ECDICT dataset.
- Download source data during CI build; do not require network access at runtime.
- Include only useful single-word entries with Chinese translations and frequency evidence, plus app vocabulary terms where a dictionary translation is available.
- Preserve ECDICT MIT attribution and license notice.
- Treat dictionary translations as lookup aids, not authoritative medical definitions.

### 3.3 Textbook chapter navigator
- Show all 22 chapters in the order and with the titles found in the user's copy of The Language of Medicine, 13th Edition.
- Group Chapters 1–4 as foundations, Chapters 5–18 as body systems, and Chapters 19–22 as specialties.
- Show concise chapter topic headings and a CPC relevance note.
- Show the Mini-Dictionary, Glossary, and four appendices as reference resources.
- Do not redistribute full textbook pages, exercises, images, or long passages.

### 3.4 Anatomy learning map
- Provide system cards for digestive, urinary, reproductive, nervous, cardiovascular, respiratory, blood/lymphatic/immune, musculoskeletal, skin, sense organs, endocrine, and oncology topics.
- Each card shows major structures, related textbook chapters, and a coding-reading focus.
- Teach laterality, anatomical site, direction, depth, and structure identification.
- V1.0 uses text-based system cards; interactive anatomical illustration is a later enhancement.

### 3.5 Clinical documentation practice
- Include short simulated outpatient documentation cases.
- Practice extracting documented diagnosis, site/laterality, procedure/service, and supporting record details.
- Questions teach which code set is relevant and what additional documentation must be checked.
- Explain why an answer is correct; store completion and score locally.
- Clearly label cases as educational simulations, not real patient records.

### 3.6 Coding foundations
- Explain the roles of ICD-10-CM, CPT®, and HCPCS Level II.
- Teach a safe high-level workflow: locate, verify, read instructional notes, check specificity and effective date, review applicable modifiers/edits, and document rationale.
- Link to AAPC CPC information, CMS ICD-10 files, CDC ICD-10-CM files, CMS HCPCS quarterly files, and AMA CPT licensing information.
- Do not bundle CPT code tables, descriptors, or derived CPT datasets without the required AMA license.
- Do not present the app as an autonomous production coding engine.

## 4. V1.0 acceptance criteria

- [ ] Existing vocabulary, audio, daily learning, review, and local progress continue to work.
- [ ] CPC Learning Center is accessible from the existing app navigation and home screen.
- [ ] All 22 chapter titles appear in the correct order.
- [ ] Anatomy cards show related textbook chapters and key structures.
- [ ] At least four simulated cases can be completed and scored.
- [ ] Case completion and chapter completion persist locally after app restart.
- [ ] ICD-10-CM, CPT®, and HCPCS Level II are clearly differentiated.
- [ ] Official source links open correctly.
- [ ] Offline dictionary is populated during CI build and can be queried offline.
- [ ] TypeScript check and static Next.js export pass.
- [ ] Android APK build passes and an installable APK is attached to a GitHub Release.
- [ ] Release notes clearly identify the version as beta until device testing is complete.

## 5. Future releases

**V2.0 — Clinical reading:** Longer notes, operative-report extraction, abbreviations, documentation gaps, case difficulty levels, and targeted remediation.

**V3.0 — Coding practice:** Licensed CPT data if obtained, versioned ICD-10-CM and HCPCS datasets, index-to-tabular navigation, modifiers, NCCI concepts, E/M, compliance, and timed CPC-style practice.

## 6. Technical architecture

- Next.js static export + React client components.
- Capacitor Android packaging.
- LocalStorage for on-device study progress.
- Existing lib/book-vocabulary.json and lib/book-words.ts remain the source of textbook vocabulary in the app.
- lib/cpc-curriculum.ts holds the chapter navigator, anatomy map, coding concepts, practice cases, and official links.
- scripts/build-offline-dictionary.py builds a filtered offline dictionary from ECDICT during CI.
- GitHub Actions performs typecheck, static export, audio generation, Android build, artifact upload, and prerelease creation.

## 7. Data, licensing, and safety

- The uploaded textbook is used as the learner's private study source. The app may show chapter titles and concise learning notes; it must not reproduce the book's full pages, proprietary exercises, or extensive definitions.
- ECDICT data is used under its MIT license with attribution.
- CPT® is maintained and copyrighted by the American Medical Association. The app must not include CPT code descriptions or tables unless a suitable license authorizes this use.
- Official code sets change. Every code lookup must display the applicable code-set year/quarter and source.
- Educational cases are fictional. Coding output must not be represented as medical advice, reimbursement guarantees, or a substitute for official coding guidance and human review.

## 8. Release strategy

- Develop on feature/cpc-academy-v1.
- Run validation before opening a pull request to main.
- Build an Android beta APK from the merged main branch.
- Publish a GitHub prerelease with the APK asset and retain the Actions artifact as a secondary download.
- Test installation, audio playback, offline dictionary, local progress persistence, and mobile navigation on Android before declaring V1.0 stable.

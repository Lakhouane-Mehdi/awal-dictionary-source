# Awal Project Report

**Date:** January 11, 2026
**Status:** Active Development (Beta)
**Version:** 0.0.0
**Author:** Developed by Mehdi Lakhouane

## Executive Summary
**Awal** is a sovereign, offline-first Progressive Web Application (PWA) designed to preserve and modernize the Tamazight language. It serves as a comprehensive bridge between Tamazight (Berber) and English, utilizing advanced web technologies to provide a seamless, high-performance user experience without reliance on continuous internet connectivity.

## Core Capabilities

### 1. Universal Dictionary Search
-   **Multi-Script Support**: Users can search using Tifinagh (`ⴰⵣⵓⵍ`), Latin (`Azul`), or Arabic (`أزول`) scripts interchangeably.
-   **Smart Transliteration**: An integrated engine automatically normalizes inputs across scripts for accurate retrieval.
-   **Offline Database**: The entire dictionary is bundled locally, ensuring instant search results with zero latency.

### 2. AI Visual Translator (Scanner)
-   **OCR Integration**: Built with `Tesseract.js` to recognize English text from the camera feed purely in-browser (offline capable).
-   **Real-time Lookup**: Instantly matches scanned English words against the Tamazight dictionary database.
-   **Visual Overlay**: Provides an augmented reality-like experience with a focus frame and scanning animations.

### 3. Linguistic Tools
-   **Verb Conjugator**: A dedicated module for conjugating Tamazight verbs across all tenses and forms.
-   **Interactive Learning**:
    -   **Trace Mode (`Learn.tsx`)**: A canvas-based tool for users to practice writing Tifinagh characters.
    -   **Gamified Quiz (`Quiz.tsx`)**: A vocabulary testing engine using the Fisher-Yates shuffle algorithm for randomized questions.

## Technical Architecture

### Stack & Infrastructure
-   **Frontend**: React 18 with TypeScript for type-safe, component-based UI.
-   **Build System**: Vite for lightning-fast HMR and optimized production builds.
-   **Styling**: Tailwind CSS for a utility-first, responsive design system; Framer Motion for fluid UI animations.
-   **PWA Core**: `vite-plugin-pwa` configuration for installability and service worker caching.
-   **State Management**: React Context (`ScriptContext`) for global preferences (e.g., preferred script display).
-   **Persistence**: `idb-keyval` for lightweight, Promise-based IndexedDB storage (used for Favorites).

### Quality Assurance
-   **Testing**: `Vitest` setup for unit testing key utilities (e.g., script conversion logic).
-   **Linting**: Strict ESLint configuration including `react-hooks` and `react-refresh` rules.

## Recent Accomplishments
-   **Scanner Implementation**: Successfully integrated a camera-based text scanner (`Scan.tsx`) that links directly to dictionary entries.
-   **Search Optimization**: Fixed search filtering issues to ensure deduplicated, relevant results.
-   **Testing Suite**: Verified core utilities with a passing test suite (`npm test`).

## Roadmap
-   [ ] **Optimization**: Further reduce bundle size by optimizing the PDF dictionary asset or converting it to a more efficient JSON structure.
-   [ ] **Expansion**: Add more minigames to the "Tools" section to enhance engagement.
-   [ ] **Deployment**: Finalize Firebase Rules and production deployment pipeline.

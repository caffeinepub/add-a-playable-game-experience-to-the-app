# Specification

## Summary
**Goal:** Add a simple, playable single-player in-browser game to the frontend with a coherent theme and a persistent high-score + global leaderboard tied to Internet Identity principals.

**Planned changes:**
- Add a 2D game experience in the frontend with clear rules, win/lose conditions, and an in-app “start new game” flow (no page reload).
- Implement keyboard controls for desktop and on-screen touch controls for mobile.
- Add gameplay UI elements: visible score, game over state, and restart option (all text in English).
- Implement backend score persistence per signed-in Internet Identity principal (store best score only) and provide a global top leaderboard.
- Update frontend to show: current user best score, global leaderboard, and a clear sign-in-required message when not authenticated.
- Create and apply a consistent visual theme for all game screens (menu, HUD, game over, leaderboard) avoiding blue/purple as primary colors and ensuring mobile readability.

**User-visible outcome:** Users can play a single-player 2D browser game with keyboard/touch controls, see their score and game-over screen with restart, and—when signed in—save their best score and view a global leaderboard; unsigned users are prompted that sign-in is required to save scores.

# Sports Tournament Management System

A beginner-friendly web application designed for collegiate and local sports organizers to manage tournaments, teams, players, fixtures, live scores, and standings, while delivering an authentic Cricbuzz and ESPNcricinfo-inspired sports portal experience for spectators and fans.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following decisions were confirmed by the user in Phase 1 clarification:
> - **Backend & Persistence**: Firebase (Firebase Authentication and Cloud Firestore with real-time updates) instead of Supabase.
> - **Visual & UX Direction**: High-energy sports portal aesthetic taking direct inspiration from **Cricbuzz, ESPNcricinfo, ESPN, Sofascore, and Flashscore** (distinguished Live/Upcoming/Finished filters, live ticker strip, match center scorecard, and responsive standings).
> - **Primary Tournament Showcase**: Preloaded with a marquee **Inter-College Cricket Premier Cup** featuring runs/wickets/overs format, along with support for Football and multi-sport tournaments.
> - **Beginner-Friendly Codebase**: Clean plain JavaScript (`.jsx`), standard `useState`/`useEffect`, readable functions without complex abstractions, accompanied by a comprehensive student README guide.

---

## 1. Overview & Core Concept

- **What It Does**: Provides a dual-sided sports platform:
  1. **Public / Spectator Portal**: Live scores with live badge pulses, match schedule grouped by date, match result summaries, interactive tournament hubs, team roster cards, points tables with calculated rankings (NRR for Cricket, Goal Difference for Football), and an in-depth Match Center.
  2. **Organizer Administration Center**: Secure role-based management suite to create and edit tournaments, register teams and assign captains, maintain player rosters with sport-specific roles, schedule fixtures, and score live matches in real-time.
- **Target Audience / Persona**: College sports directors, student tournament coordinators, coaches, team captains, and campus sports fans tracking matches across mobile and desktop.
- **Key Value**: Replaces scattered WhatsApp updates and spreadsheets with a centralized, professional broadcast portal that students can easily run, present, and modify.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Fan Explores Live Action**:
   - Opens Home or Live page → Sees instant live match strip (scores updating in real-time).
   - Filters by sport (Cricket, Football, Basketball) or status (Live, Upcoming, Finished).
   - Clicks match card → Opens **Match Center** with detailed team scores, overs/minutes played, venue info, and match timeline/commentary events.
2. **Spectator Browses Tournaments & Standings**:
   - Navigates to **Tournaments** → Views active series (e.g., *Reva University Cricket Premier Cup*).
   - Switches between Overview, Fixtures & Results, Teams, and Points Table.
   - Points table dynamically calculates Points, Wins, Losses, Ties, Net Run Rate (Cricket) or Goal Difference (Football).
3. **Organizer Tournament Workflow**:
   - Signs in via Firebase Authentication (Organizer role).
   - Dashboard shows aggregate statistics: Active Tournaments, Total Teams, Scheduled Matches, Live Matches.
   - Quick actions: "+ Create Tournament", "+ Add Team", "+ Add Player", "+ Create Fixture", "Score Match".
   - Opens Match Scoring Modal: inputs live score (e.g., `164/5 (18.2 ov)` vs `158/9 (20.0 ov)`), picks match status (Scheduled, Live, Completed), and records match winner. Firestore broadcasts updates immediately.

### Visual Identity & Theme
- **Aesthetic Direction**: Cricbuzz & ESPNcricinfo broadcast portal with dark sports stadium headers, clean white and slate card sections, bold athletic typography, and electric stadium green (`#00A859`) / warm gold (`#EAB308`) accents.
- **Palette Tokens**:
  - Neutral Canvas: `#0F172A` (Stadium Midnight Navy) and `#F8FAFC` (Clean Day Turf White).
  - Structural Surfaces: `#FFFFFF` (Cards), `#1E293B` (Dark Headers), `#E2E8F0` (Hairline Dividers).
  - Sports Accents: `#00A859` (Cricbuzz Turf Green for Live/Win), `#DC2626` (Live Pulse Crimson), `#2563EB` (ESPN Deep Blue).
- **Typography & Hierarchy**:
  - Display & Headings: `Plus Jakarta Sans` / `Cabinet Grotesk` (clean athletic weight 600/700).
  - Data, Overs, & Scores: Tabular monospace figures (`tabular-nums font-mono`) ensuring numbers align perfectly in scorecards and points tables.
- **Top Bar Contract**:
  - Zone 1: Single brand wordmark (`SPORTSTOURNEY` or `CAMPUS STADIUM`).
  - Zone 2: Clean text navigation links: `Home`, `Live`, `Schedule`, `Results`, `Tournaments`, `Teams`, `Rankings`.
  - Zone 3: Organizer action (`Organizer Login` / `Dashboard` profile pill).

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Firebase Auth & Firestore with Immediate Demo Fallback**:
  - *Chosen Approach*: Provision and integrate Firebase (Auth + Firestore `onSnapshot` real-time listeners). Also include instant sample tournament data preloaded in memory/local fallback so the application works seamlessly on initial boot even before cloud credentials are provisioned.
  - *Why*: Ensures zero blank screens or crashed starts while strictly honoring the user's requirement to use Firebase.
- **Decision 2: Beginner-Friendly Plain JavaScript (`.jsx`)**:
  - *Chosen Approach*: Structure code in clean `.jsx` files using React 19 and standard `useState`/`useEffect`.
  - *Why*: Directly satisfies the prompt instruction: *"DO NOT use TypeScript, Next.js, Redux... The code must be easy for a beginner to read and modify."*
- **Decision 3: Dynamic Client-Side Standings Calculation**:
  - *Chosen Approach*: Do not store stale duplicate tables in the database. Calculate the Points Table dynamically from match outcomes (Points: Win = 2 or 3 depending on sport, NRR calculation for cricket, GD for football).
  - *Why*: Clean normalization; prevents desync when match scores are edited or corrected.
- **Decision 4: Multi-Sport Adaptability**:
  - *Chosen Approach*: Dynamic field rendering based on tournament sport:
    - **Cricket**: Runs / Wickets, Overs, Target, Net Run Rate.
    - **Football**: Goals, Halftime/Fulltime, Goal Difference.
    - **Basketball**: Points, Quarters.

---

## 4. Technical Architecture & Data Strategy

### System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                   SPORTS TOURNAMENT MANAGEMENT SYSTEM                  │
└────────────────────────────────────────────────────────────────────────┘
                                    │
         ┌──────────────────────────┴──────────────────────────┐
         ▼                                                     ▼
┌──────────────────────────────────┐        ┌──────────────────────────────────┐
│      PUBLIC SPORTS PORTAL        │        │      ORGANIZER DASHBOARD         │
│  - Hero Featured Match Banner    │        │  - Quick Metric Counters         │
│  - Live Score Ticker Strip       │        │  - Tournament CRUD Manager       │
│  - Fixtures & Results Calendar   │        │  - Team & Roster Manager         │
│  - Tournament Hub & Standings    │        │  - Fixture Generator             │
│  - Match Center & Commentary     │        │  - Live Score Scoring Engine     │
└──────────────────────────────────┘        └──────────────────────────────────┘
                 │                                           │
                 └────────────────────┬──────────────────────┘
                                      ▼
                      ┌──────────────────────────────┐
                      │    STATE & DATABASE LAYER    │
                      │  - Firebase Auth & Context   │
                      │  - Firestore Real-time Sync  │
                      │  - Dynamic Standings Engine  │
                      │  - Beginner-Friendly README  │
                      └──────────────────────────────┘
```

### Data Model & Firestore Collections

1. **`tournaments`**:
   - `id`, `name`, `sport` (`cricket` | `football` | `basketball`), `location`, `startDate`, `endDate`, `status` (`upcoming` | `ongoing` | `completed`), `description`, `createdAt`.
2. **`teams`**:
   - `id`, `tournamentId`, `name`, `shortName`, `captain`, `contact`, `logoUrl`, `playersCount`, `createdAt`.
3. **`players`**:
   - `id`, `teamId`, `tournamentId`, `name`, `jerseyNumber`, `role` (`batter` | `bowler` | `all-rounder` | `wicketkeeper` | `forward` | `defender` | `goalkeeper` | etc.), `photoUrl`.
4. **`matches`**:
   - `id`, `tournamentId`, `teamAId`, `teamBId`, `matchDate`, `matchTime`, `venue`, `status` (`scheduled` | `live` | `completed`), `teamAScore`, `teamBScore`, `teamAOvers`, `teamBOvers`, `teamAWickets`, `teamBWickets`, `resultSummary`, `currentInnings`, `timelineEvents`, `createdAt`.
5. **`users` / `profiles`**:
   - `uid`, `email`, `displayName`, `role` (`organizer` | `viewer`), `createdAt`.

### Step-by-Step Implementation Strategy

1. **Firebase Configuration & Provisioning**:
   - Follow `firebase-integration-rpc` guidelines: provision Firebase, define `firebase-blueprint.json` and generate hardened `firestore.rules`.
2. **Project Setup & Dependencies**:
   - Ensure `firebase` npm package is installed.
   - Configure Tailwind CSS styles for sports portal typography and crisp scorecards.
3. **Core Services & State**:
   - `src/firebase.js`: Firebase app initialization, Firestore, and Auth.
   - `src/services/tournamentService.js`: Simple, human-readable helper functions (`getTournaments`, `createTournament`, `getMatches`, `updateScore`, `calculatePointsTable`).
   - `src/data/sampleCricketData.js`: Rich, authentic preloaded cricket tournament data (Reva Cricket Premier Cup, Bangalore Blasters, Deccan Dynamos, etc.).
4. **Public Viewer Components & Pages**:
   - `Navbar.jsx`: Cricbuzz-inspired header with navigation links and active tabs.
   - `Home.jsx`: Hero featured match, live ticker cards, upcoming fixtures, recent results, tournament showcases.
   - `Live.jsx`: Dedicated Sofascore-style live matches hub with real-time score updates.
   - `Schedule.jsx`: Matches organized by date with filters for sport and tournament.
   - `Results.jsx`: Completed match cards with winning margins and score breakdowns.
   - `Tournaments.jsx` & `TournamentDetails.jsx`: Tournament overview, matches, teams, and points table with NRR calculation.
   - `Teams.jsx` & `TeamDetails.jsx`: Team cards, squads, win-loss records.
   - `MatchCenter.jsx`: Deep match view with detailed scores, overs, run rate, venue, and ball-by-ball/timeline notes.
5. **Organizer Management Suite**:
   - `Login.jsx` & `Register.jsx`: Simple authentication with demo quick-login for easy teacher/student demonstration.
   - `Dashboard.jsx`: Organizer control room with stats and quick actions.
   - `ManageTournaments.jsx`, `ManageTeams.jsx`, `ManagePlayers.jsx`, `ManageFixtures.jsx`, `ScoreMatchModal.jsx`.
6. **Documentation & Student Modification Guide**:
   - `README.md`: Complete beginner-friendly guide covering installation, Firebase setup, step-by-step modification guide (changing colors, changing points formula, adding fields).
7. **Verification**:
   - Run compilation and verify all routes, modal handlers, scoring updates, and standings calculations work smoothly.

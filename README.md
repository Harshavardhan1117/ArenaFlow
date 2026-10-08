# ARENAFLOW - TOURNAMENT MANAGEMENT PLATFORM

A clean, beginner-friendly sports tournament management web application built with **React**, **JavaScript**, **Vite**, **Tailwind CSS**, and **Firebase** (Authentication & Cloud Firestore with real-time updates).

Designed as an authentic sports management product inspired by platforms like **TeamSnap**, **Playpass**, **Tournify**, **Sofascore**, and **Cricbuzz**.

---

## Project Overview

ArenaFlow provides a centralized platform for sports organizers and spectators:

1. **Viewer Portal**: Fans can check live matches, upcoming fixtures, completed results, tournament rosters, and calculated league standings.
2. **Organizer Administration**: Tournament directors can create competitions, register teams, manage squad rosters, generate fixtures, and record live scores.

---

## Features

- **Clean Homepage Hierarchy**: Page Hero -> Live Matches -> Upcoming Matches -> Recent Results -> Tournaments -> Standings.
- **Match Cards**: Clean scoreboard format with scores, status, venue, date, and direct Match Center link.
- **Tournament Pages**: Overview, Matches, Teams, and Standings tabs with whitespace and clear section separation.
- **Organizer Dashboard**: Management system with a compact sidebar (Dashboard, Tournaments, Teams, Players, Fixtures, Matches, Standings, Settings).
- **Tabular Admin Screens**: Compact management tables with search inputs and clean action buttons.
- **Points Table**: Dynamic calculation of Points, Goal Difference (Football), and Net Run Rate (Cricket).
- **Authentication**: Firebase Authentication with email/password and a 1-click Demo Organizer mode for presentation.

---

## Folder Structure

```text
├── firebase-applet-config.json     # Firebase configuration
├── firebase-blueprint.json         # Data model intermediate representation
├── firestore.rules                 # Cloud Firestore security rules
├── index.html                      # HTML entry
├── package.json                    # Project dependencies
├── src/
│   ├── App.jsx                     # Application routing & real-time sync
│   ├── firebase.js                 # Firebase SDK initialization
│   ├── index.css                   # Theme CSS variables & semantic classes
│   ├── components/
│   │   ├── MatchCard.jsx           # Clean match card component
│   │   ├── Navbar.jsx              # Clean header with ARENaflow wordmark
│   │   ├── PointsTable.jsx         # Standings table (NRR and GD)
│   │   ├── ScoreMatchModal.jsx     # Live score updater modal
│   │   ├── TeamCard.jsx            # Team franchise card
│   │   └── TournamentCard.jsx      # Competition card
│   ├── context/
│   │   └── AuthContext.jsx         # Firebase Auth & role verification hook
│   ├── data/
│   │   └── sampleData.js           # Sample preloaded tournaments and fixtures
│   ├── pages/
│   │   ├── Dashboard.jsx           # Organizer console with sidebar and tables
│   │   ├── Home.jsx                # Clean homepage
│   │   ├── Live.jsx                # Live scores hub
│   │   ├── Login.jsx               # Organizer sign in + demo mode
│   │   ├── MatchCenter.jsx         # Match details and timeline
│   │   ├── Rankings.jsx            # League standings page
│   │   ├── Register.jsx            # Account registration
│   │   ├── Results.jsx             # Concluded match results
│   │   ├── Schedule.jsx            # Matches grouped by date
│   │   ├── TeamDetails.jsx         # Squad roster and history
│   │   ├── Teams.jsx               # Teams directory
│   │   └── TournamentDetails.jsx   # Tournament competition hub
│   └── services/
│       └── tournamentService.js    # Data CRUD & points table calculation
```

---

## Installation & Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

---

## HACKATHON ON-THE-SPOT MODIFICATION GUIDE

Team members can make common changes in under a minute using this reference:

### 1. Change Main Colors
Open `src/index.css`. The color variables are located at the very top:
```css
:root {
  --primary-color: #0f172a;       /* Deep navy / dark slate */
  --accent-color: #059669;        /* Clean athletic green */
  --background-color: #f8fafc;    /* Very light gray / off-white */
  --surface-card: #ffffff;        /* Pure white card backgrounds */
}
```

### 2. Change Application Name
Open `src/components/Navbar.jsx` lines 39-44:
```jsx
<span className="text-base font-bold text-slate-900 tracking-tight block">
  ARENaflow
</span>
<span className="text-[11px] text-slate-500 font-normal block">
  Tournament Management Platform
</span>
```

### 3. Change Points for a Win or Tie
Open `src/services/tournamentService.js` and locate lines 96-125:
```javascript
// Cricket Points
if (runsA > runsB) {
  teamAStats.points += 2; // Change points for a cricket win
} else if (runsB > runsA) {
  teamBStats.points += 2;
} else {
  teamAStats.points += 1; // Change points for a tie
}

// Football Points
if (scoreA > scoreB) {
  teamAStats.points += 3; // Change points for a football win
}
```

### 4. Change Card Border Radius
Open `src/index.css`:
```css
--radius-md: 8px;
--radius-lg: 10px;
```

### 5. Add a New Navigation Link
1. In `src/components/Navbar.jsx`, add to `navLinks`:
   ```javascript
   { id: 'rules', label: 'Rules' }
   ```
2. In `src/App.jsx`, render the page under `<main>`:
   ```jsx
   {activePage === 'rules' && <RulesPage />}
   ```

### 6. Add a New Field to a Tournament or Team
1. In `src/pages/Dashboard.jsx`, add a state:
   ```javascript
   const [tSponsor, setTSponsor] = useState('');
   ```
2. Add the `<input>` inside the form with its label above.
3. In `handleSaveTournamentSubmit`, include `sponsor: tSponsor`.

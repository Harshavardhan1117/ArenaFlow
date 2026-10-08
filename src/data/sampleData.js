// Sample initial data for sports tournaments, teams, players, and matches
// Beginners can easily modify or add new data here!

export const INITIAL_TOURNAMENTS = [
  {
    id: "tourney-cricket-1",
    name: "Reva Inter-College Cricket Championship 2026",
    sport: "Cricket",
    location: "Reva University Sports Complex, Bengaluru",
    startDate: "2026-10-05",
    endDate: "2026-10-20",
    description: "The 8th annual 20-over collegiate cricket cup featuring top Karnataka universities competing for the Chancellor's Trophy.",
    status: "ongoing",
    createdAt: new Date("2026-10-01").toISOString()
  },
  {
    id: "tourney-football-1",
    name: "State Inter-Varsity Football Cup 2026",
    sport: "Football",
    location: "Central University Stadium Ground, Bengaluru",
    startDate: "2026-10-12",
    endDate: "2026-10-25",
    description: "Premier college football league championship featuring group stages followed by knockouts.",
    status: "ongoing",
    createdAt: new Date("2026-10-02").toISOString()
  },
  {
    id: "tourney-basketball-1",
    name: "All-College Basketball Championship",
    sport: "Basketball",
    location: "Indoor Sports Dome, Court 1",
    startDate: "2026-10-22",
    endDate: "2026-10-30",
    description: "Fast-paced university basketball showdown with 8 collegiate teams.",
    status: "upcoming",
    createdAt: new Date("2026-10-03").toISOString()
  }
];

export const INITIAL_TEAMS = [
  // Cricket Teams
  {
    id: "team-rr",
    tournamentId: "tourney-cricket-1",
    name: "Reva Royals",
    shortName: "RR",
    captain: "Rohit Krishnan",
    contact: "+91 98450 12345",
    playersCount: 15,
    logoUrl: "",
    color: "#2563EB", // Royal Blue
    createdAt: new Date().toISOString()
  },
  {
    id: "team-bb",
    tournamentId: "tourney-cricket-1",
    name: "Bangalore Blasters",
    shortName: "BB",
    captain: "Virat Patel",
    contact: "+91 98450 12346",
    playersCount: 15,
    logoUrl: "",
    color: "#DC2626", // Crimson Red
    createdAt: new Date().toISOString()
  },
  {
    id: "team-dd",
    tournamentId: "tourney-cricket-1",
    name: "Deccan Dynamos",
    shortName: "DD",
    captain: "Rahul Verma",
    contact: "+91 98450 12347",
    playersCount: 15,
    logoUrl: "",
    color: "#D97706", // Amber
    createdAt: new Date().toISOString()
  },
  {
    id: "team-tw",
    tournamentId: "tourney-cricket-1",
    name: "Titan Warriors",
    shortName: "TW",
    captain: "MS Ashwin",
    contact: "+91 98450 12348",
    playersCount: 15,
    logoUrl: "",
    color: "#059669", // Emerald Green
    createdAt: new Date().toISOString()
  },

  // Football Teams
  {
    id: "team-thunder-fc",
    tournamentId: "tourney-football-1",
    name: "Thunder FC",
    shortName: "THU",
    captain: "Alex Silva",
    contact: "+91 98450 55501",
    playersCount: 18,
    logoUrl: "",
    color: "#4F46E5",
    createdAt: new Date().toISOString()
  },
  {
    id: "team-titans-fc",
    tournamentId: "tourney-football-1",
    name: "Titans FC",
    shortName: "TIT",
    captain: "Marcus Bell",
    contact: "+91 98450 55502",
    playersCount: 18,
    logoUrl: "",
    color: "#EA580C",
    createdAt: new Date().toISOString()
  },
  {
    id: "team-eagles-fc",
    tournamentId: "tourney-football-1",
    name: "Eagles FC",
    shortName: "EAG",
    captain: "David K",
    contact: "+91 98450 55503",
    playersCount: 18,
    logoUrl: "",
    color: "#0284C7",
    createdAt: new Date().toISOString()
  },
  {
    id: "team-warriors-fc",
    tournamentId: "tourney-football-1",
    name: "Warriors FC",
    shortName: "WAR",
    captain: "Ken Tanaka",
    contact: "+91 98450 55504",
    playersCount: 18,
    logoUrl: "",
    color: "#7C3AED",
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_PLAYERS = [
  // Reva Royals Squad
  { id: "p-rr-1", teamId: "team-rr", tournamentId: "tourney-cricket-1", name: "Rohit Krishnan (C)", jerseyNumber: "45", role: "Batter", photoUrl: "", createdAt: new Date().toISOString() },
  { id: "p-rr-2", teamId: "team-rr", tournamentId: "tourney-cricket-1", name: "Siddharth Rao (WK)", jerseyNumber: "7", role: "Wicketkeeper", photoUrl: "", createdAt: new Date().toISOString() },
  { id: "p-rr-3", teamId: "team-rr", tournamentId: "tourney-cricket-1", name: "Aditya Nair", jerseyNumber: "18", role: "Batter", photoUrl: "", createdAt: new Date().toISOString() },
  { id: "p-rr-4", teamId: "team-rr", tournamentId: "tourney-cricket-1", name: "Hardik Hegde", jerseyNumber: "33", role: "All-rounder", photoUrl: "", createdAt: new Date().toISOString() },
  { id: "p-rr-5", teamId: "team-rr", tournamentId: "tourney-cricket-1", name: "Jasprit Gowda", jerseyNumber: "93", role: "Bowler", photoUrl: "", createdAt: new Date().toISOString() },
  { id: "p-rr-6", teamId: "team-rr", tournamentId: "tourney-cricket-1", name: "Yuzvendra Som", jerseyNumber: "3", role: "Bowler", photoUrl: "", createdAt: new Date().toISOString() },

  // Bangalore Blasters Squad
  { id: "p-bb-1", teamId: "team-bb", tournamentId: "tourney-cricket-1", name: "Virat Patel (C)", jerseyNumber: "18", role: "Batter", photoUrl: "", createdAt: new Date().toISOString() },
  { id: "p-bb-2", teamId: "team-bb", tournamentId: "tourney-cricket-1", name: "K.L. Raghu (WK)", jerseyNumber: "1", role: "Wicketkeeper", photoUrl: "", createdAt: new Date().toISOString() },
  { id: "p-bb-3", teamId: "team-bb", tournamentId: "tourney-cricket-1", name: "Glenn Shinde", jerseyNumber: "32", role: "All-rounder", photoUrl: "", createdAt: new Date().toISOString() },
  { id: "p-bb-4", teamId: "team-bb", tournamentId: "tourney-cricket-1", name: "Mohammed Sirajuddin", jerseyNumber: "73", role: "Bowler", photoUrl: "", createdAt: new Date().toISOString() },
  { id: "p-bb-5", teamId: "team-bb", tournamentId: "tourney-cricket-1", name: "Rajat Patidar", jerseyNumber: "88", role: "Batter", photoUrl: "", createdAt: new Date().toISOString() },

  // Deccan Dynamos Squad
  { id: "p-dd-1", teamId: "team-dd", tournamentId: "tourney-cricket-1", name: "Rahul Verma (C)", jerseyNumber: "19", role: "Batter", photoUrl: "", createdAt: new Date().toISOString() },
  { id: "p-dd-2", teamId: "team-dd", tournamentId: "tourney-cricket-1", name: "Sanju Varma (WK)", jerseyNumber: "11", role: "Wicketkeeper", photoUrl: "", createdAt: new Date().toISOString() },
  { id: "p-dd-3", teamId: "team-dd", tournamentId: "tourney-cricket-1", name: "Ravindra Jadeja Jr", jerseyNumber: "8", role: "All-rounder", photoUrl: "", createdAt: new Date().toISOString() },
  { id: "p-dd-4", teamId: "team-dd", tournamentId: "tourney-cricket-1", name: "Bhuvneshwar Kumar", jerseyNumber: "15", role: "Bowler", photoUrl: "", createdAt: new Date().toISOString() },

  // Titan Warriors Squad
  { id: "p-tw-1", teamId: "team-tw", tournamentId: "tourney-cricket-1", name: "MS Ashwin (C)", jerseyNumber: "7", role: "Wicketkeeper", photoUrl: "", createdAt: new Date().toISOString() },
  { id: "p-tw-2", teamId: "team-tw", tournamentId: "tourney-cricket-1", name: "Shubman Gill Jr", jerseyNumber: "77", role: "Batter", photoUrl: "", createdAt: new Date().toISOString() },
  { id: "p-tw-3", teamId: "team-tw", tournamentId: "tourney-cricket-1", name: "Rashid Pathan", jerseyNumber: "19", role: "All-rounder", photoUrl: "", createdAt: new Date().toISOString() },
  { id: "p-tw-4", teamId: "team-tw", tournamentId: "tourney-cricket-1", name: "Mohammed Shami", jerseyNumber: "11", role: "Bowler", photoUrl: "", createdAt: new Date().toISOString() }
];

export const INITIAL_MATCHES = [
  // 1. LIVE CRICKET MATCH (Featured Marquee Match)
  {
    id: "match-cric-live-1",
    tournamentId: "tourney-cricket-1",
    teamAId: "team-bb",
    teamBId: "team-rr",
    matchDate: "2026-10-07",
    matchTime: "17:30",
    venue: "Main Oval Grounds, Pitch 1",
    status: "live",
    teamAScore: "162/8",
    teamBScore: "158/4",
    teamAOvers: "20.0",
    teamBOvers: "18.2",
    teamAWickets: "8",
    teamBWickets: "4",
    resultSummary: "Reva Royals need 5 runs in 10 balls to win",
    currentInnings: "2nd Innings - Reva Royals batting",
    timelineEvents: [
      { over: "18.2", text: "FOUR! Driven crisply through extra cover by Rohit Krishnan.", type: "boundary" },
      { over: "18.1", text: "1 run. Tucked away softly towards mid-wicket.", type: "run" },
      { over: "17.6", text: "DOT ball. Well bowled yorker outside off stump.", type: "dot" },
      { over: "17.5", text: "SIX! Massive strike over deep mid-wicket into the student gallery!", type: "boundary" },
      { over: "17.1", text: "WICKET! Caught at long-off! Hardik Hegde miscues high in the air.", type: "wicket" },
      { over: "End of 17th", text: "Reva Royals 147/3. Target: 163 runs.", type: "summary" }
    ],
    createdAt: new Date("2026-10-07T10:00:00Z").toISOString()
  },

  // 2. COMPLETED CRICKET MATCH 1
  {
    id: "match-cric-comp-1",
    tournamentId: "tourney-cricket-1",
    teamAId: "team-dd",
    teamBId: "team-tw",
    matchDate: "2026-10-06",
    matchTime: "14:00",
    venue: "Main Oval Grounds, Pitch 2",
    status: "completed",
    teamAScore: "184/6",
    teamBScore: "152/9",
    teamAOvers: "20.0",
    teamBOvers: "20.0",
    teamAWickets: "6",
    teamBWickets: "9",
    resultSummary: "Deccan Dynamos won by 32 runs",
    currentInnings: "Match Ended",
    timelineEvents: [
      { over: "20.0", text: "Match completed. Deccan Dynamos seal a commanding 32-run victory.", type: "summary" },
      { over: "19.6", text: "WICKET! Clean bowled by Bhuvneshwar Kumar on the final ball.", type: "wicket" },
      { over: "15.3", text: "Player of the Match: Rahul Verma for his 74 off 42 balls.", type: "award" }
    ],
    createdAt: new Date("2026-10-06T09:00:00Z").toISOString()
  },

  // 3. COMPLETED CRICKET MATCH 2
  {
    id: "match-cric-comp-2",
    tournamentId: "tourney-cricket-1",
    teamAId: "team-bb",
    teamBId: "team-tw",
    matchDate: "2026-10-05",
    matchTime: "18:00",
    venue: "Reva Floodlit Stadium",
    status: "completed",
    teamAScore: "195/4",
    teamBScore: "191/7",
    teamAOvers: "20.0",
    teamBOvers: "20.0",
    teamAWickets: "4",
    teamBWickets: "7",
    resultSummary: "Bangalore Blasters won by 4 runs",
    currentInnings: "Match Ended",
    timelineEvents: [
      { over: "20.0", text: "Thrilling finish! Bangalore Blasters defend 8 runs in the final over.", type: "summary" }
    ],
    createdAt: new Date("2026-10-05T09:00:00Z").toISOString()
  },

  // 4. UPCOMING CRICKET MATCH 1
  {
    id: "match-cric-up-1",
    tournamentId: "tourney-cricket-1",
    teamAId: "team-rr",
    teamBId: "team-dd",
    matchDate: "2026-10-08",
    matchTime: "15:30",
    venue: "Main Oval Grounds, Pitch 1",
    status: "scheduled",
    teamAScore: "",
    teamBScore: "",
    teamAOvers: "",
    teamBOvers: "",
    teamAWickets: "",
    teamBWickets: "",
    resultSummary: "Match yet to begin",
    currentInnings: "Scheduled",
    timelineEvents: [],
    createdAt: new Date("2026-10-07T08:00:00Z").toISOString()
  },

  // 5. UPCOMING CRICKET MATCH 2
  {
    id: "match-cric-up-2",
    tournamentId: "tourney-cricket-1",
    teamAId: "team-bb",
    teamBId: "team-dd",
    matchDate: "2026-10-10",
    matchTime: "18:00",
    venue: "Reva Floodlit Stadium",
    status: "scheduled",
    teamAScore: "",
    teamBScore: "",
    teamAOvers: "",
    teamBOvers: "",
    teamAWickets: "",
    teamBWickets: "",
    resultSummary: "Match yet to begin",
    currentInnings: "Scheduled",
    timelineEvents: [],
    createdAt: new Date("2026-10-07T08:00:00Z").toISOString()
  },

  // 6. FOOTBALL MATCHES
  {
    id: "match-foot-comp-1",
    tournamentId: "tourney-football-1",
    teamAId: "team-thunder-fc",
    teamBId: "team-titans-fc",
    matchDate: "2026-10-06",
    matchTime: "16:00",
    venue: "University Main Ground",
    status: "completed",
    teamAScore: "2",
    teamBScore: "1",
    teamAOvers: "",
    teamBOvers: "",
    teamAWickets: "",
    teamBWickets: "",
    resultSummary: "Thunder FC won 2 - 1",
    currentInnings: "Full Time (90')",
    timelineEvents: [
      { over: "90'", text: "Full Time: Thunder FC 2 - 1 Titans FC", type: "summary" },
      { over: "78'", text: "GOAL! Thunder FC takes the lead via Alex Silva strike.", type: "goal" },
      { over: "54'", text: "Yellow card issued to Titans FC defender.", type: "card" },
      { over: "32'", text: "GOAL! Titans FC equalizes 1 - 1.", type: "goal" }
    ],
    createdAt: new Date("2026-10-06T10:00:00Z").toISOString()
  },
  {
    id: "match-foot-sched-1",
    tournamentId: "tourney-football-1",
    teamAId: "team-eagles-fc",
    teamBId: "team-warriors-fc",
    matchDate: "2026-10-09",
    matchTime: "17:00",
    venue: "University Main Ground",
    status: "scheduled",
    teamAScore: "",
    teamBScore: "",
    teamAOvers: "",
    teamBOvers: "",
    teamAWickets: "",
    teamBWickets: "",
    resultSummary: "Fixture scheduled",
    currentInnings: "Scheduled",
    timelineEvents: [],
    createdAt: new Date("2026-10-07T08:00:00Z").toISOString()
  }
];

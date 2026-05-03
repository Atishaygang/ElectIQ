export const TIMELINE_STEPS = [
  { id: 1, title: "Election Commission Announcement", desc: "ECI announces the schedule, dates, and phases of the upcoming election.", rule: "Must be announced well in advance", duration: "1 day", status: 'completed' },
  { id: 2, title: "Model Code of Conduct Begins", desc: "Immediate effect after announcement. Guidelines for political parties and candidates.", rule: "Govt cannot announce new projects", duration: "Until results", status: 'completed' },
  { id: 3, title: "Voter List Finalization", desc: "Updating the electoral roll, adding new voters, removing deceased.", rule: "Cutoff date usually before nomination", duration: "Continuous", status: 'completed' },
  { id: 4, title: "Nomination Filing (Form 2B)", desc: "Candidates file their nomination papers along with an affidavit.", rule: "Must disclose assets and criminal records", duration: "7 days", status: 'current' },
  { id: 5, title: "Scrutiny of Nominations", desc: "Returning Officer checks the validity of the filed nomination papers.", rule: "Can be rejected for incomplete info", duration: "1-2 days", status: 'upcoming' },
  { id: 6, title: "Withdrawal of Candidature", desc: "Candidates can voluntarily withdraw their names from the contest.", rule: "Notice must be given in writing", duration: "2 days", status: 'upcoming' },
  { id: 7, title: "Campaign Period", desc: "Parties and candidates campaign to win over voters.", rule: "Strict expenditure limits apply", duration: "14-21 days", status: 'upcoming' },
  { id: 8, title: "Campaign Silence Period", desc: "All public campaigning must stop 48 hours before polling begins.", rule: "Section 126 of RPA 1951", duration: "48 hours", status: 'upcoming' },
  { id: 9, title: "Polling Day", desc: "Voters cast their vote using Electronic Voting Machines (EVMs).", rule: "Requires Voter ID or approved document", duration: "1 day (per phase)", status: 'upcoming' },
  { id: 10, title: "EVM Sealing & Storage", desc: "EVMs are sealed and transported to secure strong rooms under guard.", rule: "Accompanied by party agents", duration: "1-2 days", status: 'upcoming' },
  { id: 11, title: "Vote Counting", desc: "Votes are counted transparently under the supervision of the Returning Officer.", rule: "VVPAT matching can happen", duration: "1 day", status: 'upcoming' },
  { id: 12, title: "Result Declaration & Oath", desc: "ECI publishes final results, and winning candidates are issued certificates.", rule: "Marks the end of the election process", duration: "Immediate", status: 'upcoming' },
];

export const TURNOUT_DATA = [
  { year: '1952', turnout: 45.7 },
  { year: '1977', turnout: 60.5 },
  { year: '1999', turnout: 59.9 },
  { year: '2014', turnout: 66.4 },
  { year: '2019', turnout: 67.4 },
  { year: '2024', turnout: 65.8 },
];

export const QUIZ_QUESTIONS_MAP = {
  basic: [
    { text: "How many Lok Sabha seats are there?", options: ["543", "545", "500", "550"], correct: 0, expl: "There are currently 543 elected constituencies in the Lok Sabha." },
    { text: "Who conducts elections in India?", options: ["Supreme Court", "Parliament", "Election Commission of India", "President"], correct: 2, expl: "The ECI is an autonomous constitutional authority." },
    { text: "What is the voting age in India?", options: ["21", "18", "16", "25"], correct: 1, expl: "Reduced from 21 to 18 by the 61st Amendment Act, 1988." }
  ],
  intermediate: [
    { text: "What is Form 7B?", options: ["New Voter Regis.", "Withdrawal of Candidature", "Complaint Form", "Victory Cert."], correct: 1, expl: "Form 7B is used by candidates to officially withdraw." },
    { text: "What is NOTA?", options: ["None of the Above", "National Order to Arrive", "New Opinion Test Act", "No Objections"], correct: 0, expl: "NOTA allows voters to express dissatisfaction securely." },
    { text: "What is the minimum age to contest for Lok Sabha?", options: ["35", "30", "25", "21"], correct: 2, expl: "Article 84(b) of Constitution sets the age at 25." }
  ],
  advanced: [
    { text: "What is Section 126 of RPA 1951?", options: ["Disqualification", "Silence Period before polling", "Campaign rules", "Voting rights"], correct: 1, expl: "Prohibits campaigning within 48 hours of poll closing." },
    { text: "What is a returning officer's role?", options: ["Count votes only", "Manage constituency election", "Guard EVM", "Print ballots"], correct: 1, expl: "The RO is the head of the election process in a constituency." }
  ]
};

export const ELECTION_TYPES = [
  { title: "Lok Sabha", desc: "General Elections for Prime Minister", color: "from-saffron to-orange-600" },
  { title: "Rajya Sabha", desc: "Council of States (Indirectly elected)", color: "from-purple-600 to-indigo-600" },
  { title: "Vidhan Sabha", desc: "State Assembly for Chief Minister", color: "from-green to-emerald-600" },
  { title: "Local Body", desc: "Panchayat & Municipal Elections", color: "from-blue-600 to-cyan-600" }
];

export const REGISTRATION_STEPS = [
  "Visit voters.eci.gov.in or download Voter Helpline App",
  "Register/Login to your account",
  "Click on 'New Voter Registration (Form 6)'",
  "Upload Passport size photograph",
  "Upload Address Proof and Age Proof documents",
  "Submit and note down Reference ID to track status"
];

export const HELPLINE_NUMBERS = {
  voterHelpline: "1950",
  tollFree: "1800-111-950"
};

export interface DebateRecord {
  id: number;
  uid: string;
  date: string;
  legacy_date: string;
  position: string;
  points: number;
  speaks: number;
  infoslide: string;
  motion: string;
  categories: Array<string>;
  tournament: string;
  tournament_id: string;
  partner: string;
  format: string;
  has_reply: boolean;
  reply: number;
  order: number;
}

export interface OutroundRecord {
  id: number;
  uid: string;
  date: string;
  position: string;
  round_name: string;
  round_short_name: string;
  infoslide: string;
  motion: string;
  categories: Array<string>;
  tournament: string;
  tournament_id: string;
  partner: string;
  format: string;
  has_reply: boolean;
  reply: number;
  order: number;
  advancing: boolean;
}

export interface TournamentRecord {
  id: number;
  name: string;
  speaker_standing: number;
  team_standing: number;
  rooms: number;
  date: string;
  partner: string;
  format: string;
  avg_speaks: number;
  total_points: number;
  tab_url: string;
}

export interface DebateResponse {
  debates: DebateRecord[];
}

export type Category =
  | "Africa"
  | "Animal Rights"
  | "Art"
  | "Artificial Intelligence"
  | "Asia"
  | "Australia"
  | "Charity"
  | "Children"
  | "Cities"
  | "Climate Change"
  | "Colonialism"
  | "Criminal Justice"
  | "Culture"
  | "Cybersecurity"
  | "Democracy"
  | "Development"
  | "Disability Rights"
  | "Drugs"
  | "Economics"
  | "Education/Academia"
  | "Elderly/Aging"
  | "Energy"
  | "Environment"
  | "Ethics"
  | "Europe"
  | "Feminism"
  | "Healthcare"
  | "Historical Memory"
  | "Housing"
  | "Human Rights"
  | "Immigration"
  | "Indigenous People"
  | "International Relations"
  | "Labor"
  | "Latin America"
  | "Law"
  | "LGBTQ+"
  | "Media"
  | "Medical"
  | "Mental Health"
  | "Middle East"
  | "Military"
  | "Minority Communities"
  | "Nationalism"
  | "Philosophy"
  | "Police"
  | "Policy"
  | "Politics"
  | "Privacy"
  | "Private Property"
  | "Refugees/Asylum"
  | "Religion"
  | "Romance/Sex"
  | "Romance/Sexuality"
  | "Science/Technology"
  | "Social Justice"
  | "Social Policy"
  | "Sports"
  | "Terrorism"
  | "Trade";
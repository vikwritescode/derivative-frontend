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
}

export interface DebateResponse {
  debates: DebateRecord[];
}
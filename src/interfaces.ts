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
}

export interface TournamentRecord {
  id: number;
  name: string;
  speaker_standing: number;
  team_standing: number;
  rooms: number;
  date: string;
  partner: string;
}

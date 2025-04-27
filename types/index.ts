export type Sport = 'pickleball' | 'tennis';

export interface ScoreState {
  sport: Sport;
  teamAScore: string | number;
  teamBScore: string | number;
  teamAName: string;
  teamBName: string;
  teamAServing?: boolean;
  gameHistory: GamePoint[];
  currentGame: number;
  isMatchPoint: boolean;
}

export interface GamePoint {
  timestamp: number;
  teamAScore: string | number;
  teamBScore: string | number;
  teamAServing?: boolean;
  game: number;
}

export interface Match {
  id: string;
  sport: Sport;
  date: string;
  teamAName: string;
  teamBName: string;
  teamAFinalScore: string | number;
  teamBFinalScore: string | number;
  games: GamePoint[][];
  winner: 'A' | 'B' | null;
}

export interface AppSettings {
  announcementVolume: number;
  announcementVoice: string;
  recognitionSensitivity: number;
  accentType: string;
  enableHaptics: boolean;
  enableBackgroundNoiseCancellation: boolean;
  autoEndMatches: boolean;
}
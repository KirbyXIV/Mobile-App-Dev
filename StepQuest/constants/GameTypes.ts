export type BossType = 'consistency' | 'timed' | 'speed' | 'exploration';

export interface Boss {
  id: string;
  name: string;
  type: BossType;
  health: number;
  maxHealth: number;
  description: string;
}

export type TerritoryStatus = 'neutral' | 'enemy' | 'conquered' | 'locked';

export interface Territory {
  id: string;
  // Top-left coordinate of the grid square
  coords: {
    latitude: number;
    longitude: number;
  }[]; 
  status: TerritoryStatus;
  boss?: Boss;
}

export interface GameState {
  dailySteps: number;
  dailyStepGoal: number;
  activeBattle?: {
    bossId: string;
    bossName: string;
    currentHp: number;
    maxHp: number;
  };
}
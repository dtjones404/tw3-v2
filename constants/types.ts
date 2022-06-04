import { factionList } from './factionList';

export interface IFactionData {
  name: Faction;
  gamesPlayed: number;
  gamesWon: number;
  matchups: IMatchups;
}

export interface IMatchups {
  Empire: number;
  Dwarfs: number;
  VampireCounts: number;
  Greenskins: number;
  WarriorsOfChaos: number;
  Bretonnia: number;
  Beastmen: number;
  WoodElves: number;
  Norsca: number;
  HighElves: number;
  DarkElves: number;
  Lizardmen: number;
  Skaven: number;
  TombKings: number;
  VampireCoast: number;
  Kislev: number;
  GrandCathay: number;
  Khorne: number;
  Nurgle: number;
  Slaanesh: number;
  Tzeentch: number;
  OgreKingdoms: number;
  DaemonsOfChaos: number;
}

export type Faction = typeof factionList[number];

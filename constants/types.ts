export interface IFaction {
  name: string;
  displayName: string;
  matchups: IMatchups;
}

export interface IMatchups {
  vsEmpire: number;
  vsDwarfs: number;
  vsVampireCounts: number;
  vsGreenskins: number;
  vsWarriorsOfChaos: number;
  vsBretonnia: number;
  vsBeastmen: number;
  vsWoodElves: number;
  vsNorsca: number;
  vsHighElves: number;
  vsDarkElves: number;
  vsLizardmen: number;
  vsSkaven: number;
  vsTombKings: number;
  vsVampireCoast: number;
  vsKislev: number;
  vsGrandCathay: number;
  vsKhorne: number;
  vsNurgle: number;
  vsSlaanesh: number;
  vsTzeentch: number;
  vsOgreKingdoms: number;
  vsDaemonsOfChaos: number;
}

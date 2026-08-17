export interface ITeam {
  teamId: number;
  teamName: string;
  departmentId: number | null;
  departmentName: string;
  teamLeaderId: number | null;
  teamLeaderName: string;
  teamTarget: number | null;
}

export interface ICreateTeam {
  teamId: number;
  teamName: string;
  departmentId: number | null;
  teamLeaderId: number | null;
  teamTarget: number | null;
  entryBy: number;
  entryDate: string;
  companyId: number;
  createTeamDetailListDtos: ICreateTeamDetail[];
}

export interface IUpdateTeam {
  teamId: number;
  teamName: string;
  departmentId: number | null;
  teamLeaderId: number | null;
  teamTarget: number | null;
}
export interface IDeleteTeam {
  teamId: number;
}

export interface IProcessTeamTeamDetail {
  createTeamCommand: ICreateTeam[];
  updateTeamCommand: IUpdateTeam[];
  deleteTeamCommand: any[]; // eida apatoto lagbena, khali array jaabe tai model nai

  createTeamDetailCommand: ICreateTeamDetail[];
  updateTeamDetailCommand: any[]; // eida apatoto lagbena, khali array jaabe tai model nai
  deleteTeamDetailCommand: IDeleteTeamDetail[];
}

export interface ITeamDetail {
  teamDetailId: number;
  teamId: number;
  employeeId: number;
  employeeName: string;
  //   entryBy;
  //   entryDate;
}
export interface ICreateTeamDetail {
  teamDetailId: number;
  teamId: number;
  employeeId: number;
  employeeName: string;
  entryBy: number;
  entryDate: string;
}

export interface IDeleteTeamDetail {
  teamDetailId: number;
}

export interface ITeamTargetSPProductGroup {
  targetSPProductGroupId: number | null;
  teamId?: number | null;
  teamName?: string | null;
  areaId?: number | null;
  areaName?: string | null;
  employeeId: number | null;
  employeeName: string | null;
  productGroupId: number | null;
  productGroupName: string | null;
  productPrice?: number | null;
  month: number | null;
  year: number | null;
  target: number | null;
  sold: number | null;
  achievement: number | null;
  so: number | null;
  finalAchievement: number | null;
  quantity?: number | null;
}

export interface IProductGroupFromSPTarget {
  productGroupId: number;
  productGroupName: string;
  target: number;
}

export interface IProcessTeamTargetSPProductGroup {
  createTarget_SPProductGroupCommand: ICreateTeamTargetSPProductGroup[];
  updateTarget_SPProductGroupCommand: IUpdateTeamTargetSPProductGroup[];
  deleteTarget_SPProductGroupCommand: IDeleteTeamTargetSPProductGroup[];
  operationName?: string | null;
  fromMonth?: number | null;
  toMonth?: number | null;
  fromYear?: number | null;
  toYear?: number | null;
  regionMasterId?: number | null;
  regionId?: number | null;
  divisionId?: number | null;
  districtId?: number | null;
  salesPersonId?: number | null;
  productGroupId?: number | null;
}

export interface ICreateTeamTargetSPProductGroup {
  targetSPProductGroupId: number;
  teamId?: number | null;
  areaId?: number | null;
  employeeId: number;
  productGroupId: number;
  month: number;
  year: number;
  amount: number;
  dateOfEntry: string;
  companyId: number;
  entryBy: number;
  quantity?: number | null;
}

export interface IUpdateTeamTargetSPProductGroup {
  targetSPProductGroupId: number;
  employeeId: number;
  teamId?: number;
  areaId?: number | null;
  productGroupId: number;
  month: number;
  year: number;
  amount: number;
  quantity?: number | null;
  //   dateOfEntry: string;
  //   companyId: number;
  //   entryBy: number;
}

export interface IDeleteTeamTargetSPProductGroup {
  targetSPProductGroupId: number;
}

export interface IEmployee {
  employeeId: number;
  employeeName: string;
  areaId?: number;
  areaName?: string;
  target?: number;
}

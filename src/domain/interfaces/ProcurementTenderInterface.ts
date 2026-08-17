import { ICreateBiznessEventPCTrackCommand } from './BiznessEventPCTrackVMInterface';
import {
  ICreateProcurementTenderAdditionalCostCommand,
  IDeleteProcurementTenderAdditionalCostCommand,
  IUpdateProcurementTenderAdditionalCostCommand,
} from './ProcurementTenderAdditionalCost';
import {
  ICreateProcurementTenderDetailCommand,
  IDeleteProcurementTenderDetailCommand,
  IUpdateProcurementTenderDetailCommand,
} from './ProcurementTenderDetailInterface';

export interface IProcurementTender {
  procurementTenderId?: number;
  tenderNo?: string | null;
  tenderEntryDate?: string | null;
  bgExpiryDate?: string | null;
  buyerId?: number | null;
  buyerName?: string | null;
  buyerGroupId?: number | null;
  buyerGroupName?: string | null;
  bgAmount?: number | null;
  salesPersonId?: number | null;
  salesPersonName?: string | null;
  teamId?: number | null;
  teamName?: string | null;
  teamLeaderId?: number | null;
  teamLeaderName?: string | null;
  remarks?: string | null;
  tenderSubmissionDate?: string | null;
  schedulePrice?: number | null;
  earnestMoney?: string | null;
  earnestMoneyAmount?: number | null;
}

export interface ITenderNoComboBox {
  procurementTenderId: number;
  tenderNo: string;
}

export interface ITenderNoComboBox2 {
  procurementTenderId: number;
  tenderNo: string;
  remarks?: string | null;
  tenderWon: boolean | null;
}

export interface ITenderHistory {
  noOfTender: number;
  noOfTenderWin: number;
  averageValue: number | null;
  lastTenderNo: string;
  date: string | null;
  salesPerson: string;
  lastTenderAmount: number | null;
}

export interface ICreateProcurementTenderCommand {
  procurementTenderId: number | null;
  tenderNo: string | null;
  tenderEntryDate: string | null;
  bgExpiryDate: string | null;
  buyerId: number | null;
  bgAmount: number | null;
  salesPersonId: number | null;
  remarks: string | null;
  tenderSubmissionDate: string | null;
  schedulePrice: number | null;
  companyId: number | null;
  earnestMoney?: string | null;
  earnestMoneyAmount?: number | null;
}

export interface IUpdateProcurementTenderCommand {
  procurementTenderId: number;
  tenderNo: string;
  tenderEntryDate: string | null;
  bgExpiryDate: string | null;
  buyerId: number | null;
  bgAmount: number | null;
  salesPersonId: number | null;
  remarks: string | null;
  tenderSubmissionDate: string | null;
  schedulePrice: number | null;
  earnestMoney?: string | null;
  earnestMoneyAmount?: number | null;
}

export interface IUpdateProcurementTenderOnlyTenderWonAndRemarksCommand {
  procurementTenderId: number;
  remarks?: string | null;
  tenderWon: boolean | null;
  createBiznessEventPCTrackCommand?: ICreateBiznessEventPCTrackCommand | null;
}

export interface IDeleteProcurementTenderCommand {
  procurementTenderId: number;
}

export interface IProcurementTenderProcessCommandsVM {
  createProcurementTenderCommand?: ICreateProcurementTenderCommand | null;
  updateProcurementTenderCommand?: IUpdateProcurementTenderCommand | null;
  deleteProcurementTenderCommand?: IDeleteProcurementTenderCommand | null;
  createProcurementTenderDetailCommand?:
    | ICreateProcurementTenderDetailCommand[]
    | null;
  updateProcurementTenderDetailCommand?:
    | IUpdateProcurementTenderDetailCommand[]
    | null;
  deleteProcurementTenderDetailCommand?:
    | IDeleteProcurementTenderDetailCommand[]
    | null;
  createProcurementTenderAdditionalCostCommand?:
    | ICreateProcurementTenderAdditionalCostCommand[]
    | null;
  updateProcurementTenderAdditionalCostCommand?:
    | IUpdateProcurementTenderAdditionalCostCommand[]
    | null;
  deleteProcurementTenderAdditionalCostCommand?:
    | IDeleteProcurementTenderAdditionalCostCommand[]
    | null;
  createBiznessEventPCTrackCommand?: ICreateBiznessEventPCTrackCommand | null;
  tenderNo?: string | null;
}

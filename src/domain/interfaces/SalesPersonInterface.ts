export interface ISalesPersonComboBox {
  employeeId: number;
  employeeName: string;
  securityUserId?: number;
  teamId?: number | null;
  teamName?: string | null;
  teamLeaderId?: number | null;
  teamLeaderName?: string | null;
}

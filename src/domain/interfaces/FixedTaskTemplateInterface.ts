export interface IFixedTaskTemplateAutoComp {
  fixedTaskTemplateId: number;
  name: string;
}

export interface ICreateFixedTaskTemplate {
  name: string;
  companyId: number;
  dateOfEntry: string;
}

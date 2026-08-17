// interface IDynamicReportFrontendElement {
//   reportGenerationId: number;
//   sequence: number;
//   reportName: string;
//   caption: string;
//   dataType: string;
//   columnName: string;
//   dependencies?: string;
// }

interface IDynamicReportInputElement {
  reportGenerationId: number;
  sequence: number;
  reportName: string;
  caption: string;
  dataType: string;
  columnName: string;
  dependencies?: string;
}

interface IDynamicReportButtonElement {
  buttonId: number;
  buttonName: string;
}

interface IDynamicReportFrontendElements {
  frontendInputElements: IDynamicReportInputElement[];
  frontendButtonElements: IDynamicReportButtonElement[];
}

interface IDynamicOptions {
  optionId: number;
  optionName: string;
  optionLimit: number;
}

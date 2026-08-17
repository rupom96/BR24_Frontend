export interface IChequeBookDetail {
  chequeBookDetailId: number;
  chequeBookId: number;
  chequeLeafNo: string;
  used: string | null;
  vendorId: number | null;
  vendorName: string | null;
  vendorImage: string | null;
  paymentNo: string | null;
  paymentDate: string | null;
  attachmentLink: string | null;
}

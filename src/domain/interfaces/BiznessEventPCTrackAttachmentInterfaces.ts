export interface ICreateBiznessEventPCTrackAttachmentCommand {
  biznessEventPCTrackId?: number;
  fileName?: string;
  attachmentURL?: string;
  entryBy?: number;
  dateOfEntry?: string;
  companyId?: number;
  locationId?: number;
  fileB64Format?: string;
  fileExtension?: string;
}
export interface IDeleteBiznessEventPCTrackAttachmentCommand {
  attachmentId?: number;
  fileName?: string;
  attachmentURL?: string;
}

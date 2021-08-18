import React from "react";

export type FileInfoDto = {
  id: Number;
  referenceId: string;
  fileName: string;
  fileType?: string;
  previewUrl?: string;
  createBy?: string;
  createTime?: Date;
  canDelete: Boolean;
};

export type ExcelFinishProps = {
  success?: (excelUploadDataSource?: any[]) => Promise<void>;
  fail?: (data?: any[], message?: string) => Promise<void>;
};

export type OAFileUploadProps = {
  uploadColumns?: UploadColumn[];
  referenceId?: string;
  onExcelFinish?: ExcelFinishProps;
  showTabs: ('excel' | 'normal')[];
  mode: 'button' | 'tab';
  title?: string;
  readonly?: boolean;
  actionRef?: React.MutableRefObject<UploadActionType | undefined>;
};

export type UploadActionType = {
  resetReferenceId: (newReferenceId: string) => boolean;
};

export type UploadColumn = {
  order: number;
  key: string;
  title: string;
  sample: string;
  type?: 'string' | 'date' | 'number';
};

export type UploadFileRecord = {
  minioId: string;
};

export type ExcelFinishProps = {
  success?: (excelUploadDataSource?: any[]) => Promise<void>;
  fail?: (data?: any[], message?: string) => Promise<void>;
};

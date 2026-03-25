export interface SEZWOPRepository {
  Serial_No: number;
  Id: number;
  Company_Id: number;
  Payperiod_Id: number;
  Invoice_Id: number;
  Invoice_Number: string;
  Document_Name: string;
  Uploaded_Date: string;
  Document_FilePath: string;
  Obselete_Document_FilePath?: string;
  Remark: string;
  Error_Message?: string;
  selectedrecord?: string;
  selectedrecordsList?: SelectedRecords[];
  ApprovalStatus: string;
  UploadStatus: string;
}

export interface SelectedRecords {
  Serial_No: number;
  Id: number;
  Company_Id: number;
  Payperiod_Id: number;
  Invoice_Id: number;
  Invoice_Number: string;
  Document_Name: string;
  Uploaded_Date: string;
  Remark: string;
  Document_FilePath: string;
  uid: number;
  ApprovalStatus: string;
  UploadStatus: string;
}

export interface SEZWOPRepositoryResponse {
  SEZWOPRepositoryDetails: SEZWOPRepository[];
}

export interface DocumentTypeMaster {
  Document_Type_Id: number;
  Document_Type: string;
}

export interface DocumentUploadsFiles {
  Document_Name: string;
  Document_Remarks: string;
  EmpployeeID: string;
}

export interface CompanyCode {
  Company_Id: number;
  Company_Code: string;
}

export interface PayPeriod {
  Pay_Frequency_Detail_Id: number;
  Pay_Period: string;
}

export interface FinancialYear {
  value: string;
  text: string;
}

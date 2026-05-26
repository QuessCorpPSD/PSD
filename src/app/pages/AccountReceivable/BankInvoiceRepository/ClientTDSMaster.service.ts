import { Observable } from "rxjs";
import { APIResponse } from "../../../Models/apiresponse";

export interface IClientTDSMasterService {
    search(CompanyId: number, FinancialYearId: number): Observable<APIResponse>;
    exportToExcel(payload: any): Observable<APIResponse>;
    importClientTds(file: File, createdBy: string): Observable<APIResponse>;
    addClientTDS(payload: any): Observable<APIResponse>
}
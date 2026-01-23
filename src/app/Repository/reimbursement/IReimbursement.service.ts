import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface IReimbursementService {
    getEmployeeCode(companyId: any): Observable<APIResponse>;
    search(companyId: any, financialYearId: any, employeeId: any): Observable<APIResponse>;
    bindPayPeriod(companyId: any, financialYearId: any): Observable<APIResponse>;
    bindReimbursementCode(companyId: any): Observable<APIResponse>;
    addReimbursement(payload: any): Observable<APIResponse>;
    exportToExcel(companyId: any, financialYearId: any, employeeId: any): Observable<APIResponse>;
    importReimbursement(payload: any): Observable<APIResponse>;
}
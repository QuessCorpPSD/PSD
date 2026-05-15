import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface IReissueProcessApproval {
    GetDropdown(action: string): Observable<APIResponse>;
    SearchReIssueApprove(
        companyId: any,
        payPeriodId: any,
        reIssueTypes: any,
        fromDate: any,
        toDate: any,
        param: any,
        status: any
    ): Observable<APIResponse>;
    ExportToExcel(payload: any): Observable<APIResponse>;
    ReissueProcessApproveBulkUpload(payload: any): Observable<APIResponse>;
    CreateReIssueApproveReject(payload: any): Observable<APIResponse>;
    GetReissueApproveTemplate(flag: string, userId: number): Observable<APIResponse>;

}
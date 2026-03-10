import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface IInputaggregator {
    getmapname(companyid: any): Observable<APIResponse>;
    SiteSearch(companyId: any, groupId: any): Observable<APIResponse>;
    getQuessMasterAttributes(): Observable<APIResponse>;
    search(companyId: number): Observable<APIResponse>;
    getClientAttributes(companyId: number): Observable<APIResponse>;
    Uploadcli(formData: FormData): Observable<APIResponse>;
    Upload(formData: FormData): Observable<APIResponse>;
    downloadBillableReport(companyId: number, payPeriodId: number);
    Uploadclient(formData: FormData): Observable<APIResponse>;

    // this is for Input aggregator attendance
    
    getQuessAttendanceAttributes(): Observable<APIResponse>;
    Uploadclientattendance(formData: FormData): Observable<APIResponse>;
    downloadBillableReportattendance(companyId: number, payPeriodId: number);
    Uploadattendanceattributes(formData: FormData): Observable<APIResponse>;
    Uploadattendancecli(formData: FormData): Observable<APIResponse>;
    searchattendance(companyId: number): Observable<APIResponse>;
}
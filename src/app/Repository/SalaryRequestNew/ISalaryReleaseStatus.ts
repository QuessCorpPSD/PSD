import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface ISalaryReleaseStatus {

    Batchtype(userid: any): Observable<APIResponse>;
    Search(BatchType: any, FromDate: any, Todate: any, EmployeeCode: any, userid: any,): Observable<APIResponse>;
    ExporttoExcel(BatchType: any, FromDate: any, Todate: any, EmployeeCode: any, userid: any,): Observable<APIResponse>;
    Upload(formData: FormData): Observable<APIResponse>;
    DownloadTemplate(templateid:any): Observable<APIResponse>;
}
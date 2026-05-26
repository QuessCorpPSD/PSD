import { Observable } from 'rxjs';
import { APIResponse } from '../../../Models/apiresponse';

export interface IdebitNoteRepository {

    Search(
        ClientName: any,
        EmpCode: any,
        FromDate: any,
        ToDate: any
    ): Observable<APIResponse>

    DebitNoteExport(
        payload: any
    ): Observable<APIResponse>;

}
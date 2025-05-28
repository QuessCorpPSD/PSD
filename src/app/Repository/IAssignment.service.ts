import { Observable } from "rxjs";
import { APIResponse } from "../Models/apiresponse";

export interface IAssignmentService {
      GetAssignmentLot(userid):Observable<APIResponse>;
      GetAllotment(val):Observable<APIResponse>;
      PayRegisterDownload(val):Observable<APIResponse>
      ReconPayRegisterDownload(val):Observable<APIResponse>
      PayRegisterUpload(val):Observable<APIResponse>
      LotStatus(val):Observable<APIResponse>
      QCLotVerify(val):Observable<APIResponse>
      InputFileDownload(val):Observable<APIResponse>
      GetSOP_QA(): Observable<APIResponse>
}
import { Observable } from "rxjs";
import { APIResponse } from "../Models/apiresponse";

export interface ICommonService {
    GetProcessCategory():Observable<APIResponse>
    GetReporting():Observable<APIResponse>
    GetTeamLeader():Observable<APIResponse>
    GetMangers():Observable<APIResponse>
    GetFun_Head():Observable<APIResponse>
    GetRoles():Observable<APIResponse>
    GetAccessType():Observable<APIResponse>
    GetUserById(userId):Observable<APIResponse>
    GetAllUser():Observable<APIResponse>
    GetUserByEmployeeId(employeeID):Observable<APIResponse>
    UserCreate(val):Observable<APIResponse>
    GetFinancialYears(): Observable<APIResponse>
    AddBreakDetail(val):Observable<APIResponse>
    GetBreakDetail():Observable<APIResponse>
    GetEmployeeBreakByDate(userId,date):Observable<APIResponse>
    AddEmployeeBreak(val):Observable<APIResponse>;
    AddBulkEmployeeBreak(val):Observable<APIResponse>;
}
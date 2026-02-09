import { Observable } from "rxjs";
import { APIResponse } from "../Models/apiresponse";

export interface ICommonService {
    GetProcessCategory(): Observable<APIResponse>
    GetReporting(): Observable<APIResponse>
    GetTeamLeader(): Observable<APIResponse>
    GetMangers(): Observable<APIResponse>
    GetFun_Head(): Observable<APIResponse>
    GetRoles(): Observable<APIResponse>
    GetAccessType(): Observable<APIResponse>
    GetUserById(userId): Observable<APIResponse>
    GetAllUser(): Observable<APIResponse>
    GetUserByEmployeeId(employeeID): Observable<APIResponse>
    UserCreate(val): Observable<APIResponse>
    GetProcessCategory(): Observable<APIResponse>
    GetReporting(): Observable<APIResponse>
    GetTeamLeader(): Observable<APIResponse>
    GetMangers(): Observable<APIResponse>
    GetFun_Head(): Observable<APIResponse>
    GetRoles(): Observable<APIResponse>
    GetAccessType(): Observable<APIResponse>
    GetUserById(userId): Observable<APIResponse>
    GetAllUser(): Observable<APIResponse>
    GetUserByEmployeeId(employeeID): Observable<APIResponse>
    UserCreate(val): Observable<APIResponse>
    GetFinancialYears(): Observable<APIResponse>
    AddBreakDetail(val): Observable<APIResponse>
    GetBreakDetail(): Observable<APIResponse>
    GetEmployeeBreakByDate(userId, date): Observable<APIResponse>
    AddEmployeeBreak(val): Observable<APIResponse>;
    AddBulkEmployeeBreak(val): Observable<APIResponse>;
    GetAllManager(roleId, userId): Observable<APIResponse>;
    GetAllTeamLeader(userId): Observable<APIResponse>;
    AddBreakDetail(val): Observable<APIResponse>
    GetBreakDetail(): Observable<APIResponse>
    GetEmployeeBreakByDate(userId, date): Observable<APIResponse>
    AddEmployeeBreak(val): Observable<APIResponse>;
    AddBulkEmployeeBreak(val): Observable<APIResponse>;
    GetAllManager(roleId, userId): Observable<APIResponse>;
    GetAllTeamLeader(userId): Observable<APIResponse>;
    GetAllEmployee(userId): Observable<APIResponse>;
    GetAllUsers(): Observable<APIResponse>;
    GetManagerByUserId(user_Id): Observable<APIResponse>;
    SwapCategory(login): Observable<APIResponse>;
    GetCompanyCodes(userId: number): Observable<APIResponse>
    GetPayperiodbyCompany(companyId: any): Observable<APIResponse>
    GetCurrentPayperiod(companyId: any): Observable<APIResponse>
    GetInvoiceType(): Observable<APIResponse>;
    GetAllState(): Observable<APIResponse>;
    GetPayCodes(): Observable<APIResponse>;
    GetManagerByUserId(user_Id): Observable<APIResponse>;
    SwapCategory(login): Observable<APIResponse>;
    GetCompanyCodes(userId: number): Observable<APIResponse>
    GetPayperiodbyCompany(companyId: any): Observable<APIResponse>
    GetCurrentPayperiod(companyId: any): Observable<APIResponse>
    GetInvoiceType(): Observable<APIResponse>;
    GetSitesByCompanyId(companyId: any): Observable<APIResponse>;
    GetMapNamebyCompany(companyId: any): Observable<APIResponse>;
    GetPayperiodbyCompanySalaryRelease(companyId: any): Observable<APIResponse>;
    GetPayperiodbyCompanySalaryUpfront(companyId: any): Observable<APIResponse>;
    GetPayperiodbyCompanyDeduction(companyId: any): Observable<APIResponse>;
    GetPayperiodbyCompanyVanPayment(companyId: any): Observable<APIResponse>;
}
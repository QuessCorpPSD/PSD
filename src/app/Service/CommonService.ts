import { HttpClient, HttpHeaders} from "@angular/common/http";
import { environment } from "../../environments/environment.development";
import { ICommonService } from "../Repository/ICommonService";
import { APIResponse } from "../Models/apiresponse";
import { map, Observable } from "rxjs";
import { Injectable } from "@angular/core";
@Injectable({
  providedIn: 'root'
})
export class CommonService implements ICommonService {
    environment = environment
    constructor(private http: HttpClient) {

    }
      UserCreate(login):Observable<APIResponse>{
    var inputval=JSON.stringify(login);
   
      const config = new HttpHeaders({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        }).set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
    return this.http.post<APIResponse>(this.environment.apiUrl+"Authendicate/UserCreate",inputval, { headers: config }).pipe(
      map(userInfo=> {
        let data=userInfo.Data;       
        return userInfo;
        //return userInfo.headers.get('authorization');
      }));
  }
    GetProcessCategory(): Observable<APIResponse> {
        const headers  = new HttpHeaders({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        }).set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

            const config = { headers };
        return this.http.get<APIResponse>(this.environment.apiUrl + "Common/GetAllProcessCategory",config);
    }
    GetReporting(): Observable<APIResponse> {
         const headers  = new HttpHeaders({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        }).set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

            const config = { headers };
        return this.http.get<APIResponse>(this.environment.apiUrl + "Authendicate/GetReporting",config)
    }
    GetTeamLeader(): Observable<APIResponse> {
          const headers  = new HttpHeaders({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        }).set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

            const config = { headers };
        return this.http.get<APIResponse>(this.environment.apiUrl + "Authendicate/GetAllTeamLead",config)
    }
    GetMangers(): Observable<APIResponse> {
        const headers  = new HttpHeaders({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        }).set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

            const config = { headers };
        return this.http.get<APIResponse>(this.environment.apiUrl + "Authendicate/GetAllManager",config)
    }
    GetFun_Head(): Observable<APIResponse> {
         const headers  = new HttpHeaders({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        }).set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

            const config = { headers };
        return this.http.get<APIResponse>(this.environment.apiUrl + "Authendicate/GetAllFunctionalityHead",config)
    }
    GetRoles(): Observable<APIResponse> {
         const headers  = new HttpHeaders({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        }).set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

            const config = { headers };
        return this.http.get<APIResponse>(this.environment.apiUrl + "Common/GetAllActiveRole",config)
    }
    GetAccessType(): Observable<APIResponse> {
          const headers  = new HttpHeaders({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        }).set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

            const config = { headers };
        return this.http.get<APIResponse>(this.environment.apiUrl + "Common/GetAccessType",config)
    }
    GetFinancialYears(): Observable<APIResponse> {
          const headers  = new HttpHeaders({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        }).set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

            const config = { headers };
        return this.http.get<APIResponse>(this.environment.apiUrl + "Common/GetFinancialYear",config)
    }
    GetUserById(userId):Observable<APIResponse>
    {
        const headers  = new HttpHeaders({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        }).set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

            const config = { headers };
        return this.http.get<APIResponse>(this.environment.apiUrl + "Authendicate/GetUserById/"+userId,config)
    }
     GetUserByEmployeeId(employeeID):Observable<APIResponse>
     {
        const headers  = new HttpHeaders({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        }).set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

            const config = { headers };
        return this.http.get<APIResponse>(this.environment.apiUrl + "Authendicate/UserByEmployeeId/"+employeeID,config)
     }
     GetAllUser():Observable<APIResponse>{
           const headers  = new HttpHeaders({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        }).set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

            const config = { headers };
        return this.http.get<APIResponse>(this.environment.apiUrl + "Authendicate/GetAllActiveUsers",config)
     }
     AddBreakDetail(val):Observable<APIResponse>
     {
          const headers  = new HttpHeaders({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        }).set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

            const config = { headers };
            
        return this.http.post<APIResponse>(this.environment.apiUrl + "Admin/AddBreakDetail",JSON.stringify(val),config)
     }
     GetBreakDetail():Observable<APIResponse>
     {
         const headers  = new HttpHeaders({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        }).set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

            const config = { headers };
        return this.http.get<APIResponse>(this.environment.apiUrl + "Admin/GetAllBreakDetail",config)
     }
     GetEmployeeBreakByDate(userId,date):Observable<APIResponse>
     {
         const headers  = new HttpHeaders({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        }).set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

    
            const val={
                "userId":userId,
                "date":date
            }
            const url = `${this.environment.apiUrl}Admin/GetEmployeeBreak`;
             const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(url, JSON.stringify(val), { headers });
        //return this.http.post<APIResponse>(this.environment.apiUrl + "Admin/GetEmployeeBreak/"+userId+"/"+date,config)
     }
       AddEmployeeBreak(val):Observable<APIResponse>
     {
         const headers  = new HttpHeaders({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        }).set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

    
            
            const url = `${this.environment.apiUrl}Admin/EmployeeBreakAdd`;
             const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(url, JSON.stringify(val), { headers });
        //return this.http.post<APIResponse>(this.environment.apiUrl + "Admin/GetEmployeeBreak/"+userId+"/"+date,config)
     }
     AddBulkEmployeeBreak(val):Observable<APIResponse>
     {
         const headers  = new HttpHeaders({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        }).set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

    
            
            const url = `${this.environment.apiUrl}Admin/BulkEmployeeBreakAdd`;
             const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(url, JSON.stringify(val), { headers });
        //return this.http.post<APIResponse>(this.environment.apiUrl + "Admin/GetEmployeeBreak/"+userId+"/"+date,config)
     }
}
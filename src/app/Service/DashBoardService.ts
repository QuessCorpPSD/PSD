import { Injectable } from "@angular/core";
import { IDashBoardServices } from "../Repository/IDashBoardService";
import { environment } from "../../environments/environment.development";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { APIResponse } from "../Models/apiresponse";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DashBoardServices implements IDashBoardServices {
    environment=environment;
    constructor(private http:HttpClient)
    {

    }

    GetUserDashBoard(userId):Observable<APIResponse>
    {
        const headers  = new HttpHeaders({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        }).set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

            const config = { headers };
        return this.http.get<APIResponse>(this.environment.apiUrl+'DashBoard/GetDashBoardByUserId/'+userId,config);
    }
    UserCheckIn(userId,Type):Observable<APIResponse>
    {
         const headers  = new HttpHeaders({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        }).set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

            const config = { headers };
        return this.http.get<APIResponse>(this.environment.apiUrl + 'CheckInCheckOut/CheckIn/' + userId + '/' + Type,config)
    }
        getCategoryLotDetail(assignmentType):Observable<APIResponse>
    {
          const headers  = new HttpHeaders({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        }).set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

            const config = { headers };
        return this.http.get<APIResponse>(this.environment.apiUrl+'DashBoard/CategoryLotDetail/'+assignmentType,config)
    }
    GetPendingLotDetail():Observable<APIResponse>{
        const headers  = new HttpHeaders({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        }).set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

            const config = { headers };
        return this.http.get<APIResponse>(this.environment.apiUrl+'DashBoard/GetPendingLotDetail',config)
    }
    getadmindashboard():Observable<APIResponse>
    {
           const headers  = new HttpHeaders({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        }).set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

            const config = { headers };
        return this.http.get<APIResponse>(this.environment.apiUrl+'DashBoard/GetAdminDashBoard',config)
    }
    getadmindashboarddetail(val):Observable<APIResponse>
    {

        const url = `${this.environment.apiUrl}DashBoard/GetAdminDashBoardDetail`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });
        
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(url, JSON.stringify(val), { headers });

    }
    getadminPendingLot():Observable<APIResponse>
    {
         const headers  = new HttpHeaders({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        }).set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

            const config = { headers };
        return this.http.get<APIResponse>(this.environment.apiUrl+'DashBoard/PendingLot',config) 
    }
}
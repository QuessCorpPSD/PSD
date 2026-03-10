import { Injectable } from "@angular/core";
import * as signalR from '@microsoft/signalr';
import { environment } from "../../environments/environment.development";
@Injectable({
  providedIn: 'root'
})
export class SignalrService {
    environment=environment
    private hubConnection!: signalR.HubConnection;
    startConnection() {
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(this.environment.signalRURL + 'gridHub')
            .build();

        this.hubConnection.start()
            .then(() => console.log('SignalR Connected'))
            .catch(err => console.log(err));
    }
   onGridUpdate(callback: () => void) {
    this.hubConnection.on('GridUpdated', () => {
      callback();
    });
  }
}
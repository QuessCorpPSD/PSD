import { ChangeDetectionStrategy, Component, Inject, InjectionToken, OnInit, ViewEncapsulation,  } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { BreakAddComponent } from './break-add/break-add.component';
import { ICommonService } from '../../Repository/ICommonService';
import { CommonService } from '../../Service/CommonService';
import { EncryptionService } from '../../Shared/encryption.service';
import { SessionStorageService } from '../../Shared/SessionStorageService';
import { Router } from '@angular/router';


export  const Admin_TOKEN=new InjectionToken<ICommonService>('Admin_TOKEN');
@Component({
    selector: 'app-breakdetail',
    standalone:true,
    imports: [MatTableModule, MatFormFieldModule, MatInputModule,  BreakAddComponent],
    templateUrl: './breakdetail.component.html',
    styleUrls: ['./breakdetail.component.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [{
            provide: Admin_TOKEN,
            useClass: CommonService,
        }]
        
    
})
export class BreakdetailComponent implements OnInit {
  isModalVisible = false;
  displayedColumns: string[] = ['breakId','processCategory', 'description','starttime','endtime','isActive'];
 dataSource:any
constructor(@Inject(Admin_TOKEN) private _adminService: ICommonService,
 @Inject(Router) private router: Router,
  private _encry:EncryptionService,
  private _sessionStoreage: SessionStorageService,){}
ngOnInit(): void {
  const userdetail= this._sessionStoreage.getItem('UserProfile');
  if(userdetail)
  {
    this._adminService.GetBreakDetail().subscribe({
      next: res => {
        console.log(res);
        this.dataSource =new MatTableDataSource<any>(res.Data); // Make sure res.Data is an array
      },
      error: err => {
        console.log(err);
      }
    });
  }
  else{
     this.router.navigate(['/Login']);
  }
  }
  onChildUpdated(){
     this._adminService.GetBreakDetail().subscribe({
      next: res => {
        //console.log(res);
        this.dataSource =new MatTableDataSource<any>(res.Data); // Make sure res.Data is an array
      },
      error: err => {
        console.log(err);
      }
    });
  }
}

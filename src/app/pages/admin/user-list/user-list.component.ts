import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Inject, InjectionToken, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { ICommonService } from '../../../Repository/ICommonService';
import { CommonService } from '../../../Service/CommonService';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditUserComponent } from './edit-user/edit-user.component';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { EncryptionService } from '../../../Shared/encryption.service';

export  const COMM_TOKEN=new InjectionToken<ICommonService>('COMM_TOKEN');
@Component({
    selector: 'app-user-list',
    imports: [CommonModule,
        ReactiveFormsModule,
        MatAutocompleteModule, FormsModule,
        MatInputModule, MatPaginatorModule, MatIconModule, MatDialogModule,
        MatFormFieldModule, MatTableModule],
    templateUrl: './user-list.component.html',
    styleUrl: './user-list.component.css',
    providers: [
        {
            provide: COMM_TOKEN,
            useClass: CommonService,
        }
    ]
})
export class UserListComponent implements OnInit,AfterViewInit  {

  dataSource = new MatTableDataSource<any>();
   @ViewChild(MatPaginator) paginator!: MatPaginator;
   ProcessCategory:any;
  displayedColumns: string[] = ['process_Category', 'employeeID', 'userName', 'isActive','teamLeadName', 'managerName', 'fun_Manager','Edit' ];
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  constructor(@Inject(COMM_TOKEN) private _authService: ICommonService,
private dialog: MatDialog,
 private sessionStorageService: SessionStorageService,
 private _encry:EncryptionService) {

  }
 

  // const dialogRef = this.dialog.open(EditUserComponent, {
  //   width: '90%',
  //   maxWidth: '90vw',
  //   height: 'auto',
  //   data: { ...row } // pass row data
  // });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
        // update dataSource with edited values
       // const index = this.dataSource.findIndex(u => u.employeeID === result.employeeID);
        // if (index !== -1) {
        //   this.dataSource[index] = result;
        //   this.dataSource = [...this.dataSource]; // refresh table
        // }
    //  }
    //});
 // }
  onEdit(element){
      const userdetail= this.sessionStorageService.getItem('UserProfile');
  var user = JSON.parse(this._encry.decrypt(userdetail!)); 
    const request={
      "userId":element.user_Id,
      "Category":element.process_Category,
      "CreatedOn":user.user_Id
    }
    this._authService.SwapCategory(request).subscribe({
      next:res=>{
        const data=res.Data;
        alert(data.messages);

      },
      error:err=>{
        console.log(err);
      }
    })
  }
   ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
    BindProcessCategory() {
    this._authService.GetProcessCategory().subscribe({
      next: res => { this.ProcessCategory = res.Data },
      error: err => { console.log(err) }
    })
  }
  ngOnInit(): void {
      this.BindProcessCategory();
    this._authService.GetAllUser().subscribe({
      next:res=>{
        this.dataSource = new MatTableDataSource<any>(Array.isArray(res.Data) ? res.Data : []);
        this.dataSource.paginator = this.paginator;
      },
      error:err=>{console.log(err)}
    })

  }
}

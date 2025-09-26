import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, InjectionToken, Input, input, OnInit, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ICommonService } from '../../Repository/ICommonService';
import { UserUI } from '../../Models/UserUI';
import { map, Observable, startWith } from 'rxjs';
import { SessionStorageService } from '../../Shared/SessionStorageService';
import { EncryptionService } from '../../Shared/encryption.service';
import { CommonService } from '../../Service/CommonService';

export  const COMM_TOKEN=new InjectionToken<ICommonService>('COMM_TOKEN');
@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule,
      ReactiveFormsModule,
      MatAutocompleteModule,
      MatInputModule,
      MatFormFieldModule],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css',
  providers:[{
          
                  provide: COMM_TOKEN,
                  useClass: CommonService,
                
        }]
})
export class EmployeeComponent implements OnInit {
  searchText: string = '';
  myControl = new FormControl<string | UserUI>('');
  teamLeaderList: UserUI[] = [];
  filteredOptions$!: Observable<UserUI[]>;
  selectedOption?: UserUI;
  userDetail: any;
  @Input()  teamlederId!:any;
  @Output() EmployeeSelected = new EventEmitter<UserUI>();
  constructor(@Inject(COMM_TOKEN) private _commonService: ICommonService, private _sessionStorage: SessionStorageService
    , private decry: EncryptionService) {

  }
   ngOnInit(): void {
     const user = this._sessionStorage.getItem('UserProfile');
     if (user){
       this.userDetail = JSON.parse(this.decry.decrypt(user));
     }
     else {
       console.warn('User Profile not found in Session');
     }
 
     //this.BindTeamLeader(this.userDetail.user_Id);
     
   }
   ngOnChanges() {
    console.log("Onchages not working")
    console.log(this.teamlederId);
   this.BindEmployee(this.teamlederId)
  }
 BindEmployee(userId: number) {
     this._commonService.GetAllEmployee(userId).subscribe({
       next: res => {
         this.teamLeaderList = res.Data;
 
         this.filteredOptions$ = this.myControl.valueChanges.pipe(
   startWith(''),
   map(value => {
     let searchText = '';
 
     if (typeof value === 'string') {
       searchText = value;
     } else if (value && typeof value === 'object' && 'userName' in value) {
       searchText = value?.userName;
     }
 
     return this._filter(searchText);
   })
 );
       },
       error: err => console.error(err.message)
     });
 }
 
 private _filter(value: string): UserUI[] {
   const filterValue = value.toLowerCase();
   return this.teamLeaderList.filter(option =>
     option.userName.toLowerCase().includes(filterValue)
   );
 }
 
   displayFn = (option: any): string => option?.userName ??option.userName;
 
   onOptionSelected(option: any) {
     this.selectedOption = option;
     console.log(option);
    this.EmployeeSelected.emit(this.selectedOption);
   }
}

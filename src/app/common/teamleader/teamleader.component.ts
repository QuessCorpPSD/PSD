import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, InjectionToken, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonService } from '../../Service/CommonService';
import { ICommonService } from '../../Repository/ICommonService';
import { UserUI } from '../../Models/UserUI';
import { map, Observable, startWith } from 'rxjs';
import { SessionStorageService } from '../../Shared/SessionStorageService';
import { EncryptionService } from '../../Shared/encryption.service';

export  const COMM_TOKEN=new InjectionToken<ICommonService>('COMM_TOKEN');
@Component({
    selector: 'app-teamleader',
    imports: [CommonModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatInputModule,
        MatFormFieldModule],
    templateUrl: './teamleader.component.html',
    styleUrl: './teamleader.component.css',
    providers: [{
            provide: COMM_TOKEN,
            useClass: CommonService,
        }]
})
export class TeamleaderComponent implements OnInit{
searchText: string = '';
myControl = new FormControl<string | UserUI>('');
 teamLeaderList: UserUI[] = [];
  filteredOptions$!: Observable<UserUI[]>;
  selectedOption?: UserUI;
  userDetail: any;
  @Input() ManagerSelected:any;
  @Output() temaleadSelected = new EventEmitter<UserUI>();
constructor(@Inject(COMM_TOKEN) private _commonService: ICommonService, private _sessionStorage: SessionStorageService
, private decry:EncryptionService)
{

}

  ngOnInit(): void {
    const user = this._sessionStorage.getItem('UserProfile');
    if (user){
      this.userDetail = JSON.parse(this.decry.decrypt(user));
    }
    else {
      console.warn('User Profile not found in Session');
    }

    this.BindTeamLeader(this.userDetail.user_Id);
    
  }
   ngOnChanges() {
    console.log("Onchages not working")
    console.log(this.ManagerSelected);
   this.BindTeamLeader(this.ManagerSelected)
  }
BindTeamLeader(userId: number) {
    this._commonService.GetAllTeamLeader(userId).subscribe({
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
   this.temaleadSelected.emit(this.selectedOption);
  }
}


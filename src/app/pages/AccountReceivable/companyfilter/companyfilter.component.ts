import { CommonModule } from '@angular/common';
import { Component, EventEmitter, forwardRef, Inject, InjectionToken, Input, input, OnChanges, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Observable, startWith, map } from 'rxjs';
import { Company } from '../../../Models/Common';
import { OnboardingStateService } from '../../../onboarding-state.service';
import { ICommonService } from '../../../Repository/ICommonService';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';

import { CommonService } from '../../../Service/CommonService';
export const Common_TOKEN = new InjectionToken<CommonService>('Common_TOKEN');
@Component({
  selector: 'app-companyfilter',
  imports: [CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule, FormsModule],
  templateUrl: './companyfilter.component.html',
  styleUrl: './companyfilter.component.css',
  encapsulation: ViewEncapsulation.None,
  providers: [
    {

      provide: Common_TOKEN,
      useClass: CommonService,

    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CompanyfilterComponent),
      multi: true
    }
  ]
})
export class CompanyfilterComponent implements OnInit, OnChanges {
  searchText: string = '';
  myControl = new FormControl<Company | null>(null);
  companyCode: Company[] = [];
  filteredOptions$!: Observable<Company[]>;
  selectedOption?: Company | null;
  userdetail!: any;
  @Input() companyID!: Number;
  @Output() companyEmit = new EventEmitter<Company | null>();

  constructor(
    @Inject(Common_TOKEN) private _commonService: ICommonService,
    private _sessionStoreage: SessionStorageService,
    private decry: EncryptionService,
    private stateService: OnboardingStateService
  ) { }

  value: string = '';

  // Angular forms callbacks
  onChange: (value: any) => void = () => { };
  onTouched: () => void = () => { };

  writeValue(value: Company | null): void {
    this.selectedOption = value ?? null;
    this.myControl.setValue(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void { }

  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    } else {
      console.warn('UserProfile not found in session storage');
    }
    this.BindCompanyCode();
  }

  BindCompanyCode() {
    this._commonService.GetCompanyCodes(this.userdetail.user_Id).subscribe({
      next: res => {
        let companies = res.Data;

        // EXCLUDE selected company
        if (this.companyID) {
          companies = companies.filter(c => c.companyId !== this.companyID);
        }

        this.companyCode = companies;

        this.filteredOptions$ = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => {
            let searchText = '';
            if (typeof value === 'string') searchText = value;
            else if (value && 'displayName' in value) searchText = value.displayName;
            return this._filter(searchText);
          })
        );
      },
      error: err => console.error(err.message)
    });
  }

  private _filter(value: string): Company[] {
    const filterValue = value.toLowerCase();
    return this.companyCode.filter(option =>
      option.displayName.toLowerCase().includes(filterValue)
    );
  }

  displayFn = (option: Company | null): string => option?.displayName ?? '';

  onOptionSelected(option: Company) {
    this.selectedOption = option;
    this.myControl.setValue(option); 
    this.onChange(option);
    this.onTouched();
    this.companyEmit.emit(option);
  }

  clearSelection(input: HTMLInputElement) {
    this.selectedOption = null;

    this.myControl.setValue(null);

    this.onChange(null);
    this.onTouched();
    this.companyEmit.emit(null);

    input.blur();

    console.log('Selection cleared:', this.selectedOption, this.myControl.value);
  }

  ngOnChanges() {
    this.BindCompanyCode();
  }
}

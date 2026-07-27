import { CommonModule } from '@angular/common';
import { Component, EventEmitter, forwardRef, Inject, InjectionToken, Input, Output, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule, FormsModule, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Observable, startWith, map } from 'rxjs';
import { Company } from '../../Models/Common';
import { OnboardingStateService } from '../../onboarding-state.service';
import { ICommonService } from '../../Repository/ICommonService';
import { CommonService } from '../../Service/CommonService';
import { EncryptionService } from '../../Shared/encryption.service';
import { SessionStorageService } from '../../Shared/SessionStorageService';
const COMM_TOKEN = new InjectionToken<ICommonService>('COMM_TOKEN');
@Component({
  selector: 'companyconstruction',
  imports: [CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule, FormsModule],
  templateUrl: './companyconstruction.component.html',
  styleUrl: './companyconstruction.component.css',
  encapsulation: ViewEncapsulation.None,
  providers: [
    {

      provide: COMM_TOKEN,
      useClass: CommonService,

    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CompanyconstructionComponent),
      multi: true
    }
  ]
})
export class CompanyconstructionComponent {
  searchText: string = '';
  myControl = new FormControl<Company | null>(null);
  companyCode: Company[] = [];
  filteredOptions$!: Observable<Company[]>;
  selectedOption?: Company | null;
  @Input() CompanyId: any;
  userdetail!: any;
  private pendingValue: any;
  @Output() companyEmit = new EventEmitter<Company | null>();


  constructor(
    @Inject(COMM_TOKEN) private _commonService: ICommonService,
    private _sessionStoreage: SessionStorageService,
    private decry: EncryptionService,
    private stateService: OnboardingStateService
  ) { }

  value: string = '';

  // Angular forms callbacks
  onChange: (value: any) => void = () => { };
  onTouched: () => void = () => { };

  /*
  writeValue(value: Company | null): void {
     this.selectedOption = value ?? null;
     this.myControl.setValue(value);
   } */
  writeValue(value: any): void {

    this.pendingValue = value;

    if (!value) {
      this.myControl.setValue(null);
      return;
    }

    this.tryResolveValue();
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
    this._commonService.GetCSNCompanyCodes(this.userdetail.user_Id).subscribe({
      next: res => {

        this.companyCode = res.Data;

        this.filteredOptions$ = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => {
            let searchText = '';

            if (typeof value === 'string') {
              searchText = value;
            } else if (value && 'displayName' in value) {
              searchText = value.displayName;
            }

            return this._filter(searchText);
          })
        );
        this.tryResolveValue();
      }
    });
  }
  private tryResolveValue() {

    if (!this.companyCode?.length || !this.pendingValue) return;

    const selected = this.companyCode.find(
      x => x.companyId == this.pendingValue || x == this.pendingValue
    );

    if (selected) {
      this.selectedOption = selected;
      this.myControl.setValue(selected, { emitEvent: false });
    }
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
    this.myControl.setValue(option); // sync input box
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
}


import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, effect, EventEmitter, forwardRef, Inject, InjectionToken, Injector, Input, OnChanges, OnInit, Output, runInInjectionContext, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule, FormControl, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Observable, startWith, map } from 'rxjs';
import { ICommonService } from '../../Repository/ICommonService';
import { CommonService } from '../../Service/CommonService';
import { Frequency } from '../../Models/Common';
import { EncryptionService } from '../../Shared/encryption.service';
import { OnboardingStateService } from "../../onboarding-state.service";
import { MatIconModule } from '@angular/material/icon';
import { SessionStorageService } from '../../Shared/SessionStorageService';
export const COMM_TOKEN = new InjectionToken<ICommonService>('COMM_TOKEN');

@Component({
  selector: 'payperiodall',
  imports: [CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule, FormsModule],
  templateUrl: './payperiodall.component.html',
  styleUrl: './payperiodall.component.css',
  encapsulation: ViewEncapsulation.None,
  providers: [
    {

      provide: COMM_TOKEN,
      useClass: CommonService,

    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PayperiodallComponent),
      multi: true
    }
  ]
})
export class PayperiodallComponent {
  searchText: string = '';
  myControl = new FormControl<Frequency | null>(null);
  payPeriod: Frequency[] = [];
  filteredOptions$!: Observable<Frequency[]>;
  selectedOption?: Frequency | null;
  userdetail!: any;
  @Output() FrequencyEmit = new EventEmitter<Frequency | null>();

  constructor(
    @Inject(COMM_TOKEN) private _commonService: ICommonService,
    private _sessionStoreage: SessionStorageService,
    private decry: EncryptionService,
    private stateService: OnboardingStateService
  ) {}

  value: string = '';

  // Angular forms callbacks
  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: Frequency | null): void {
    this.selectedOption = value ?? null;
    this.myControl.setValue(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {}

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
    this._commonService.GetAllFrequency ().subscribe({
      next: res => {
        this.payPeriod = res.Data;
        this.filteredOptions$ = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => {
            let searchText = '';
            if (typeof value === 'string') searchText = value;
            else if (value && 'pay_Period' in value) searchText = value.pay_Period;
            return this._filter(searchText);
          })
        );
      },
      error: err => console.error(err.message)
    });
  }

  private _filter(value: string): Frequency[] {
    const filterValue = value.toLowerCase();
    return this.payPeriod.filter(option =>
      option.pay_Period.toLowerCase().includes(filterValue)
    );
  }

  displayFn = (option: Frequency | null): string => option?.pay_Period ?? '';

  onOptionSelected(option: Frequency) {
    this.selectedOption = option;
    this.myControl.setValue(option); // sync input box
    this.onChange(option);
    this.onTouched();
    this.FrequencyEmit.emit(option);
  }

  clearSelection(input: HTMLInputElement) {
    this.selectedOption = null;

    this.myControl.setValue(null); 

    this.onChange(null);
    this.onTouched();
    this.FrequencyEmit.emit(null); 

    input.blur();

    console.log('Selection cleared:', this.selectedOption, this.myControl.value);
  }
}

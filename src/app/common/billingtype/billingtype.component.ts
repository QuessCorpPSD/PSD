import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, InjectionToken, OnChanges, Input, OnInit, Output, ViewEncapsulation, forwardRef } from '@angular/core';
import { ReactiveFormsModule, FormControl, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Observable, startWith, map } from 'rxjs';
import { BillingTypeclass, designationclass } from '../../Models/Common';
import { ICommonService } from '../../Repository/ICommonService';
import { CommonService } from '../../Service/CommonService';
import { MatIconModule } from '@angular/material/icon';
export const COMM_TOKEN = new InjectionToken<ICommonService>('COMM_TOKEN');



@Component({
  selector: 'billingtype',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule],
  templateUrl: './billingtype.component.html',
  styleUrl: './billingtype.component.css',
  encapsulation: ViewEncapsulation.None,
  providers: [{
    provide: COMM_TOKEN,
    useClass: CommonService
  }, {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => BillingtypeComponent),
    multi: true
  }]
})
export class BillingtypeComponent implements ControlValueAccessor {
  @Input() selectedOption?: BillingTypeclass | null;
  options: string[] = [];
  searchText: string = '';
  myControl = new FormControl<string | BillingTypeclass>('');
  BillingTypes: BillingTypeclass[] = [];
  filteredOptions$!: Observable<BillingTypeclass[]>;
  //selectedOption?: BillingTypeclass;
  selectedBillingtype?: any;
  @Output() billingtypeEmit = new EventEmitter<BillingTypeclass | null>();
  constructor(@Inject(COMM_TOKEN) private _commonService: ICommonService) {

  }
  ngOnInit() {
    this.BindBillingTypes();
  }

  BindBillingTypes() {
    this._commonService.GetAllBillingTypes().subscribe({
      next: res => {
        this.BillingTypes = res.Data;
        this.filteredOptions$ = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => {
            let searchText = '';

            if (typeof value === 'string') {
              searchText = value;
            } else if (value && typeof value === 'object' && 'code' in value) {
              searchText = value?.code;
            }

            return this._filter(searchText);
          })
        );
      },
      error: err => console.error(err.message)
    });
  }

  private onChange =
    (value: BillingTypeclass | null) => { };

  private onTouched = () => { };

  writeValue(value: BillingTypeclass | null): void {

    this.selectedBillingtype = value ?? undefined;
    this.selectedOption = value ?? undefined;

    this.myControl.setValue(
      value ?? '',
      { emitEvent: false }
    );
  }

  registerOnChange(
    fn: (value: BillingTypeclass | null) => void
  ): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.myControl.disable({ emitEvent: false });
    } else {
      this.myControl.enable({ emitEvent: false });
    }
  }

  private _filter(value: string): BillingTypeclass[] {
    const filterValue = value.toLowerCase();
    return this.BillingTypes.filter(option =>
      option.code.toLowerCase().includes(filterValue)
    );
  }

  displayFn(value: any): string {
    return value?.code ?? '';
  }

  onOptionSelected(option: any) {
    this.selectedOption = option;
    //console.log('Selected Billing Type:', this.selectedOption);
    this.billingtypeEmit.emit(this.selectedOption);
  }

  clearSelection(input: HTMLInputElement) {
    this.selectedOption = null;

    this.myControl.setValue(null);

    this.onChange(null);
    this.onTouched();
    this.billingtypeEmit.emit(null);

    input.blur();
  }
}

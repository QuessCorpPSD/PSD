import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, InjectionToken, OnChanges, Input, OnInit, Output, ViewEncapsulation, forwardRef } from '@angular/core';
import { ReactiveFormsModule, FormControl, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Observable, startWith, map } from 'rxjs';
import { ICommonService } from '../../Repository/ICommonService';
import { CommonService } from '../../Service/CommonService';
import { IInvoiceRepository} from '../../Repository/IInvoiceRepository';
import { InvoiceRepository } from '../../Service/InvoiceRepository';
import { Payperiodclass } from '../../Models/Common';
export const COMM_TOKEN = new InjectionToken<ICommonService>('COMM_TOKEN');
export const Invoice_TOKEN = new InjectionToken<IInvoiceRepository>('Invoice_TOKEN');
@Component({
  selector: 'PayPeriod',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './payperiod.component.html',
  styleUrl: './payperiod.component.css',
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: COMM_TOKEN,
      useClass: CommonService,
    },
     {
    provide: Invoice_TOKEN,
    useClass: InvoiceRepository
  },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PayPeriodComponent),
      multi: true
    }
  ]

})
export class PayPeriodComponent implements ControlValueAccessor, OnChanges {
  @Input() selectedCompanyId?: number;
@Input() financialYearId?: number;
   @Input() payPeriodType?: string;
   @Input() selectedFinancialYear?: any;

  options: string[] = [];
  searchText: string = '';
  myControl = new FormControl<string | Payperiodclass>('');
  payperiodclass: Payperiodclass[] = [];
  filteredOptions$!: Observable<Payperiodclass[]>;
  selectedOption?: Payperiodclass;
  private pendingValue: any;
  onChange: any = () => { };
  onTouched: any = () => { };
    @Output() payperiodEmit = new EventEmitter<Payperiodclass>();
  constructor(@Inject(COMM_TOKEN) private _commonService: ICommonService,@Inject(Invoice_TOKEN) private _invoiceService:IInvoiceRepository) {

  }

ngOnChanges() {

  if (this.selectedCompanyId && this.selectedFinancialYear) {
console.log("Selected Company Id and Financial Year", this.selectedCompanyId, this.selectedFinancialYear);
    this.BindPayperiodnew(
      this.selectedCompanyId,
      this.selectedFinancialYear
    );
  }
  else if (this.selectedCompanyId) {

    this.BindPayperiod(this.selectedCompanyId);
  }
}
BindPayperiodnew(companyId: any, financialYearId: any) {

  const request = {
    Company_Id: String(companyId),
    Financial_Year_Id: String(financialYearId)
  };

  this._invoiceService.GetPayPeriod(request).subscribe({
    next: res => {

      this.payperiodclass = res.Data ?? [];
console.log("Payperiod by Company and Financial Year", res,this.payperiodclass);
      this.filteredOptions$ = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => {

          let searchText = '';

          if (typeof value === 'string') {
            searchText = value;
          }
          else if (value && typeof value === 'object') {
            searchText = value.payPeriod;
          }

          return this._filter(searchText);
        })
      );

      this.tryResolve();
    }
  });
}
 BindPayperiod(selectedCompanyId: any) {
  if (this.payPeriodType === "Current") {

      this._commonService.GetCurrentPayperiod(selectedCompanyId).subscribe({
        next: res => {

            this.payperiodclass = res.Data ?? [];

          this.tryResolve(); 
        }
      });

    } 
    else if (this.payPeriodType === "All") {
  this._commonService.GetPayperiodbyCompany(selectedCompanyId).subscribe({
    next: res => {

      this.payperiodclass = res.Data;

      this.filteredOptions$ = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => {
          let searchText = '';

          if (typeof value === 'string') {
            searchText = value;
          } else if (value && typeof value === 'object') {
            searchText = value.payPeriod;
          }

          return this._filter(searchText);
        })
      );

      this.tryResolve();
    }

  });
    }
}

private _filter(value: string): Payperiodclass[] {

  const filterValue = (value || '').toLowerCase();

  return this.payperiodclass.filter(option => {

    const payPeriod =
      option.payPeriod ||
      option.pay_Period ||
      '';

    return payPeriod.toLowerCase().includes(filterValue);
  });
}

 displayFn = (option?: any): string => {
  return option?.payPeriod || option?.pay_Period || '';
};
 onOptionSelected(option: Payperiodclass) {

  this.selectedOption = option;

  // Update textbox display
  this.myControl.setValue(option, { emitEvent: false });

  // Pass value to parent reactive form
  this.onChange(option.pay_Frequency_Detail_Id);

  // Mark touched
  this.onTouched();
  this.payperiodEmit.emit(option);

}
 writeValue(value: any): void {

  this.pendingValue = value;
console.log("Write Payperiod Value", value);
  if (!value) {
    this.myControl.setValue(null);
    return;
  }

  this.tryResolve();
}
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.myControl.disable() : this.myControl.enable();
  }
  private tryResolve() {
console.log("Payperiod with value:",  this.payperiodclass,this.pendingValue);
  if (!this.payperiodclass?.length || !this.pendingValue) return;

  const selected = this.payperiodclass.find(
    x => x.pay_Frequency_Detail_Id == this.pendingValue
  );

  if (selected) {
    this.selectedOption = selected;
    this.myControl.setValue(selected, { emitEvent: false });
  }
}
}

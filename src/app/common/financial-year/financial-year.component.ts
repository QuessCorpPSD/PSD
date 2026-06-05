import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, InjectionToken, OnInit, Output,ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Observable, startWith, map } from 'rxjs';
import { ICommonService } from '../../Repository/ICommonService';
import { CommonService } from '../../Service/CommonService';
import { FinancialYear } from '../../Models/Financeyear';
import { OnChanges, Input,  forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

export  const COMM_TOKEN=new InjectionToken<ICommonService>('COMM_TOKEN');
@Component({
    selector: 'financial-year',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatInputModule,
        MatFormFieldModule
    ],
    templateUrl: './financial-year.component.html',
    styleUrl: './financial-year.component.css',
    encapsulation: ViewEncapsulation.None,
    providers: [{
            provide: COMM_TOKEN,
            useClass: CommonService},
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FinancialYearComponent),
      multi: true
    }
  ]
})
export class FinancialYearComponent implements OnInit {
  searchText: string = '';
myControl = new FormControl<string | FinancialYear>('');
 financialYear: FinancialYear[] = [];
  filteredOptions$!: Observable<FinancialYear[]>;
  selectedOption?: FinancialYear;
  @Output() financialEmit = new EventEmitter<FinancialYear>();
    private pendingValue: any;
  onChange: any = () => { };
  onTouched: any = () => { };
constructor(@Inject(COMM_TOKEN) private _commonService: ICommonService)
{

}

  ngOnInit(): void {
    this.BindFinancialYear();
    
  }
BindFinancialYear() {
    this._commonService.GetFinancialYears().subscribe({
      next: res => {
        this.financialYear = res.Data;


      this.filteredOptions$ = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => {
          let searchText = '';

          if (typeof value === 'string') {
            searchText = value;
          } else if (value && typeof value === 'object') {
            searchText = value.financial_Year_Name;
          }

          return this._filter(searchText);
        })
      );

      this.tryResolve();
    }
  });
}

  private _filter(value: string): FinancialYear[] {
    const filterValue = value.toLowerCase();
    return this.financialYear.filter(option =>
      option.financial_Year_Name.toLowerCase().includes(filterValue)
    );
  }

  //displayFn = (option: any): string => option?.mapName ?? option.mapName;

  displayFn = (option?: FinancialYear): string => {
    return option?.financial_Year_Name ?? '';
  };

 onOptionSelected(option: FinancialYear) {

  this.selectedOption = option;

  // Update textbox display
  this.myControl.setValue(option, { emitEvent: false });

  // Pass value to parent reactive form
  this.onChange(option.financial_Year_Id);

  // Mark touched
  this.onTouched();

  // Emit event
  this.financialEmit.emit(option);
}
 writeValue(value: any): void {

  this.pendingValue = value;
  console.log("Write Financial Year Value", value);
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

  if (!this.financialYear?.length || !this.pendingValue) return;

  const selected = this.financialYear.find(
    x => x.financial_Year_Id == this.pendingValue
  );

  if (selected) {
    this.selectedOption = selected;
    this.myControl.setValue(selected, { emitEvent: false });
  }
}
}

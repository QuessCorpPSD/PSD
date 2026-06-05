import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, InjectionToken, OnChanges, Input, OnInit, Output, ViewEncapsulation, forwardRef } from '@angular/core';
import { ReactiveFormsModule, FormControl, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Observable, startWith, map } from 'rxjs';
import { statenameclass } from '../../Models/Common';
import { ICommonService } from '../../Repository/ICommonService';
import { CommonService } from '../../Service/CommonService';

export const COMM_TOKEN = new InjectionToken<ICommonService>('COMM_TOKEN');

@Component({
  selector: 'statename',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './statename.component.html',
  styleUrl: './statename.component.css',
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: COMM_TOKEN,
      useClass: CommonService,
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StatenameComponent),
      multi: true
    }
  ]
})
export class StatenameComponent implements ControlValueAccessor, OnChanges {
  @Input() selectedCompanyId?: number;
  options: string[] = [];
  searchText: string = '';
  myControl = new FormControl<string | statenameclass>('');
  statenameclass: statenameclass[] = [];
  filteredOptions$!: Observable<statenameclass[]>;
  selectedOption?: statenameclass;
  private pendingValue: any;
  onChange: any = () => { };
  onTouched: any = () => { };
  @Output() statenameEmit = new EventEmitter<statenameclass>();
  constructor(@Inject(COMM_TOKEN) private _commonService: ICommonService) {

  }

  ngOnChanges() {
    
    if (this.selectedCompanyId) {
      this.Bindstatename(this.selectedCompanyId);
    }
  }
Bindstatename(selectedCompanyId: any) {
  this._commonService.GetClientGstStateList(selectedCompanyId).subscribe({
    next: res => {

      this.statenameclass = res.Data ?? [];

      this.filteredOptions$ = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => {
          let searchText = '';

          if (typeof value === 'string') {
            searchText = value;
          } else if (value && typeof value === 'object') {
            searchText = value.state_Name;
          }

          return this._filter(searchText);
        })
      );
      setTimeout(() => {
        this.tryResolve();
      });
    }
  });
}
 
  private _filter(value: string): statenameclass[] {
    const filterValue = value.toLowerCase();
    return this.statenameclass.filter(option =>
      option.state_Name.toLowerCase().includes(filterValue)
    );
  }

  //displayFn = (option: any): string => option?.mapName ?? option.mapName;

  displayFn = (option?: statenameclass): string => {
    return option?.state_Name ?? '';
  };

 onOptionSelected(option: statenameclass) {

  this.selectedOption = option;

  // Update textbox display
  this.myControl.setValue(option, { emitEvent: false });

  // Pass value to parent reactive form
  this.onChange(option.stateId);

  // Mark touched
  this.onTouched();

  // Emit event
  this.statenameEmit.emit(option);
}
writeValue(value: any): void {
  this.pendingValue = value;

  if (!value) {
    this.myControl.setValue(null, { emitEvent: false });
    return;
  }
//console.log("Write State Value", value,  this.pendingValue);
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

  //console.log("Try Resolve State", this.statenameclass, this.pendingValue);

  if (!this.statenameclass?.length || !this.pendingValue) return;

  const selected = this.statenameclass.find(
    x => Number(x.stateId
) === Number(this.pendingValue)
  );

  //console.log("Selected State", selected);

  if (selected) {
    this.selectedOption = selected;
    this.myControl.setValue(selected, { emitEvent: false });
  }
}
}

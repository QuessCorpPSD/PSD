
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, InjectionToken, OnChanges, Input, OnInit, Output, ViewEncapsulation, forwardRef } from '@angular/core';
import { ReactiveFormsModule, FormControl, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Observable, startWith, map } from 'rxjs';
import { ICommonService } from '../../../Repository/ICommonService';
import { CommonService } from '../../../Service/CommonService';
import { Cityclass, Company, Mapnameclass } from '../../../Models/Common';
export const COMM_TOKEN = new InjectionToken<ICommonService>('COMM_TOKEN');

@Component({
  selector: 'mapname',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './mapname.component.html',
  styleUrl: './mapname.component.css',
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: COMM_TOKEN,
      useClass: CommonService,
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MapnameComponent),
      multi: true
    }
  ]
})
export class MapnameComponent implements ControlValueAccessor, OnChanges {
  @Input() selectedCompanyId?: number;
  options: string[] = [];
  searchText: string = '';
  myControl = new FormControl<string | Mapnameclass>('');
  mapNameclass: Mapnameclass[] = [];
  filteredOptions$!: Observable<Mapnameclass[]>;
  selectedOption?: Mapnameclass;
  private pendingValue: any;
  onChange: any = () => { };
  onTouched: any = () => { };
  @Output() mapnameEmit = new EventEmitter<Mapnameclass>();
  constructor(@Inject(COMM_TOKEN) private _commonService: ICommonService) {

  }

  ngOnChanges() {
    
    if (this.selectedCompanyId) {
      this.Bindmapname(this.selectedCompanyId);
    }
  }

 Bindmapname(selectedCompanyId: any) {
  this._commonService.GetMapNamebyCompany(selectedCompanyId).subscribe({
    next: res => {

      this.mapNameclass = res.Data;

      this.filteredOptions$ = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => {
          let searchText = '';

          if (typeof value === 'string') {
            searchText = value;
          } else if (value && typeof value === 'object') {
            searchText = value.mapName;
          }

          return this._filter(searchText);
        })
      );

      this.tryResolve();
    }
  });
}

  private _filter(value: string): Mapnameclass[] {
    const filterValue = value.toLowerCase();
    return this.mapNameclass.filter(option =>
      option.mapName.toLowerCase().includes(filterValue)
    );
  }

  //displayFn = (option: any): string => option?.mapName ?? option.mapName;

  displayFn = (option?: Mapnameclass): string => {
    return option?.mapName ?? '';
  };

 onOptionSelected(option: Mapnameclass) {

  this.selectedOption = option;

  // Update textbox display
  this.myControl.setValue(option, { emitEvent: false });

  // Pass value to parent reactive form
  this.onChange(option.mapNameId);

  // Mark touched
  this.onTouched();

  // Emit event
  this.mapnameEmit.emit(option);
}
 writeValue(value: any): void {

  this.pendingValue = value;
console.log("Write Map Value", value);
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

  if (!this.mapNameclass?.length || !this.pendingValue) return;

  const selected = this.mapNameclass.find(
    x => x.mapNameId == this.pendingValue
  );

  if (selected) {
    this.selectedOption = selected;
    this.myControl.setValue(selected, { emitEvent: false });
  }
}
}

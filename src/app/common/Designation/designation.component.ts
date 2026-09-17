import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, InjectionToken, OnChanges, Input, OnInit, Output, ViewEncapsulation, forwardRef } from '@angular/core';
import { ReactiveFormsModule, FormControl, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Observable, startWith, map } from 'rxjs';
import { designationclass } from '../../Models/Common';
import { ICommonService } from '../../Repository/ICommonService';
import { CommonService } from '../../Service/CommonService';
import { MatIconModule } from '@angular/material/icon';
export const COMM_TOKEN = new InjectionToken<ICommonService>('COMM_TOKEN');


@Component({
  selector: 'designation',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule, MatIconModule],
  templateUrl: './designation.component.html',
  styleUrl: './designation.component.css',
  encapsulation: ViewEncapsulation.None,
  providers: [{
    provide: COMM_TOKEN,
    useClass: CommonService
  }, {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DesignationComponent),
    multi: true
  }]
})
export class DesignationComponent implements ControlValueAccessor, OnChanges {
  @Input() selectedCompanyId?: number;
  @Input() selectedOption?: designationclass | null;
  options: string[] = [];
  searchText: string = '';
  myControl = new FormControl<string | designationclass>('');
  Designation: designationclass[] = [];
  selectedDesignation?: any;
  filteredOptions$!: Observable<designationclass[]>;
  @Output() designationEmit = new EventEmitter<designationclass | null>();
  constructor(@Inject(COMM_TOKEN) private _commonService: ICommonService) {

  }
  ngOnChanges() {
    if (this.selectedCompanyId) {
      this.BindDesignation(this.selectedCompanyId);
    }
  }

  BindDesignation(selectedCompanyId: any) {
    this._commonService.GetDesignationbyCompany(selectedCompanyId).subscribe({
      next: res => {
        this.Designation = res.Data;
        //console.log(res.Data);
        this.filteredOptions$ = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => {
            let searchText = '';

            if (typeof value === 'string') {
              searchText = value;
            } else if (value && typeof value === 'object' && 'designation_Name' in value) {
              searchText = value?.designation_Name;
            }

            return this._filter(searchText);
          })
        );
      },
      error: err => console.error(err.message)
    });
  }

  private onChange =
    (value: designationclass | null) => { };

  private onTouched = () => { };

  writeValue(value: designationclass | null): void {

    console.log('Designation received:', value);

    this.selectedDesignation = value ?? undefined;
    this.selectedOption = value ?? undefined;

    this.myControl.setValue(
      value ?? '',
      { emitEvent: false }
    );
  }

  registerOnChange(
    fn: (value: designationclass | null) => void
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

  private _filter(value: string): designationclass[] {
    const filterValue = value.toLowerCase();
    return this.Designation.filter(option =>
      option.designation_Name.toLowerCase().includes(filterValue)
    );
  }

  displayFn(value: any): string {
    return value?.designation_Name ?? '';
  }

  onOptionSelected(option: any) {
    this.selectedOption = option;
    this.designationEmit.emit(this.selectedOption);
  }

  clearSelection(input: HTMLInputElement) {
    this.selectedOption = null;

    this.myControl.setValue(null);

    this.onChange(null);
    this.onTouched();
    this.designationEmit.emit(null);

    input.blur();
  }
}
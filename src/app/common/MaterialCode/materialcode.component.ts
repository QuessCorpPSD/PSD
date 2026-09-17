import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, InjectionToken, OnChanges, Input, OnInit, Output, ViewEncapsulation, forwardRef } from '@angular/core';
import { ReactiveFormsModule, FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Observable, startWith, map } from 'rxjs';
import { materialCodeClass } from '../../Models/Common';
import { ICommonService } from '../../Repository/ICommonService';
import { CommonService } from '../../Service/CommonService';
import { MatIconModule } from '@angular/material/icon';
export const COMM_TOKEN = new InjectionToken<ICommonService>('COMM_TOKEN');


@Component({
  selector: 'materialcode',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,MatIconModule],
  templateUrl: './materialcode.component.html',
  styleUrl: './materialcode.component.css',
  encapsulation: ViewEncapsulation.None,
  providers: [{
    provide: COMM_TOKEN,
    useClass: CommonService
  }, {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MaterialCodeComponent),
    multi: true
  }]
})
export class MaterialCodeComponent implements ControlValueAccessor {
  @Input() selectedOption?: materialCodeClass | null;
  options: string[] = [];
  searchText: string = '';
  myControl = new FormControl<string | materialCodeClass>('');
  MaterialCodes: materialCodeClass[] = [];
  filteredOptions$!: Observable<materialCodeClass[]>;
  selectedMaterialCode?: any;
  @Output() materialCodeEmit = new EventEmitter<materialCodeClass | null>();
  constructor(@Inject(COMM_TOKEN) private _commonService: ICommonService) {

  }
  ngOnInit() {
    this.BindMaterialCodes();
  }

  BindMaterialCodes() {
    this._commonService.GetMaterialCodes().subscribe({
      next: res => {
        this.MaterialCodes = res.Data.data.Table0;

        //console.log('material codes', this.MaterialCodes);

        this.filteredOptions$ = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => {
            let searchText = '';

            if (typeof value === 'string') {
              searchText = value;
            } else if (
              value &&
              typeof value === 'object' &&
              'Code' in value &&
              'Description' in value
            ) {
              searchText = `${value.Code} - ${value.Description}`;
            }

            return this._filter(searchText);
          })
        );
      },
      error: err => console.error(err.message)
    });
  }

  private onChange =
    (value: materialCodeClass | null) => { };

  private onTouched = () => { };

  writeValue(value: materialCodeClass | null): void {

    console.log('MaterialCode received:', value);

    this.selectedMaterialCode = value ?? undefined;
    this.selectedOption = value ?? undefined;

    this.myControl.setValue(
      value ?? '',
      { emitEvent: false }
    );
  }

  registerOnChange(
    fn: (value: materialCodeClass | null) => void
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

  private _filter(value: string): materialCodeClass[] {
    const filterValue = value.toLowerCase().trim();

    return this.MaterialCodes.filter(option =>
      `${option.Code} - ${option?.Description}`
        .toLowerCase()
        .includes(filterValue)
    );
  }
  displayFn(value: any): string {
    return value?`${value.Code} - ${value?.Description}` : '';
  } 
  
  onOptionSelected(option: any) {
    this.selectedOption = option;
    this.materialCodeEmit.emit(this.selectedOption);
  }

  
clearSelection(input: HTMLInputElement) {
    this.selectedOption = null;

    this.myControl.setValue(null);

    this.onChange(null);
    this.onTouched();
    this.materialCodeEmit.emit(null);

    input.blur();
  }
}
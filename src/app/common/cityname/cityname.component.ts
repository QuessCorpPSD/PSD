import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Inject,
  InjectionToken,
  Input,
  OnChanges,
  Output,
  ViewEncapsulation,
  forwardRef
} from '@angular/core';

import {
  ReactiveFormsModule,
  FormControl,
  NG_VALUE_ACCESSOR,
  ControlValueAccessor
} from '@angular/forms';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { Observable, startWith, map } from 'rxjs';

import { citynameclass } from '../../Models/Common';
import { ICommonService } from '../../Repository/ICommonService';
import { CommonService } from '../../Service/CommonService';

export const COMM_TOKEN = new InjectionToken<ICommonService>('COMM_TOKEN');

@Component({
  selector: 'cityname',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './cityname.component.html',
  styleUrl: './cityname.component.css',
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: COMM_TOKEN,
      useClass: CommonService
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CitynameComponent),
      multi: true
    }
  ]
})
export class CitynameComponent
  implements OnChanges, ControlValueAccessor {

  @Input() selectedCompanyId?: number;

  @Output() citynameEmit = new EventEmitter<citynameclass>();

  myControl = new FormControl<string | citynameclass>('');

  cityName: citynameclass[] = [];

  filteredOptions$!: Observable<citynameclass[]>;

  selectedOption?: citynameclass;

  private pendingValue: any;

  constructor(
    @Inject(COMM_TOKEN)
    private _commonService: ICommonService
  ) { }

  // -----------------------------
  // ControlValueAccessor
  // -----------------------------

  onChange: any = () => { };

  onTouched: any = () => { };

  writeValue(value: any): void {

    this.pendingValue = value;

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
    isDisabled
      ? this.myControl.disable()
      : this.myControl.enable();
  }

  // -----------------------------
  // Load City Based On Company
  // -----------------------------

  ngOnChanges(): void {

    if (this.selectedCompanyId) {
      this.bindCity(this.selectedCompanyId);
    }
  }

  bindCity(selectedCompanyId: any) {

    this._commonService
      .GetAutoEntityLocation(selectedCompanyId)
      .subscribe({

        next: res => {

          this.cityName = res.Data ?? [];

          console.log('City List', this.cityName);

          this.filteredOptions$ =
            this.myControl.valueChanges.pipe(

              startWith(''),

              map(value => {

                let searchText = '';

                if (typeof value === 'string') {
                  searchText = value;
                }
                else if (value) {
                  searchText = value.city_Name;
                }

                return this._filter(searchText);
              })
            );

          // Resolve edit mode value
          this.tryResolve();
        },

        error: err => console.error(err.message)
      });
  }

  // -----------------------------
  // Filter
  // -----------------------------

  private _filter(value: string | null | undefined): citynameclass[] {

    const filterValue = (value ?? '').toLowerCase();

    return (this.cityName ?? [])
      .filter(
        (city): city is citynameclass =>
          !!city &&
          typeof city.city_Name === 'string'
      )
      .filter(city =>
        city.city_Name
          .toLowerCase()
          .includes(filterValue)
      );
  }

  // -----------------------------
  // Display
  // -----------------------------

  displayFn = (option?: citynameclass): string => {
    return option?.city_Name ?? '';
  };

  // -----------------------------
  // Select
  // -----------------------------

  onOptionSelected(option: citynameclass) {

    this.selectedOption = option;

    // Display selected object
    this.myControl.setValue(option, {
      emitEvent: false
    });

    // Send only ID to form
    this.onChange(option.city_Id);

    this.onTouched();

    this.citynameEmit.emit(option);
  }

  // -----------------------------
  // Resolve Edit Value
  // -----------------------------

  private tryResolve() {

    if (!this.cityName?.length || !this.pendingValue) {
      return;
    }

    const selected = this.cityName.find(
      x => x.city_Id == this.pendingValue
    );

    if (selected) {

      this.selectedOption = selected;

      this.myControl.setValue(selected, {
        emitEvent: false
      });
    }
  }
}
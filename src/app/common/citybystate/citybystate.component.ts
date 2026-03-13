import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  forwardRef,
  Inject,
  InjectionToken,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { ReactiveFormsModule, FormControl, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { MatAutocompleteModule, MatAutocomplete } from '@angular/material/autocomplete';
import { MatInputModule, MatFormField } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Observable, startWith, map } from 'rxjs';
import { Company, citynameclass } from '../../Models/Common';
import { ICommonService } from '../../Repository/ICommonService';
import { CommonService } from '../../Service/CommonService';
export const COMM_TOKEN = new InjectionToken<ICommonService>('COMM_TOKEN');


@Component({
  selector: 'citybystate',
  imports: [CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule],
  templateUrl: './citybystate.component.html',
  styleUrl: './citybystate.component.css',
  providers: [
    {
      provide: COMM_TOKEN,
      useClass: CommonService
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CitybystateComponent),
      multi: true
    }
  ]
})

export class CitybystateComponent implements ControlValueAccessor, OnChanges {
  @Input() selectedStateId?: number;
  @Input() readonly: boolean = false;
  options: string[] = [];
  searchText: string = '';
  myControl = new FormControl<string | citynameclass>('');
  cityName: citynameclass[] = [];
  filteredOptions$!: Observable<citynameclass[]>;
  selectedOption?: citynameclass;
  onChange: any = () => { };
  onTouched: any = () => { };
  @Output() citybyStateEmit = new EventEmitter<citynameclass>();

  constructor(
    @Inject(COMM_TOKEN) private _commonService: ICommonService
  ) { }


  ngOnChanges(changes: SimpleChanges): void {
    //console.log('state', this.selectedStateId);
    if (this.selectedStateId) {
      this.bindCityByState(this.selectedStateId);
    }
    if (changes['readonly']) {
      if (this.readonly) {
        this.myControl.disable({ emitEvent: false });
      } else {
        this.myControl.enable({ emitEvent: false });
      }
    }
  }

  bindCityByState(selectedStateId: any) {
    this._commonService.GetAllcityBystate(selectedStateId).subscribe({
      next: res => {
        this.cityName = res.Data;
        //console.log(res.Data);
        this.filteredOptions$ = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => {
            let searchText = '';

            if (typeof value === 'string') {
              searchText = value;
            } else if (value) {
              searchText = value?.city_Name;
            }

            return this._filter(searchText);
          })
        );
      },
      error: err => console.error(err.message)
    });
  }
  private _filter(value: string | null | undefined): citynameclass[] {
    const filterValue = (value ?? '').toLowerCase();

    return (this.cityName ?? [])
      .filter(
        (city): city is citynameclass =>
          !!city && typeof city.city_Name === 'string'
      )
      .filter(city =>
        city.city_Name.toLowerCase().includes(filterValue)
      );
  }

  displayFn = (option?: citynameclass): string => {
    return option?.city_Name ?? '';
  };

  onOptionSelected(option: any) {
    this.selectedOption = option;
    this.citybyStateEmit.emit(this.selectedOption);
  }

  writeValue(value: citynameclass | null): void {
    if (value) {
      this.selectedOption = value;
      this.myControl.setValue(value, { emitEvent: false });
    } else {
      this.myControl.reset();
    }
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
}



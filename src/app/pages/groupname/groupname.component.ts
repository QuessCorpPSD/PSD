import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Inject,
  InjectionToken,
  Input,
  Output,
  ViewEncapsulation,
  forwardRef,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import {
  ReactiveFormsModule,
  FormControl,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { Observable, startWith, map } from 'rxjs';

import { Groupnameclass } from '../../Models/Common';
import { ICommonService } from '../../Repository/ICommonService';
import { CommonService } from '../../Service/CommonService';

export const COMM_TOKEN = new InjectionToken<ICommonService>('COMM_TOKEN');

@Component({
  selector: 'groupname',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './groupname.component.html',
  styleUrl: './groupname.component.css',
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: COMM_TOKEN,
      useClass: CommonService,
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GroupnameComponent),
      multi: true
    }
  ]
})
export class GroupnameComponent
  implements ControlValueAccessor, OnChanges {

  @Input() selectedCompanyId?: number;

  @Output() sitenameEmit = new EventEmitter<Groupnameclass>();

  searchText: string = '';

  myControl = new FormControl<string | Groupnameclass>('');

  siteName: Groupnameclass[] = [];

  filteredOptions$!: Observable<Groupnameclass[]>;

  selectedOption?: Groupnameclass;

  private pendingValue: any;

  // CVA callbacks
  onChange: any = () => {};
  onTouched: any = () => {};

  constructor(
    @Inject(COMM_TOKEN)
    private _commonService: ICommonService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {

    if (
      changes['selectedCompanyId'] &&
      this.selectedCompanyId
    ) {
      this.Bindmapname(this.selectedCompanyId);
    }
  }

  Bindmapname(selectedCompanyId: any) {

    this._commonService
      .GetSitesByCompanyId(selectedCompanyId)
      .subscribe({

        next: res => {

          this.siteName = res.Data || [];

          this.filteredOptions$ =
            this.myControl.valueChanges.pipe(

              startWith(''),

              map(value => {

                let searchText = '';

                if (typeof value === 'string') {
                  searchText = value;
                }

                else if (
                  value &&
                  typeof value === 'object'
                ) {
                  searchText = value.siteName ?? '';
                }

                return this._filter(searchText);

              })
            );

          // EDIT MODE FIX
          this.tryResolve();
        },

        error: err => console.error(err.message)

      });
  }

  private _filter(value: string): Groupnameclass[] {

    const filterValue = value.toLowerCase();

    return this.siteName.filter(option =>
      option.siteName
        .toLowerCase()
        .includes(filterValue)
    );
  }

  displayFn = (
    option?: Groupnameclass
  ): string => {

    return option?.siteName ?? '';
  };

  onOptionSelected(option: Groupnameclass) {

    this.selectedOption = option;

    // display text
    this.myControl.setValue(
      option,
      { emitEvent: false }
    );

    // form value
    this.onChange(option.siteCode);

    this.onTouched();

    this.sitenameEmit.emit(option);
  }

  writeValue(value: any): void {

    this.pendingValue = value;
console.log("Write Group Value", value);
    if (!value) {

      this.myControl.setValue(null);

      return;
    }

    this.tryResolve();
  }

  private tryResolve() {

    if (!this.siteName?.length || !this.pendingValue)
      return;

    const selected = this.siteName.find(
      x => x.siteCode == this.pendingValue
    );
console.log("Group Try Resolve with value:", this.siteName, this.pendingValue, selected);
    if (selected) {

      this.selectedOption = selected;

      this.myControl.setValue(
        selected,
        { emitEvent: false }
      );
    }
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
}
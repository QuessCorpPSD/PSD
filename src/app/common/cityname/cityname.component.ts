import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Inject,
  InjectionToken,
  Input,
  OnChanges,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Observable, startWith, map } from 'rxjs';
import { Company,citynameclass } from '../../Models/Common';
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
    }
  ]
})
export class CitynameComponent implements OnChanges {

  @Input() selectedCompanyId?: number;
  options: string[] = [];
  searchText: string = '';
  myControl = new FormControl<string | citynameclass>('');
  cityName: citynameclass[] = [];
  filteredOptions$!: Observable<citynameclass[]>;
  selectedOption?: citynameclass;
  @Output() citynameEmit = new EventEmitter<citynameclass>();
  constructor(
    @Inject(COMM_TOKEN) private _commonService: ICommonService
  ) {}

  ngOnChanges(): void {
    if (this.selectedCompanyId) {
      this.bindCity(this.selectedCompanyId);
     
    }
  }

  bindCity(selectedCompanyId: any) {
      this._commonService.GetAutoEntityLocation(selectedCompanyId).subscribe({
        next: res => {
          this.cityName = res.Data;
           console.log(res.Data);
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
      this.citynameEmit.emit(this.selectedOption);
    }
  }
  
  

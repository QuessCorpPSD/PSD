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
      useClass: CommonService
    }
  ]
})
export class StatenameComponent implements OnChanges {
  @Input() selectedCompanyId?: number;
  @Output() statenameEmit = new EventEmitter<statenameclass>();

  myControl = new FormControl<string | statenameclass>('');
  stateName: statenameclass[] = [];
  filteredStates$!: Observable<statenameclass[]>;
  selectedState?: statenameclass;

  constructor(
    @Inject(COMM_TOKEN) private _commonService: ICommonService
  ) {}

  ngOnChanges(): void {
    if (this.selectedCompanyId) {
      this.bindStates(this.selectedCompanyId);
    }
  }

  bindStates(selectedCompanyId: any) {
    this._commonService.GetClientGstStateList(selectedCompanyId).subscribe({
      next: res => {
        this.stateName = res.Data ?? [];
        console.log(res.Data);
        this.filteredStates$ = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => {
            if (typeof value === 'string') {
              return this._filter(value);
            }
            if (value) {
              return this._filter(value.state_Name);
            }
            return this._filter('');
          })
        );
      },
      error: err => console.error(err.message)
    });
  }

  private _filter(value: string | null | undefined): statenameclass[] {
    const filterValue = (value ?? '').toLowerCase();

    return (this.stateName ?? [])
      .filter(
        (state): state is statenameclass =>
          !!state && typeof state.state_Name === 'string'
      )
      .filter(state =>
        state.state_Name.toLowerCase().includes(filterValue)
      );
  }

  displayFn = (option?: statenameclass): string => {
    return option?.state_Name ?? '';
  };

  onOptionSelected(state: statenameclass) {
    this.selectedState = state;
    this.statenameEmit.emit(state);
  }
}

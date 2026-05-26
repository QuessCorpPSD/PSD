import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyfilterComponent } from './companyfilter.component';

describe('CompanyfilterComponent', () => {
  let component: CompanyfilterComponent;
  let fixture: ComponentFixture<CompanyfilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyfilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyfilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

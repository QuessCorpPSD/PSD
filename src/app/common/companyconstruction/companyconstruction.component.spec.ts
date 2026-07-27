import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyconstructionComponent } from './companyconstruction.component';

describe('CompanyconstructionComponent', () => {
  let component: CompanyconstructionComponent;
  let fixture: ComponentFixture<CompanyconstructionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyconstructionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyconstructionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalEntityMappingComponent } from './legal-entity-mapping.component';

describe('LegalEntityMappingComponent', () => {
  let component: LegalEntityMappingComponent;
  let fixture: ComponentFixture<LegalEntityMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegalEntityMappingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LegalEntityMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

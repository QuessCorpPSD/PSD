import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntitybillingComponent } from './entitybilling.component';

describe('EntitybillingComponent', () => {
  let component: EntitybillingComponent;
  let fixture: ComponentFixture<EntitybillingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntitybillingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntitybillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

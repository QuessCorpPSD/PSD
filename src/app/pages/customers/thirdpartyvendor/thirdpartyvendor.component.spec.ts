import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdpartyvendorComponent } from './thirdpartyvendor.component';

describe('ThirdpartyvendorComponent', () => {
  let component: ThirdpartyvendorComponent;
  let fixture: ComponentFixture<ThirdpartyvendorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThirdpartyvendorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThirdpartyvendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

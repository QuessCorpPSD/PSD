import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PTRuleComponent } from './ptrule.component';

describe('PTRuleComponent', () => {
  let component: PTRuleComponent;
  let fixture: ComponentFixture<PTRuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PTRuleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PTRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

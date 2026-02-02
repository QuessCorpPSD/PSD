import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReimbursenavigationComponent } from './reimbursenavigation.component';

describe('ReimbursenavigationComponent', () => {
  let component: ReimbursenavigationComponent;
  let fixture: ComponentFixture<ReimbursenavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReimbursenavigationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReimbursenavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

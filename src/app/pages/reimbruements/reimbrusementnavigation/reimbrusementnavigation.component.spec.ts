import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReimbrusementnavigationComponent } from './reimbrusementnavigation.component';

describe('ReimbrusementnavigationComponent', () => {
  let component: ReimbrusementnavigationComponent;
  let fixture: ComponentFixture<ReimbrusementnavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReimbrusementnavigationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReimbrusementnavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

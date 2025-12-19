import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnauthendicationComponent } from './unauthendication.component';

describe('UnauthendicationComponent', () => {
  let component: UnauthendicationComponent;
  let fixture: ComponentFixture<UnauthendicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnauthendicationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnauthendicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

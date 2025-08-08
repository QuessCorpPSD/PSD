import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReconregisterComponent } from './reconregister.component';

describe('ReconregisterComponent', () => {
  let component: ReconregisterComponent;
  let fixture: ComponentFixture<ReconregisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReconregisterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReconregisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

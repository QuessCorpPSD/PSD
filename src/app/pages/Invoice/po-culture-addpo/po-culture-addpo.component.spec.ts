import { ComponentFixture, TestBed } from '@angular/core/testing';

import { POCultureAddpoComponent } from './po-culture-addpo.component';

describe('POCultureAddpoComponent', () => {
  let component: POCultureAddpoComponent;
  let fixture: ComponentFixture<POCultureAddpoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [POCultureAddpoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(POCultureAddpoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

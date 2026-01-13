import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanypermissionaddComponent } from './companypermissionadd.component';

describe('CompanypermissionaddComponent', () => {
  let component: CompanypermissionaddComponent;
  let fixture: ComponentFixture<CompanypermissionaddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanypermissionaddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompanypermissionaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

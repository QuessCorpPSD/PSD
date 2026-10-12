import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanygroupmasterComponent } from './companygroupmaster.component';

describe('CompanygroupmasterComponent', () => {
  let component: CompanygroupmasterComponent;
  let fixture: ComponentFixture<CompanygroupmasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanygroupmasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanygroupmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

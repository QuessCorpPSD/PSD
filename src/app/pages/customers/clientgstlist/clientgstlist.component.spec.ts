import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientgstlistComponent } from './clientgstlist.component';

describe('ClientgstlistComponent', () => {
  let component: ClientgstlistComponent;
  let fixture: ComponentFixture<ClientgstlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientgstlistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientgstlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAdminDisplayComponent } from './user-admin-display.component';

describe('UserAdminDisplayComponent', () => {
  let component: UserAdminDisplayComponent;
  let fixture: ComponentFixture<UserAdminDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserAdminDisplayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserAdminDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

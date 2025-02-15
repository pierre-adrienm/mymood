import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageuserComponent } from './manageuser.component';

describe('ManageuserComponent', () => {
  let component: ManageuserComponent;
  let fixture: ComponentFixture<ManageuserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageuserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

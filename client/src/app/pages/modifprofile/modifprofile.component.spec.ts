import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifprofileComponent } from './modifprofile.component';

describe('ModifprofileComponent', () => {
  let component: ModifprofileComponent;
  let fixture: ComponentFixture<ModifprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifprofileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilgroupComponent } from './profilgroup.component';

describe('ProfilgroupComponent', () => {
  let component: ProfilgroupComponent;
  let fixture: ComponentFixture<ProfilgroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilgroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilgroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

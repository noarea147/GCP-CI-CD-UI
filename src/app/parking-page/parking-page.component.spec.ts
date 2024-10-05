import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingPageComponent } from './parking-page.component';

describe('ParkingPageComponent', () => {
  let component: ParkingPageComponent;
  let fixture: ComponentFixture<ParkingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParkingPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParkingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

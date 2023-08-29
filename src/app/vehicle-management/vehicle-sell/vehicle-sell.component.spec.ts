import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleSellComponent } from './vehicle-sell.component';

describe('VehicleSellComponent', () => {
  let component: VehicleSellComponent;
  let fixture: ComponentFixture<VehicleSellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleSellComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleSellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

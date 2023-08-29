import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinalagiListComponent } from './sinalagi-list.component';

describe('SinalagiListComponent', () => {
  let component: SinalagiListComponent;
  let fixture: ComponentFixture<SinalagiListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SinalagiListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SinalagiListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

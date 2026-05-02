import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleEditor } from './vehicle-editor';

describe('VehicleEditor', () => {
  let component: VehicleEditor;
  let fixture: ComponentFixture<VehicleEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleEditor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleEditor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

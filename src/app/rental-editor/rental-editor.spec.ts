import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentalEditor } from './rental-editor';

describe('RentalEditor', () => {
  let component: RentalEditor;
  let fixture: ComponentFixture<RentalEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RentalEditor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RentalEditor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

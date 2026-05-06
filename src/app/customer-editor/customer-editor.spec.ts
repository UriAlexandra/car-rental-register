import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerEditor } from './customer-editor';

//(unit test) keretrendszeréhez tartozik
describe('CustomerEditor', () => {
  let component: CustomerEditor;
  let fixture: ComponentFixture<CustomerEditor>;

  // A beforeEach minden teszteset előtt lefut, beállítja a teszt környezetet
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerEditor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerEditor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  //ellenőrzi, hogy a komponenst sikerült-e hiba nélkül létrehozni.
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

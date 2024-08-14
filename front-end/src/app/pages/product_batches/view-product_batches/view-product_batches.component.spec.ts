import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewProductBatchComponent } from './view-product_batches.component'; // Cambiar la importación del componente

describe('ViewProductBatchesComponent', () => { // Cambiar el nombre del componente
  let component: ViewProductBatchComponent; // Cambiar el nombre del componente
  let fixture: ComponentFixture<ViewProductBatchComponent>; // Cambiar el nombre del componente

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewProductBatchComponent] // Cambiar el nombre del componente
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewProductBatchComponent); // Cambiar el nombre del componente
    component = fixture.componentInstance; // Cambiar el nombre del componente
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

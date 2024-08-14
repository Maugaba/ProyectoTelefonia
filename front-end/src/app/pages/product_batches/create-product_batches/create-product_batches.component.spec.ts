import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateProductBatchesComponent } from './create-product_batches.component'; // Ajusta el nombre del componente

describe('CreateProductBatchesComponent', () => { // Ajusta el nombre del componente
  let component: CreateProductBatchesComponent;
  let fixture: ComponentFixture<CreateProductBatchesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateProductBatchesComponent] // Ajusta el nombre del componente
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateProductBatchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

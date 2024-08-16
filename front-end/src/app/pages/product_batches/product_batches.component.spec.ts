import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductBatchesComponent } from './product_batches.component';

describe('ProductbatcheComponent', () => {
  let component: ProductBatchesComponent;
  let fixture: ComponentFixture<ProductBatchesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductBatchesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductBatchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


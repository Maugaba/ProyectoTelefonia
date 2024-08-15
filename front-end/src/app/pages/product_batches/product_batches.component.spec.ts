import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductbatcheComponent } from './product_batches.component';

describe('ProductbatcheComponent', () => {
  let component: ProductbatcheComponent;
  let fixture: ComponentFixture<ProductbatcheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductbatcheComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductbatcheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


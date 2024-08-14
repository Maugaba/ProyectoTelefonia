import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SaleService } from '../sale.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-sale',
  templateUrl: './view-sale.component.html',
  styleUrls: ['./view-sale.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ViewSaleComponent implements OnInit {
  saleDetails: any;

  constructor(
    private saleService: SaleService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Obtén el ID de la venta de la ruta
    const saleIdString = this.route.snapshot.paramMap.get('id');

    // Verifica si el ID es válido antes de convertirlo
    if (saleIdString !== null) {
        const saleId = +saleIdString; // Convierte el ID a un número

        if (saleId > 0) {
            this.getSaleDetails(saleId); // Llama a la función para obtener los detalles
        } else {
            console.error('ID de venta inválido:', saleId);
            // Podrías redirigir al usuario o mostrar un mensaje de error en la interfaz
        }
    } else {
        console.error('ID de venta no encontrado en la ruta.');
        // Podrías redirigir al usuario o mostrar un mensaje de error en la interfaz
    }
}



getSaleDetails(saleId: number): void {
  this.saleService.getSaleById(saleId).subscribe(
      (data) => {
          this.saleDetails = data;
      },
      (error) => {
          console.error('Error fetching sale details:', error);
          // Muestra un mensaje de error adecuado al usuario
      }
  );
}

  
}

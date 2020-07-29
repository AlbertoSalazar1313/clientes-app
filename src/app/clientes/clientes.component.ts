import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[];
  paginador: any;

  constructor(private clienteService: ClienteService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {

    this.activatedRoute.paramMap.subscribe(params => {
      let page: number = +params.get('page');
      if (!page) {
        page = 0;
      }
      this.clienteService.getClientes(page)
        .pipe(
          tap(response => {
            console.log('Third Tap');
            (response.content as Cliente[]).forEach(cliente => {
              console.log("CLIENT ID: " + cliente.id + "\nFULL NAME: " + cliente.nombre, cliente.apellido + "\nDATE: " + cliente.createAt);
            });
          })
        ).subscribe(response => {
          this.clientes = response.content as Cliente[];
          this.paginador = response;
        }
        );
    }
    );

  }
  delete(cliente: Cliente): void {
    Swal.fire({
      title: 'Estas seguro?',
      text: `Seguro qué desea eliminar al cliente ${cliente.nombre} ${cliente.apellido}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.clienteService.delete(cliente.id).subscribe(
          response => {
            this.clientes = this.clientes.filter(cli => cli !== cliente)
            Swal.fire(
              'Cliente eliminado',
              `Se ha eliminado exitosamente al cliente ${cliente.nombre} ${cliente.apellido}`,
              'success'
            )
          }

        );
      }
    })
  }
}

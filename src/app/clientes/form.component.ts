import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  public cliente: Cliente = new Cliente();
  titulo: string = "Registrar Cliente";
  errores: string[];

  constructor(private clienteService: ClienteService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarcliente();
  }

  cargarcliente(): void {
    this.activatedRoute.params.subscribe(
      params => {
        let id = params['id']
        if (id) {
          this.clienteService.getCliente(id).subscribe((cliente) => this.cliente = cliente)
        }
      }
    )
  }

  public create(): void {
    this.clienteService.create(this.cliente).subscribe(
      JSON => {
        this.router.navigate(['/clientes'])
        swal.fire('Nuevo Cliente', `${JSON.mensaje} : ${JSON.cliente.nombre} ${JSON.cliente.apellido}`, 'success')
      },
      err => {
        this.errores = err.error.errors as string[];
        console.error('Código de error de la petición: ' + err.error.status);
        console.error(err.error.errors);
      }
    )
    console.log("clicked");
    console.log(this.cliente);
  }
  update(): void {
    this.clienteService.update(this.cliente).subscribe(
      JSON => {
        this.router.navigate(['/clientes'])
        swal.fire('Cliente Actualizado', `${JSON.mensaje} : ${JSON.cliente.nombre} ${JSON.cliente.apellido}`, 'success')
      },
      err => {
        this.errores = err.error.errors as string[];
        console.error('Código de error de la petición: ' + err.error.status);
        console.error(err.error.errors);
      }
    )
  }

}

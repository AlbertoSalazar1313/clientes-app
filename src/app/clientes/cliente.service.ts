import { Injectable } from '@angular/core';
//import { formatDate, DatePipe, registerLocaleData } from '@angular/common';
//import { DatePipe} from '@angular/common';
import { Cliente } from './cliente';
import { map,catchError,tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private urlEndPoint: string = 'http://localhost:8081/api/clientes';

  private httpHeaders = new HttpHeaders({'Content-Type':'application/json'});

  constructor(private http: HttpClient, private router: Router) { }

  getClientes(page: number):Observable<any>{
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      tap((response: any) =>{
          console.log("------------------------------------------------"+
          "\nFIRST TAP, BEFORE CHANGING THE NAME TO UPPERCASE AND FORMATING THE DATE"
          +"\n------------------------------------------------");
          (response.content as Cliente[]).forEach(cliente => {
            console.log("CLIENT ID: "+ cliente.id +"\nFULL NAME: " + cliente.nombre,cliente.apellido +"\nDATE: "+ cliente.createAt);
            })
        }),
      map((response:any) => {
      (response.content as Cliente[]).map(cliente => {
        cliente.nombre = cliente.nombre.toUpperCase();
        //cliente.apellido = cliente.apellido.toUpperCase();
        //cliente.email = cliente.email.toUpperCase();
        //let datePipe = new DatePipe('en');
        //cliente.createAt = datePipe.transform(cliente.createAt, 'EEEE MMMM dd, yyyy');
        //cliente.createAt = formatDate(cliente.createAt,'EEEE MMMM dd, yyyy','en-US');
        return cliente;
      });
      return response;
    }
  ),
  tap(response =>{
    console.log("------------------------------------------------"+
    "\nSECOND TAP, AFTER CHANGING THE NAME TO UPPERCASE AND FORMATING THE DATE"
    +"\n------------------------------------------------");
    (response.content as Cliente[]).forEach(cliente => {
      console.log("CLIENT ID: "+ cliente.id +"\nFULL NAME: " + cliente.nombre,cliente.apellido +"\nDATE: "+ cliente.createAt);
      })
    })
  );
  }
  create(cliente: Cliente): Observable<any>{
    return this.http.post<any>(this.urlEndPoint, cliente,{headers: this.httpHeaders}).pipe(
      catchError(e => {
        if (e.status==400){
            return throwError(e);
        }
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje,e.error.error,'error');
        return throwError(e);
      })
    );
  }
  getCliente(id: number): Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(catchError(e => {
      this.router.navigate(['/clientes']);
      console.error( e.error.mensaje);
      swal.fire(e.error.mensaje,e.error.error,'error');
      return throwError(e);
    }));
  }
  update(cliente: Cliente): Observable<any>{
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`,cliente,{headers: this.httpHeaders}).pipe(
      catchError(e => {
        if (e.status==400){
            return throwError(e);
        }
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje,e.error.error,'error');
        return throwError(e);
      })
    );
  }
  delete(id:number): Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`,{headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje,e.error.error,'error');
        return throwError(e);
      })
    );
  }

}

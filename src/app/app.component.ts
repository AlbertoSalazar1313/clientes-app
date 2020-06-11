import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Esto es Angular';
  curso : string = 'Angular 5 con Spring 7';
  alumno : string = 'Saludos, soy el arquero emisaro de los gorgonitas.';
}

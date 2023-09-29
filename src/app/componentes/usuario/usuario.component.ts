import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-info',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent {
  @Input() usuario: any; 
  mensajeError: string = '';

  constructor() { }
}

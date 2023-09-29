import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-postusuario',
  templateUrl: './postusuario.component.html',
  styleUrls: ['./postusuario.component.css']
})
export class PostusuarioComponent {
  @Input() publicacion: any; // Input property para recibir datos de la publicación

  constructor() { }

  countPublicaciones(): number {
    return this.publicacion ? this.publicacion.length : 0;
  }
}

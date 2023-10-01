import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-postusuario',
  templateUrl: './postusuario.component.html',
  styleUrls: ['./postusuario.component.css']
})
export class PostusuarioComponent {
  @Input() publicacion: any; // Input property para recibir datos de la publicación
  @Input() comentarios: any[] | undefined; // Input property para recibir datos de los comentarios


  constructor() { }

  countPublicaciones(): number {
    return this.publicacion ? this.publicacion.length : 0;
  }

  countComentarios(): number {
    console.log("comentarios")
    return this.comentarios ? this.comentarios.length : 0;
  }
}
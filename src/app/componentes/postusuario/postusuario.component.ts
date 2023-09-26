import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-postusuario',
  templateUrl: './postusuario.component.html',
  styleUrls: ['./postusuario.component.css']
})
export class PostusuarioComponent {
  @Input() publicacion: any; 
  @Input() comentarios: any[] | undefined; 


  constructor() { }

  countPublicaciones(): number {
    return this.publicacion ? this.publicacion.length : 0;
  }

  countComentariosPorPublicacion(index: number): number {
    if (this.comentarios && this.comentarios[index]) {
      return this.comentarios[index].length;
    }
    return 0; 
  }
  
  
}
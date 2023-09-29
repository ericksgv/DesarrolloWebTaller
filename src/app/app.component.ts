import { Component } from '@angular/core';
import { User } from './models/User';
import { Post } from './models/Post';
import { HttpClient } from '@angular/common/http';
import { Observable, mergeMap, of } from 'rxjs';
import { forkJoin } from 'rxjs';

import { Comment } from './models/Comment';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent {
  /*Esta es la URL base a la que nos vamos a conectar */
  ROOT_URL = 'https://dummyjson.com';
  title = 'rxjs-example';

  //Nuestro modelo es el usuario
  //Este puede ser nulo, mientras el usuario lo busca
  usuario: User | null = null;

  comentarios: Comment[] | null = [];


  //Tambien vamos a tener un mensaje de error y un post del usuario
  mensajeError: string = '';
  publicacion: Post | null = null;

  //campo de formulario para buscar al usuario
  txtUser: string = '';

  //los constructores los usamos para inyectar dependencias
  constructor(private http: HttpClient) { }

  user$: Observable<any> = new Observable();

  //Esta funcion se llama cuando se presiona el boton "buscar usuario"
  searchUser() {
    if(this.getUserAndPost() == null){
      this.mensajeError = "No se encontró al usuario"
      this.usuario = null
      this.publicacion = null
      this.comentarios = null

    }
  }

  //Crearemos esta segunda funcion que obtiene el post del usuario a partir de su id
  getPost(id: Number) {
    this.http
      .get(this.ROOT_URL + '/posts?userId=' + id)
      .subscribe((postInfo: any) => (this.publicacion = postInfo[0]));
  }

  //Finalmente creamos una funcion que trae al usuario y POSTERIORMENTE sus post

  getUserAndPost() {
    // Hacemos primero la petición para buscar el usuario
    this.http
      .get<User>(this.ROOT_URL + '/users/filter?key=username&value=' + this.txtUser)
      .pipe(
        mergeMap((userInfo: any) => {
          if (!userInfo || userInfo.length === 0) {
            this.mensajeError = 'Usuario no encontrado';
            this.usuario = null;
            return of(null);
          } else {
            const firstUser = userInfo.users[0];
            const user: User = {
              id: firstUser.id,
              name: firstUser.firstName + ' ' + firstUser.lastName,
              username: firstUser.username,
              image: firstUser.image,
              email: firstUser.email,
              website: firstUser.domain,
            };
            this.usuario = user;
            this.mensajeError = '';
            return forkJoin({
              posts: this.http.get<Post[]>(this.ROOT_URL + '/posts/user/' + this.usuario.id),
              comments: this.http.get<Comment[]>(this.ROOT_URL + '/comments/post/' + this.usuario.id),
            });
          }
        })
      )
      .subscribe((result: any) => {
        this.publicacion = result.posts.posts
        this.comentarios = result.comments.comments;
        console.log('Result:', result);
      });
  }
  countComentarios(): number {
    return this.comentarios ? this.comentarios.length : 0;
  }
}

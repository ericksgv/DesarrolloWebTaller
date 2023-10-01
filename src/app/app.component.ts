import { Component } from '@angular/core';
import { User } from './models/User';
import { Post } from './models/Post';
import { HttpClient } from '@angular/common/http';
import { Observable, concatMap, mergeMap, of } from 'rxjs';
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

  comentarios: Comment[] = [];


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
      this.mensajeError = "User not found"
      this.usuario = null
      this.publicacion = null

    }
  }


  //Finalmente creamos una funcion que trae al usuario y POSTERIORMENTE sus post

  getUserAndPost() {
    // Realizamos una solicitud HTTP para buscar el usuario
    this.http
      .get<User>(this.ROOT_URL + '/users/filter?key=username&value=' + this.txtUser)
      .pipe(
        mergeMap((userInfo: any) => {
          if (!userInfo || userInfo.length === 0) {
            this.mensajeError = 'User not found';
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
            // Realizamos otra solicitud para obtener las publicaciones del usuario
            return this.http.get<Post>(this.ROOT_URL + '/posts/user/' + userInfo.users[0].id);
          }
        }),
        concatMap((postInfo: any) => {
          if (!postInfo || postInfo.length === 0) {
            this.mensajeError = 'Comments not found';
            return of(null);
          } else {
            //console.log(postInfo.posts)
            this.publicacion = postInfo.posts;
            this.mensajeError = '';
            const commentRequests = postInfo.posts.map((post: any) => {
              return this.http.get<Comment[]>(this.ROOT_URL + '/comments/post/' + post.id);
            });
            //console.log(commentRequests)
            return forkJoin (commentRequests);
          }
        })
        
      )
      .subscribe(
        (info: any) => {
          const allComments = info[0].comments;
          console.log(allComments)
          this.comentarios = allComments;
          
        },
        error => {
          console.error('Error al obtener datos:', error);
        }
      );
      
  }

  

}
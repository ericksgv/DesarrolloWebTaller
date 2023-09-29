import { Component } from '@angular/core';
import { User } from './models/User';
import { Post } from './models/Post';
import { HttpClient } from '@angular/common/http';
import { Observable, mergeMap, of } from 'rxjs';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

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

  processedComments: any[] = [];


  //Tambien vamos a tener un mensaje de error y un post del usuario
  mensajeError: string = '';
  publicacion: Post | null = null;

  //campo de formulario para buscar al usuario
  txtUser: string = '';

  //los constructores los usamos para inyectar dependencias
  constructor(private http: HttpClient) {}

  user$: Observable<any> = new Observable();

  //Esta funcion se llama cuando se presiona el boton "buscar usuario"
  searchUser() {
    //Primero creamos una funcion que busque siempre el usuario 1
    //Usamos una variable observador
    /*
    this.user$ = this.http.get(this.ROOT_URL + '/users/1');
    this.user$.subscribe(userInfo => {
      this.usuario = userInfo;
    })*/

    //En esta segunda version no usamos una variable auxiliar
    //la funcion get retorna un observable
    /*
    this.http.get(this.ROOT_URL + '/users/1').subscribe((userInfo:any) => {
      this.usuario = userInfo;
    })*/

    //Esta tercera funcion ya hace la busqueda de un usuario en especifico.
    //decalramos de manera explicita el metodo next para que el codigo se lea mejor
    /*this.http.get(this.ROOT_URL + '/users?username=' + this.txtUser).subscribe({
      //Es importante definir la informacion que llega como tipo any
      next: (userInfo: any) => {
        if (userInfo.length === 0) {
          this.mensajeError = 'Usuario no encontrado';
          this.usuario = null;
        } else {
          this.usuario = userInfo[0];
          this.mensajeError = '';
        }
      },
    });*/
    this.getUserAndPost();
  }

  //Si queremos realizar ciertas peticiones desde que se carga la pagina podemos usar nginit
  ngOnInit(): void {
    this.http.get(this.ROOT_URL + '/users/1').subscribe((userInfo: any) => {
      this.usuario = userInfo;
    });

    //Si tratamos de llamar la funcion desde el aca no funciona
    //Esto ocurre a que el id sigue siendo nulo cuando esta funcion se llama
    //this.getPost(this.usuario!.id);
  }

  //Crearemos esta segunda funcion que obtiene el post del usuario a partir de su id
  getPost(id: Number) {
    this.http
      .get(this.ROOT_URL + '/posts?userId=' + id)
      .subscribe((postInfo: any) => (this.publicacion = postInfo[0]));
  }

  //Finalmente creamos una funcion que trae al usuario y POSTERIORMENTE sus post

  getUserAndPost() {
    //Hacemos primero la peticion para buscar el usuario
    console.log(this.ROOT_URL + '/users/filter?key=username&value=' + this.txtUser)
    this.http
      .get<User>(this.ROOT_URL + '/users/filter?key=username&value=' + this.txtUser)
      .pipe(
        mergeMap((userInfo: any) => {
          if (!userInfo || userInfo.length === 0) {
            this.mensajeError = 'Usuario no encontrado';
            this.usuario = null;
            return of(null);
          } else {
            console.log(userInfo.users[0])
            const firstUser = userInfo.users[0]; // Obtener el primer usuario del array
            const user: User = {
              id: firstUser.id,
              name: firstUser.firstName + ' ' + firstUser.lastName,
              username: firstUser.username,
              email: firstUser.email,
              website: firstUser.domain
              
            };
            this.usuario = user;
            this.mensajeError = '';
            console.log(this.ROOT_URL + '/posts/user/' + this.usuario.id);
            return this.http.get<Post>(
              this.ROOT_URL + '/posts/user/' + this.usuario.id
            );
          }
        })
      )
      
      .subscribe((postInfo: any) => {
          this.publicacion = postInfo.posts[0]
      });
  }

  getComments(postId: number) {
    this.http.get<any[]>(this.ROOT_URL + `/comments/post/${postId}`).subscribe((comments: any[]) => {
      // Aquí tienes los comentarios. Ahora debes buscar el nombre del autor.
      this.processComments(comments);
    });
  }
  
  processComments(comments: any[]) {
    const observables = comments.map((comment) =>
      this.getUser(comment.userId).pipe(
        map((user: any) => ({
          ...comment,
          authorName: user.name,
        }))
      )
    );
  
    forkJoin(observables).subscribe((processedComments) => {
      this.processedComments = processedComments;
    });
  }
  
  getUser(userId: number): Observable<any> {
    return this.http.get<any>(`${this.ROOT_URL}/users/filter?key=id&value=${userId}`);
  }
  
    
}

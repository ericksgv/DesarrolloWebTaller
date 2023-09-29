import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { UsuarioComponent } from './componentes/usuario/usuario.component';
import { PostusuarioComponent } from './componentes/postusuario/postusuario.component';


@NgModule({
  declarations: [
    AppComponent,
    UsuarioComponent,
    PostusuarioComponent
  ],
  imports: [
    //Es importante importar ambos modulos
    //Modulo para formularios
    FormsModule,
    BrowserModule,
    //modula para peticiones http
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

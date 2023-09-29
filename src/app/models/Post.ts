//creamos interfaces que representan las entidades
//Las creamos a partir de los atributos que se van a transmitir 
//https://jsonplaceholder.typicode.com/posts
export interface Post{
    length: number;
    userId:number,
    id:number,
    title:string,
    body:string,
    reactions: number
}
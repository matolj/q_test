import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { environment } from '@environments/environment';


@Injectable({ providedIn: 'root' })
export class AuthorService {
    constructor(private http: HttpClient) { }
    private books = []
    private myBooks = []
    private booksUpdated = new Subject<{books: any, booksCount:number}>();
    private myBooksUpdated = new Subject<{books: any, booksCount:number}>();


    getAll(booksPerPage: number, currentPage: number){
      const queryParams = `?pagesize=${booksPerPage}&page=${currentPage}`;
      this.http.get<{message: string, books: any, maxBooks:number}>(`${environment.backendApiUrl}/authors` + queryParams)
      .pipe(map((bookData) =>{
        return {books: bookData.books.map(book =>{
            return {
              name: book.name,
              content: book.content,
              id: book._id,
              author: book.author
            }
        }), maxBooks: bookData.maxBooks}
      }))
      .subscribe((transformedBookData) => {
          this.books = transformedBookData.books;
          this.booksUpdated.next({books:[...this.books], booksCount:transformedBookData.maxBooks});
      });
  }

    getBookUpdateListener(){
        return this.booksUpdated.asObservable();
    }

    getMyBookUpdateListener(){
      return this.myBooksUpdated.asObservable();
    }

    writeBook(name: string, content: string){
      return this.http.post<any>(`${environment.backendApiUrl}/authors/write-book`, { name, content })
          .pipe(map(book => {
              return book;
          }));
    }

    getMyBooks(booksPerPage: number, currentPage: number) {

      const queryParams = `?pagesize=${booksPerPage}&page=${currentPage}`;
      this.http.get<{message: string, books: any, maxBooks:number}>(`${environment.backendApiUrl}/authors/my-books` + queryParams)
      .pipe(map((bookData) =>{
        return {books: bookData.books.map(book =>{
            return {
              name: book.name,
              content: book.content,
              id: book._id,
              author: book.author
            }
        }), maxBooks: bookData.maxBooks}
      }))
      .subscribe((transformedBookData) => {
          this.myBooks = transformedBookData.books;
          this.myBooksUpdated.next({books:[...this.myBooks], booksCount:transformedBookData.maxBooks});
      });

    }

    editBook(id:any, name: string, content: string){
      return this.http.post<any>(`${environment.backendApiUrl}/authors/edit-book/${id}`, { name, content })
            .pipe(map(book => {
                return book;
            }));
    }

    deleteBook(id: any){
      return this.http.delete<any>(`${environment.backendApiUrl}/authors/delete-book/${id}`)
    }

}

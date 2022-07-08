import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';


@Injectable({ providedIn: 'root' })
export class AuthorService {
    constructor(private http: HttpClient) { }

    getAll(booksPerPage: number, currentPage: number) {
      const queryParams = `?pagesize=${booksPerPage}&page=${currentPage}`;
      return this.http.get<any>(`${environment.backendApiUrl}/authors` + queryParams)
    }

    writeBook(name: string, content: string){
      return this.http.post<any>(`${environment.backendApiUrl}/authors/write-book`, { name, content })
          .pipe(map(book => {
              return book;
          }));
    }

    getMyBooks(booksPerPage: number, currentPage: number) {
      const queryParams = `?pagesize=${booksPerPage}&page=${currentPage}`;
      return this.http.get<any>(`${environment.backendApiUrl}/authors/my-books` + queryParams)
    }

    editBook(id:any, name: string, content: string){
      return this.http.post<any>(`${environment.backendApiUrl}/authors/edit-book/${id}`, { name, content })
            .pipe(map(book => {
                return book;
            }));
    }

    deleteBook(id: any){
      return this.http.delete<any>(`${environment.backendApiUrl}/authors/delete-book/${id}`)
      .pipe(map((res:any)=>{
        return res
      }));
    }

}

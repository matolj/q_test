import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { User } from '@app/_models';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getAll(usersPerPage: number, currentPage: number) {
      const queryParams = `?pagesize=${usersPerPage}&page=${currentPage}`;
      return this.http.get<any>(`${environment.backendApiUrl}/users` + queryParams)
    }

    getById(id: any) {
        return this.http.get<User>(`${environment.backendApiUrl}/users/${id}`);
    }

    createAuthor(firstName: string, lastName: string, email: string, password: string){
      return this.http.post<any>(`${environment.backendApiUrl}/users/create-author`, { firstName, lastName, email, password })
            .pipe(map(user => {
                return user;
            }));
    }

    deleteAuthor(id: any){
      return this.http.delete<User>(`${environment.backendApiUrl}/users/${id}`)
      .pipe(map((res:any)=>{
        return res
      }));
    }

    editAuthor(id:any, firstName: string, lastName: string, email: string, password: string){
      return this.http.post<any>(`${environment.backendApiUrl}/users/edit-author/${id}`, { firstName, lastName, email, password })
            .pipe(map(user => {
                return user;
            }));
    }
}

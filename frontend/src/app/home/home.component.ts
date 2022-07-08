import { Component } from '@angular/core';
import { first } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';

import { User } from '@app/_models';
import { UserService, AuthenticationService, AuthorService } from '@app/_services';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
    loading = false;
    user: User;
    userFromApi: User;
    books = [];
    loadingBooks = false;

    totalBooks = 0;
    booksPerPage = 5;
    currentPage = 1;
    pageSizeOptions = [1,2,5,10];
    displayedColumns: string[] = ['name', 'content', 'author'];


    constructor(
        private userService: UserService,
        private authenticationService: AuthenticationService,
        private authorService: AuthorService,
    ) {
        this.user = this.authenticationService.userValue;
    }

    ngOnInit() {
        this.loading = true;
        this.userService.getById(this.user.id).pipe(first()).subscribe(user => {
            this.loading = false;
            this.userFromApi = user;
        });

        this.loadingBooks = true;
        this.authorService.getAll(this.booksPerPage, this.currentPage).pipe(first()).subscribe(data => {
            this.loadingBooks = false;
            this.books = data.books;
            this.totalBooks= data.maxBooks;
        });
    }

    onChangedPage(pageData: PageEvent){
      this.currentPage = pageData.pageIndex + 1;
      this.booksPerPage = pageData.pageSize;
      this.authorService.getAll(this.booksPerPage, this.currentPage).pipe(first()).subscribe(data => {
          this.books = data.books;
          this.totalBooks =  data.maxBooks;
      });
    }
}

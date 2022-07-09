import { Component, OnDestroy, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';

import { User } from '@app/_models';
import { UserService, AuthenticationService, AuthorService } from '@app/_services';
import { Subscription } from 'rxjs';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit, OnDestroy {
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
    private booksSub: Subscription;


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

        this.authorService.getAll(this.booksPerPage, this.currentPage);

        this.booksSub = this.authorService.getBookUpdateListener()
        .subscribe((bookData: { books: any, booksCount:number })=>{
          this.loadingBooks = false;
          this.books = bookData.books;
          this.totalBooks = bookData.booksCount;
        });
    }

    onChangedPage(pageData: PageEvent){
      this.loadingBooks = true;
      this.currentPage = pageData.pageIndex + 1;
      this.booksPerPage = pageData.pageSize;
      this.authorService.getAll(this.booksPerPage, this.currentPage);
    }

    ngOnDestroy(){
      this.booksSub.unsubscribe();
    }
}

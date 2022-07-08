import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';

import { AuthorService } from '@app/_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({ templateUrl: 'author.component.html' })
export class AuthorComponent implements OnInit {
    loading = false;
    writeBookForm: FormGroup;
    isCollapsed = false;
    submitted = false;
    editForm = false;
    error = '';
    bookId = '';

    books = [];
    loadingBooks = false;

    totalBooks = 0;
    booksPerPage = 5;
    currentPage = 1;
    pageSizeOptions = [1,2,5,10];

    constructor(
      private authorService: AuthorService,
      private formBuilder: FormBuilder
      ) { }

    ngOnInit() {
      this.writeBookForm = this.formBuilder.group({
        name: ['', Validators.required],
        content: ['', Validators.required]
      });

      this.loadingBooks = true;
        this.authorService.getMyBooks(this.booksPerPage, this.currentPage).pipe(first()).subscribe(data => {
            this.loadingBooks = false;
            this.books = data.books;
            this.totalBooks= data.maxBooks;
        });
    }

    onSubmit() {
      this.submitted = true;

      if (this.writeBookForm.invalid) {
          return;
      }

      this.loading = true;

      if(this.bookId != '' && this.editForm){
        this.authorService.editBook(this.bookId, this.f.name.value, this.f.content.value)
        .pipe(first())
        .subscribe({
            next: () => {
              this.loading = false;
              this.authorService.getMyBooks(this.booksPerPage, this.currentPage).pipe(first()).subscribe(data => {
                this.loadingBooks = false;
                this.books = data.books;
                this.totalBooks =  data.maxBooks;
                this.isCollapsed = !this.isCollapsed;
              });
            },
            error: error => {
                this.error = error;
                this.loading = false;
            }
        });
      }else{
          this.authorService.writeBook(this.f.name.value, this.f.content.value)
          .pipe(first())
          .subscribe({
              next: () => {
                this.loading = false;
                this.authorService.getMyBooks(this.booksPerPage, this.currentPage).pipe(first()).subscribe(data => {
                  this.loadingBooks = false;
                  this.books = data.books;
                  this.totalBooks =  data.maxBooks;
                  this.isCollapsed = !this.isCollapsed;
                });
              },
              error: error => {
                  this.error = error;
                  this.loading = false;
              }
          });
      }
    }

    toggleCollapse(): void {
      this.isCollapsed = !this.isCollapsed;
    }

    onChangedPage(pageData: PageEvent){
      this.currentPage = pageData.pageIndex + 1;
      this.booksPerPage = pageData.pageSize;
      this.authorService.getMyBooks(this.booksPerPage, this.currentPage).pipe(first()).subscribe(data => {
          this.books = data.books;
          this.totalBooks =  data.maxBooks;
      });
    }

    get f() { return this.writeBookForm.controls; }

    editBook(book): void {
      this.isCollapsed = !this.isCollapsed;
      this.editForm = true;

      this.writeBookForm.patchValue({
        name: book.name,
        content: book.content,

      });

      this.bookId = book._id;

    }

    deleteBook(id): void {
      this.authorService.deleteBook(id).pipe(first()).subscribe({
        next: () => {
            this.authorService.getMyBooks(this.booksPerPage, this.currentPage).pipe(first()).subscribe(data => {
              this.books = data.books;
              this.totalBooks =  data.maxBooks;
            });
        },
        error: error => {
                  this.error = error;
              }
   });

    }

}

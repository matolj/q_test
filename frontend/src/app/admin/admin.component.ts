import { AfterViewInit, Component, OnInit, ViewChildren } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { first } from 'rxjs/operators';

import { User } from '@app/_models';
import { UserService } from '@app/_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({ templateUrl: 'admin.component.html' })
export class AdminComponent implements OnInit {

    createAuthorForm: FormGroup;
    loading = false;
    users: User[] = [];
    submitted = false;
    error = '';
    loadingAuthors = false;
    isCollapsed = false;
    editForm = false;
    userId = '';

    totalAuthors = 0;
    authorsPerPage = 5;
    currentPage = 1;
    pageSizeOptions = [1,2,5,10];

    constructor(
      private formBuilder: FormBuilder,
      private userService: UserService
    ) { }

    ngOnInit() {

        this.createAuthorForm = this.formBuilder.group({
          email: ['', Validators.required],
          password: ['', Validators.required],
          firstName: ['', Validators.required],
          lastName: ['', Validators.required]
        });

        this.loadingAuthors = true;
        this.userService.getAll(this.authorsPerPage, this.currentPage).pipe(first()).subscribe(data => {
            this.loadingAuthors = false;
            this.users = data.authors;
            this.totalAuthors = data.maxAuthors;
        });
    }

    onSubmit() {
      this.submitted = true;
      // stop here if form is invalid
      if (this.createAuthorForm.invalid) {
          return;
      }

      this.loading = true;

      if(this.userId != '' && this.editForm){
        this.userService.editAuthor(this.userId, this.f.firstName.value, this.f.lastName.value, this.f.email.value, this.f.password.value)
          .pipe(first())
          .subscribe({
              next: () => {
                this.loading = false;
                this.userService.getAll(this.authorsPerPage, this.currentPage).pipe(first()).subscribe(data => {
                  this.loadingAuthors = false;
                  this.users = data.authors;
                  this.totalAuthors =  data.maxAuthors;
                  this.isCollapsed = !this.isCollapsed;
                });
              },
              error: error => {
                  this.error = error;
                  this.loading = false;
              }
          });
      }else{
          this.userService.createAuthor(this.f.firstName.value, this.f.lastName.value, this.f.email.value, this.f.password.value)
          .pipe(first())
          .subscribe({
              next: () => {
                this.loading = false;
                this.userService.getAll(this.authorsPerPage, this.currentPage).pipe(first()).subscribe(data => {
                  this.loadingAuthors = false;
                  this.users = data.authors;
                  this.totalAuthors =  data.maxAuthors;
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

    onChangedPage(pageData: PageEvent){
      this.currentPage = pageData.pageIndex + 1;
      this.authorsPerPage = pageData.pageSize;
      this.userService.getAll(this.authorsPerPage, this.currentPage).pipe(first()).subscribe(data => {
          this.users = data.authors;
          this.totalAuthors =  data.maxAuthors;
      });
    }

  toggleCollapse(): void {
      this.isCollapsed = !this.isCollapsed;
  }

  get f() { return this.createAuthorForm.controls; }

  deleteAuthor(id): void {

      this.userService.deleteAuthor(id).pipe(first()).subscribe({
          next: (result) => {
              this.userService.getAll(this.authorsPerPage, this.currentPage).pipe(first()).subscribe(data => {
                this.users = data.authors;
                this.totalAuthors =  data.maxAuthors;
              });
          },
          error: error => {
                    this.error = error;
                }
     });
  }

  editAuthor(user): void {
    this.isCollapsed = !this.isCollapsed;
    this.editForm = true;

    this.createAuthorForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: ""
    });

    this.userId = user._id;

  }

}
function CollapseComponent(CollapseComponent: any) {
  throw new Error('Function not implemented.');
}


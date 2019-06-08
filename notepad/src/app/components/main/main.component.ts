import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";

const apiAdress = 'http://localhost:4000/';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

const api = {
  login: 'login',
  logout: 'logout',
  init: 'init',
  note: 'note',
  newCat: 'newCat',
  editCat: 'editCat',
  deleteCat: 'deleteCat'
};

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  isLoggedIn = false;
  notes: any[] = [];
  categories: any[] = [];
  userName: String = '';
  data: any;

  noteTitle: String = '';
  noteContent: String = '';
  noteDate: Date = new Date();
  noteCategory: String = '';

  categoryName: String = '';
  editingCategoryId = -1;
  newCategoryName: String = '';

  constructor(private http: HttpClient) {
  }

  saveData() {
    if (this.data.hasOwnProperty('notes') && this.data.hasOwnProperty('categories')) {
      this.notes = this.data.notes;
      this.categories = this.data.categories;
    }
  }

  login() {
    this.http.post(apiAdress + api.login, JSON.stringify({ user: this.userName }), httpOptions).subscribe(data => {
      this.data = data;
      this.saveData();

      if (this.data.hasOwnProperty('success')) {
        this.isLoggedIn = this.data.success;
      }
    });
  }

  logout() {
    this.http.post(apiAdress + api.logout, JSON.stringify({}), httpOptions).subscribe(() => {
      this.isLoggedIn = false;
      this.userName = '';
    });
  }

  saveNote() {
    const note = JSON.stringify({
      title: this.noteTitle,
      content: this.noteContent,
      category: this.noteCategory,
      date: this.noteDate.toJSON().slice(0, 10)
    });
    this.noteTitle = '';
    this.noteContent = '';
    this.noteDate = new Date();
    this.noteCategory = '';
    console.log('Sending new note: ', JSON.parse(note));
    this.http.post(apiAdress + api.note, note, httpOptions).subscribe(data => {
      this.data = data;
      this.saveData();
    });
  }

  saveCategory() {
    console.log('Saving category: ', this.categoryName);
    this.http.post(apiAdress + api.newCat, JSON.stringify({ name: this.categoryName }), httpOptions).subscribe(data => {
      this.data = data;
      this.saveData();
    });
    this.categoryName = '';
  }

  editCategory(category) {
    if (this.editingCategoryId !== category.id) {
      this.editingCategoryId = category.id;
      this.newCategoryName = category.name;
    } else {
      console.log('Editing category:', category.name, ' (id = ', category.id, ') changed to ', this.newCategoryName);
      this.http.post(apiAdress + api.editCat, JSON.stringify({ name: this.newCategoryName, id: category.id }), httpOptions)
        .subscribe(data => {
          console.log('got data from server:');
          console.log(data);
          this.data = data;
          this.saveData();
        });
      this.editingCategoryId = -1;
      this.newCategoryName = '';
    }
  }

  deleteCategory(name: String) {
    console.log('Deleting category: ', name);
    this.http.post(apiAdress + api.deleteCat, JSON.stringify({ name: name }), httpOptions).subscribe(data => {
      this.data = data;
      this.saveData();
    });
  }
}

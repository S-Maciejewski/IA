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
  init: 'init',
  note: 'note',
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
  password: String = '';
  data: any;
  
  noteTitle: String = '';
  noteContent: String = '';
  noteDate: Date = new Date();
  noteCategory: String = '';

  constructor(private http: HttpClient) {
    this.init();
  }

  saveData() {
    if (this.data.hasOwnProperty('notes') && this.data.hasOwnProperty('categories')) {
      this.notes = this.data.notes;
      this.categories = this.data.categories;
    }
  }

  login() {
    this.http.post(apiAdress + api.login, JSON.stringify({ passwd: this.password }), httpOptions).subscribe(data => {
      this.data = data;
      if (this.data.hasOwnProperty('success')) {
        this.isLoggedIn = this.data.success;
      }
    });
  }

  init() {
    this.http.get(apiAdress + api.init, httpOptions).subscribe(data => {
      this.data = data;
      this.saveData();
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

}

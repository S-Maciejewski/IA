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

};

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  isLoggedIn = false;
  notes: any[] = [];
  categories: any[] = [];
  password: String = '';
  data: any;

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

}

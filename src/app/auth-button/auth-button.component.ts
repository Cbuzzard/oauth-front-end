import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-auth-button',
  templateUrl: './auth-button.component.html',
  styleUrls: ['./auth-button.component.css']
})
export class AuthButtonComponent implements OnInit {

  public gapiSetup: boolean = false; // marks if the gapi library has been loaded
  public authInstance: gapi.auth2.GoogleAuth;
  public error: string;
  public user: gapi.auth2.GoogleUser;
  public status: any = "none";

  constructor(private http:HttpClient) { }

  async ngOnInit() {
    if (await this.checkIfUserAuthenticated()) {
      this.user = this.authInstance.currentUser.get();
    }
  }

  getKims() {
    this.http.get("http://localhost:8080/rest/kim").subscribe(result => this.status = JSON.stringify(result))
    // var xmlHttp = new XMLHttpRequest();
    // xmlHttp.open( "GET", 'http://localhost:8080/rest/kim'); // false for synchronous request
    // xmlHttp.onload = () => {status = JSON.parse(xmlHttp.responseText);}
    // xmlHttp.send();
  }

  signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      sessionStorage.clear();
      console.log('User signed out.');
    });
  }


  async initGoogleAuth(): Promise<void> {
    const pload = new Promise((resolve) => {
      gapi.load('auth2', resolve);
      gapi.signin2.render("testid", {})
    });

    return pload.then(async () => {
      await gapi.auth2
        .init({ client_id: '428759163089-0un7vcmrckisnvpt06hqr6v1orbmmap0.apps.googleusercontent.com' })
        .then(auth => {
          this.gapiSetup = true;
          this.authInstance = auth;
          console.log(auth.currentUser.get().getAuthResponse().id_token);
        });
    });
  }

  sendRequest() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:8080/login');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('X-ID-TOKEN', this.user.getAuthResponse().id_token);
    xhr.onload = function() {
      sessionStorage.setItem('token', xhr.getResponseHeader('Authorization'))
      console.log('Signed in as: ' + xhr.getResponseHeader('Authorization'));
    };
    xhr.send();
  }

  async authenticate(): Promise<gapi.auth2.GoogleUser> {
    if (!this.gapiSetup) {
      await this.initGoogleAuth();
    }

    return new Promise(async () => {
      await this.authInstance.signIn().then(
        user => this.user = user,
        error => this.error = error);
    });
  }

  async checkIfUserAuthenticated(): Promise<boolean> {
    if (!this.gapiSetup) {
      await this.initGoogleAuth();
    }

    return this.authInstance.isSignedIn.get();
  }

}

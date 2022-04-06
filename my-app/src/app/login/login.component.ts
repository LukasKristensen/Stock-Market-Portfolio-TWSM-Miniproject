import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, CanActivate } from '@angular/router';

// To-do: Pass data back to main display component
export class userData {
  constructor(
    public userName: string,
    public Portfolio: string[],
  ){}
}


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent{
  title = 'my-app';

  uData = [{userName: "", Portfolio: ""}];

  constructor(
    private serverConnection: HttpClient,
    private router: Router
  ){}


  signUp(){
    var emailGet = (<HTMLInputElement>document.getElementById("emailInput")).value;
    var passwordGet = (<HTMLInputElement>document.getElementById("passwordInput")).value;

    // ENCRYPT DATA
    const headers = {'content-type': 'application/json'}
    const bodyPost = {userEmail: emailGet, userPassword: passwordGet};

    const req = this.serverConnection.post('http://localhost:6060/signUp', bodyPost, {'headers':headers});
    req.subscribe(data => {});
  }

  login(){
    var emailGet = (<HTMLInputElement>document.getElementById("emailInput")).value;
    var passwordGet = (<HTMLInputElement>document.getElementById("passwordInput")).value;

    // ENCRYPT DATA
    const headers = {'content-type': 'application/json'}
    const bodyPost = {userEmail: emailGet, userPassword: passwordGet};

    const req = this.serverConnection.post<any>('http://localhost:6060/login', bodyPost, {'headers':headers});
    req.subscribe(response => {
      if (response.status == "User found"){
        this.router.navigate(['main-component'])
      }
    });
  }


  loadServerData(){
    var signUpBtn = document.querySelector("#margineSignup");
    signUpBtn!.innerHTML = "Server request";
    this.serverConnection.get<any>("http://localhost:6060/requestData?test").subscribe(
      response => {
        console.log("Data:",response);
        this.uData = response;
      }
    )}

}

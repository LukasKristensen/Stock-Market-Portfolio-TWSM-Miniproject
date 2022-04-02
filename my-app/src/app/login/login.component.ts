import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  response: any;

  uData = [{userName: "", Portfolio: ""}];

  constructor(
    private serverConnection: HttpClient
  ){}



  signUp(){
    this.serverConnection.get('http://localhost:6060/signUp?test');
  }

  login(){
    this.serverConnection.get('http://localhost:6060/login?test')
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

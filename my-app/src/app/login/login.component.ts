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
    const headers = {'content-type': 'application/json'}
    const body = JSON.stringify({"person":1,"test":2});

    const req = this.serverConnection.post('http://localhost:6060/signUp', body, {'headers':headers});
    req.subscribe(data => {
      var signUpBtn = document.querySelector("#margineSignup");
      signUpBtn!.innerHTML = JSON.stringify(data);
    });
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

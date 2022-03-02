import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export class userData {
  constructor(
    public userName: string,
    public portfolio: string
  ){}
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'my-app';

  uData: userData[] = [];

  constructor(
      private serverConnection: HttpClient
    ) {}

  ngOnInit(): void {
    this.loadServerData();
  }

  loadServerData(){
    this.serverConnection.get<any>("http://localhost:6060").subscribe(
      response => {
        console.log("Data:",response);
        this.uData = response;
      }
    )
  }

}

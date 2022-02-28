import { Component } from '@angular/core';
import { IpcRenderer } from 'electron';
import { merge, Observer } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
import { map } from 'rxjs/internal/operators/map';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'electron-angular-demo';
  private ipc: IpcRenderer
  isInternetReachable: any;

  constructor(){

    this.isInternetReachable = merge<any>(
      fromEvent(window, 'offline').pipe(map(() => false)),
      fromEvent(window, 'online').pipe(map(() => true)),
      new Observable((sub: Observer<boolean>) => {
        sub.next(navigator.onLine);
        sub.complete();
      }));


    
    if ((<any>window).require) {
      try {
        this.ipc = (<any>window).require('electron').ipcRenderer;
      } catch (e) {
        throw e;
      }

    } else {
      console.warn('App not running inside Electron!');
    }
  }

  ngOnInit(){
    this.isInternetReachable.subscribe(responseData => {
      if (responseData) {
        this.ipc.send('internet-connection');
      }
    })
  }
  
  openModal(){
    console.log("Open a modal");
    this.ipc.send("openModal");
  }
}

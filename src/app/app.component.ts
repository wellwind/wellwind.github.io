import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { startWith } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'blog';
  // todos$ = this.httpClient.get<any[]>('https://jsonplaceholder.typicode.com/todos/').pipe(startWith([]));

  constructor(private httpClient: HttpClient) {
  }

}

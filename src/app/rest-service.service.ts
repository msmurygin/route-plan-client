import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators'

@Injectable()
export class RestService {
    
    httpOptions = {
        headers: new HttpHeaders({
        'Content-Type':  'application/json'
        })
    };

    constructor(private http: HttpClient){}

    get<T>(_url : any): Observable<T> {
        return this.http.get<T>(_url, this.httpOptions)
        .pipe(
            catchError(this.handleError<T>('getDestination'))
        )
    }

   

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
      
          // TODO: send the error to remote logging infrastructure
          console.error(error); // log to console instead
      
          // Let the app keep running by returning an empty result.
          return of(result as T);
        };
    }
}
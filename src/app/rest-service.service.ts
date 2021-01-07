import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators'
import { RequestBody } from './dto/plan-route-request-body';


@Injectable()
export class RestService {
    
    httpOptions = {
        headers: new HttpHeaders({
        'Content-Type':  'application/json'
        })
    };

    constructor(private http: HttpClient){}

    postTableData<T>(_url: any, body: any) : Observable<T> {
        console.log("calling: "+ _url)
        return this.http.post<T>(_url, body, this.httpOptions)
        .pipe(
            catchError(this.handleError<T>('getRequest:: '+ _url))
        )
    }

    get<T>(_url : any): Observable<T> {
        return this.http.get<T>(_url, this.httpOptions)
        .pipe(
            catchError(this.handleError<T>('getRequest:: '+ _url))
        )
    }

   

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
      
          // TODO: send the error to remote logging infrastructure
          //console.error(error); // log to console instead
      
          // Let the app keep running by returning an empty result.
          return of(result as T);
        };
    }
}
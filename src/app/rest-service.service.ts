import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators'
import { RequestBody } from './dto/plan-route-request-body';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class RestService {
    
    httpOptions = {};

    constructor(private http: HttpClient, private messageService : MessageService,private cookieService : CookieService){
       
    }


    post<T>(_url: any, body: any) : Observable<T> {
        return this.http.post<T>(_url, body).pipe(
            catchError(this.handleError<T>('postRequest:: '+ _url))
       )
    }


    put<T>(_url: any, body: any) : Observable<T> {
        return this.http.put<T>(_url, body).pipe(
            catchError(this.handleError<T>('putRequest:: '+ _url))
       )
    }


    getWithHeader<T>(_url : any, header: {}): Observable<T> {
        return this.http.get<T>(_url, header).pipe(
            catchError(this.handleError<T>('getRequest:: '+ _url))
        )
    }


    get<T>(_url : any): Observable<T> {
        return this.http.get<T>(_url).pipe(
            catchError(this.handleError<T>('getRequest:: '+ _url))
        )
    }


    getWithError<T>(_url : any): Observable<T> {
        let httpOptions = {headers: new HttpHeaders({'Content-Type':  'application/json'})};
        return this.http.get<T>(_url, httpOptions);
    }

    postWithError<T>(_url: any, body: any) : Observable<T> {
        
        this.httpOptions = {
            headers: new HttpHeaders({
            'Content-Type':  'application/json',
            //~'token' : this.cookieService.get("token"),
            //'username' : this.cookieService.get("username")
            })
        };
        return this.http.post<T>(_url, body)
    }
   

    private handleError<T>(operation = 'operation', result?: T) {
        return (httpErrorResponse: HttpErrorResponse): Observable<T> => {
          this.messageService.add({life: 10000, closable:true, severity: 'error', summary: 'Ошибка запроса данных', detail: httpErrorResponse.message });
          console.error(httpErrorResponse); // log to console instead
          return of(result as T);
        };
    }
}
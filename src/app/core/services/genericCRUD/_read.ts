import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { DataService } from './data.service';
import { handleHttpError } from './utilities';
import { JsonPipe } from '@angular/common';

@Injectable()
export class DataRead {
    private DS: DataService

    constructor(
        private http: HttpClient
    ) { }

    setDataService(ds: DataService) {
        this.DS = ds;
    }

    /**
     * Using a model interface's table definition, do a HTTP get
     * @param model The interface / class to construct the query against and build response objects from
     * @param query A limiting query to apply to the get. Expects an object of type URLSearchParams to append to the read, or a simple string
     */
    read<T>(model: T | any,type?: string | any, query?: HttpParams | string | any) {
        this.DS.loadingMap[model.tableName] = true;

       let url : any;
        const httpOpts = Object.assign({}, this.DS.httpOptions);

        if (type) {
            url = `${this.DS.endpoint}${model.tableName}/${type}`;
            if (query){
                httpOpts.params = this.createSearchParams(query);
                url = `${this.DS.endpoint}${model.tableName}/${type}/${httpOpts.params}`;
            }
        } else {
            url = `${this.DS.endpoint}${model.tableName}`;
        }

       
        this.http.get<any[]>(url)
            .subscribe(
                res => {
                    this.cacheAndNotifyRead(model, res);
                    this.DS.loadingMap[model.tableName] = false;
                },
                err => {
                    handleHttpError(err);
                    this.DS.loadingMap[model.tableName] = false;
                }
            );
    }

    readObs<T>(model: T | any,type?: string | any, query?: HttpParams | string | any): Observable<T[]> {
        this.DS.loadingMap[model.tableName] = true;

        const httpOpts = Object.assign({}, this.DS.httpOptions);
        let url;

        if (type) {
            url = `${this.DS.endpoint}${model.tableName}/${type}`;
            if (query){
                httpOpts.params = this.createSearchParams(query);
                url = `${this.DS.endpoint}${model.tableName}/${type}/${httpOpts.params}`;
            }
        } else {
            url = `${this.DS.endpoint}${model.tableName}`;
        }

        
        return this.http.get<T[]>(url)
            .pipe(
                catchError(handleHttpError),
                tap((res: T[]) => {
                    this.cacheAndNotifyRead(model, res);
                })
            );
    }

    async readPromise<T>(model: T | any,type?: string | any, query?: HttpParams | string | any): Promise<T | any> {
        this.DS.loadingMap[model.tableName] = true;

        const httpOpts = Object.assign({}, this.DS.httpOptions);
        let url : any ;

        if (type) {
            url = `${this.DS.endpoint}${model.tableName}/${type}`;
            if (query){
                httpOpts.params = this.createSearchParams(query);
                url = `${this.DS.endpoint}${model.tableName}/${type}/${httpOpts.params}`;
            }
        } else {
            url = `${this.DS.endpoint}${model.tableName}`;
        }
        
        try {
            const res = await fetch(url);
            const resJson = await res.json();
            if (Array.isArray(resJson)){
            this.cacheAndNotifyRead(model, resJson);
            return resJson;
            } else {
            return resJson;
            }
        }
        catch (err) {
            handleHttpError(err);
        }
    }

    async readLatestTransaction<T>(model: T | any, query?: HttpParams | string | any): Promise<T | any> {
        this.DS.loadingMap[model.tableName] = true;

        let url : any ;
        url = `${this.DS.endpoint}${model.tableName}/getLatest/${query}`;
       
        try {
            const res = await fetch(url);
            const resJson = await res.json();
            return resJson;   
        }
        catch (err) {
            handleHttpError(err);
        }
    }

    private createSearchParams(query: HttpParams | string | any): HttpParams {
        let newParams = new HttpParams;

        if (typeof query === 'string') {
            let searchParams = new HttpParams();
            const splitQuery = query.split('&');
            splitQuery.forEach(param => {
                const keyValPair = param.split('=');
                searchParams = searchParams.set(keyValPair[0], keyValPair[1]);
            });
            newParams = searchParams;
        } else if (query instanceof HttpParams) {
            newParams = query;
        } else { // Parse object into HttpParams
            Object.keys(query).forEach((key) => {
                newParams = newParams.set(key, query[key]);
            });
        }

        return newParams;
    }

    private cacheAndNotifyRead<T>(model: T | any, res: T[]) {
        
        this.DS.cache[model.tableName] = [];
        res.forEach((el: T) => {
            this.DS.cache[model.tableName].push(new model(el));
        });
        // Update Frontend
        this.DS.subjectMap[model.tableName].many.next(this.DS.cache[model.tableName]);
    }

}

import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { Block } from './models/block';
import { Transaction } from './models/transaction';
import 'rxjs/add/operator/map';

const API_PREFIX = 'http://localhost:3000/api/';

@Injectable()
export class BlockChainService {
    constructor(private http: Http) { }

    getBlock(height: number): Observable<Block> {
        return this.http.get(API_PREFIX + 'getBlock/' + height.toString()).map(res => res.json());
    }

    getLatestHash(): Observable<string> {
        return this.http.get(API_PREFIX + 'getLatestHash').map(res => res.json());
    }

    getUnconfirmedTransactions(): Observable<Transaction[]> {
        return this.http.get(API_PREFIX + 'getUnconfirmedTransactions').map(res => res.json());
    }

    getHeight(): Observable<number> {
        return this.http.get(API_PREFIX + 'getHeight').map(res => res.json());
    }

    getDifficulty(): Observable<number> {
        return this.http.get(API_PREFIX + 'getDifficulty').map(res => res.json());
    }

    getBalance(address: string): Observable<number> {
        return this.http.get(API_PREFIX + 'getBalance/' + address).map(res => res.json());
    }

    submitBlock(block: Block): Observable<Response> {
        return this.http.post(API_PREFIX + 'submitBlock', block);
    }

    submitTransaction(transaction: Transaction): Observable<Response> {
        return this.http.post(API_PREFIX + 'submitTransaction', transaction);
    }
}

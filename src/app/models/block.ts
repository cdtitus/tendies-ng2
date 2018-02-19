import { SHA256 } from 'crypto-js';
import { Account } from './account';

export class Block {
    hash: string;
    nonce: number = 0;
    timestamp: string;
    coinbase: Account;
    transactions: any[];
    prevHash: string;

    calculateHash(): string {
        return SHA256(
            this.nonce +
            this.timestamp + 
            this.coinbase + 
            JSON.stringify(this.transactions) +
            this.prevHash
        ).toString();
    }
}

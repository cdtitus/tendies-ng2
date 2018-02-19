import { Component, OnInit } from '@angular/core';
import { Block } from './models/block';
import { Account } from './models/account';
import { Transaction } from './models/transaction';
import { BlockChainService } from './blockchain.service';
import { SHA256 } from 'crypto-js';
import * as KJUR from 'jsrsasign';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
    constructor(private service: BlockChainService) {}

    pubKey: string = '';
    privKey: string = '';
    ctAddr: string = '';
    wallet: Wallet = new Wallet();
    balance: number = 0;
    balanceAddr: string = '';    
    txRecipient: string = '';
    txAmount: string = '';

    mining: boolean = false;
    mAddress: string = '';

    date: Date = new Date();
    block: Block = new Block();
    transactions: Transaction[] = [];
    height: number;
    blockNumber: string = '';
    difficulty: number;

    ngOnInit(): void {
        this.getHeight();
        this.getDifficulty();
    }

    generateKeyPair(): void {
        let keyPair = this.wallet.generateKeyPair();
        this.privKey = keyPair.ecprvhex;
        this.pubKey = keyPair.ecpubhex;
        this.ctAddr = SHA256(keyPair.ecpubhex).toString();
    }

    getBalance(): void {
        this.service.getBalance(this.balanceAddr).subscribe((res: number) => {
            this.balance = res;
        });
    }

    getBlockInfo(): void {
        this.service.getBlock(Number(this.blockNumber)).subscribe((res: Block) => {
            this.block = res;
        });
    }

    prevBlockInfo(): void {
        this.blockNumber = (Number(this.blockNumber) - 1).toString();
        this.getBlockInfo();
    }

    nextBlockInfo(): void {
        this.blockNumber = (Number(this.blockNumber) + 1).toString();
        this.getBlockInfo();
    }
    
    getUnconfirmedTxs(): void {
        this.service.getUnconfirmedTransactions().subscribe((res: Transaction[]) => {
            this.transactions = res;
        });
    }

    getHeight(): void {
        this.service.getHeight().subscribe((res: number) => {
            this.height = res;
        });
    }

    getDifficulty(): void {
        this.service.getDifficulty().subscribe((res: number) => {
            this.difficulty = res;
        });
    }

    createTx(): void {
        let tx = this.wallet.createSignedTransaction(this.txRecipient, Number(this.txAmount));
        this.service.submitTransaction(tx).subscribe();
        this.txRecipient = '';
        this.txAmount = '';
    }

    generateBlockTemplate(): Block {
        let block = new Block();

        block.hash = block.calculateHash();
        block.nonce = 0;
        block.timestamp = this.date.getTime().toString();
        block.coinbase = new Account('', 0);
        block.transactions = this.transactions;
        block.prevHash = null;

        return block;
    }

    mineBlock(): void {
        if (!this.mAddress.length) {
            alert('no address to pay');
            return;
        }

        console.log("Mining block...");
        this.mining = true;
        
        let minedBlock = this.generateBlockTemplate();

        this.service.getLatestHash().subscribe((res: string) => {
            minedBlock.prevHash = this.block.hash;
            minedBlock.coinbase.address = this.mAddress;
            minedBlock.coinbase.amount = 50;

            while (minedBlock.hash.substring(0, this.difficulty) !== Array(this.difficulty + 1).join("0")) {
                minedBlock.nonce++;
                minedBlock.hash = minedBlock.calculateHash();
            }

            this.service.submitBlock(minedBlock).subscribe();
            console.log('Block submitted.', minedBlock);
            this.mining = false;
        });
    }
}
export class Wallet {
    constructor() {}

    privateKey: string = 'f2451334ae17fd0fce262a67be3c6eeb6ecc16334283a786eef78e4c466c04cb';
    publicKey: string = '040544ef969326d29ebcb0f3654892f6792a8a5aa9dae452a3f248bc8fc2cd7030cef5ee9a0b68e4f3a5c790d0042ef3b3d9a492286978079a8c64ac8e4ba593b0';
    address: string = 'c05cf8134f544fcac55fe77578651d773506219fd03e245d65696419294a985b';

    generateKeyPair(): any {
        let generator = new KJUR.crypto.ECDSA({curve: 'secp256k1'});
        let keyPair = generator.generateKeyPairHex();
    
        var privateKey = keyPair.ecprvhex;
        var publicKey = keyPair.ecpubhex;
        console.log(privateKey);
        console.log(publicKey);
        
        return keyPair;
    }

    createSignedTransaction(txRecipient: string, amount: number): Transaction {
        let tx = new Transaction(this.address, txRecipient, amount, this.publicKey);
        tx.sign(this.privateKey);
        return tx;
    }
}

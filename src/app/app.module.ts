import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { MatInputModule, MatChipsModule, MatButtonModule, MatCardModule, MatListModule, MatDividerModule, MatFormFieldModule, MatNativeDateModule, MatProgressBarModule, MatTabsModule, MatIconModule } from '@angular/material';
import { BlockChainService } from './blockchain.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatDividerModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatTabsModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  providers: [
    BlockChainService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

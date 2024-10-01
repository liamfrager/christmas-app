import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/ui/header/header.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './components/ui/footer/footer.component';

@NgModule({
  declarations: [],
  imports: [AppComponent, HeaderComponent, FooterComponent, BrowserModule, FormsModule, CommonModule],
  providers: [],
  bootstrap: [],
})
export class AppModule {}

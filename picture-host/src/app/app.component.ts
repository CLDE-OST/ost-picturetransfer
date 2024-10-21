import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import { UploadComponent } from "./upload/upload.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatSlideToggleModule, HeaderComponent, FooterComponent, MatCardModule, MatIconModule, UploadComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'picture-host';
}



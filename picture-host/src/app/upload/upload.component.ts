import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { S3Client, ListObjectsCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { MatCardModule } from '@angular/material/card';


@Component({
  selector: 'app-upload',
  imports: [CommonModule,MatCardModule],
  standalone: true,
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {

  private s3Client: S3Client;
  private bucketName: string = 'bucket-mit-cooli-bilder';

  previewUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;  // Neue Variable für die ausgewählte Datei

  constructor() {
    this.s3Client = new S3Client({
      credentials: {
        accessKeyId: '-',
        secretAccessKey: '-',
        sessionToken: '-',
      },
      region: 'us-east-1',
    });
  }

  // Speichere die ausgewählte Datei und zeige die Vorschau
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedFile = file;  // Datei speichern

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Trigger den Upload bei Button-Klick
  triggerUpload(): void {
    if (this.selectedFile) {
      this.uploadToAWS(this.selectedFile);
    } else {
      console.error('Keine Datei ausgewählt');
    }
  }

  // Funktion zum Hochladen von Bildern
  async uploadToAWS(file: File): Promise<void> {
    const uploadParams = {
      Bucket: this.bucketName,
      Key: `${Date.now()}_${file.name}`, // Zufälliger Dateiname
      Body: file,
      ContentType: file.type,
      
    };
    console.log('Uploading file:', file.name);
console.log('Bucket:', this.bucketName);

    try {
      const data = await this.s3Client.send(new PutObjectCommand(uploadParams));
      console.log('Upload erfolgreich:', data);
    } catch (err) {
      console.error('Fehler beim Hochladen:', err);
    }
  }
}
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
        accessKeyId: 'ASIAY74IA2MFQDYLTKGV',
        secretAccessKey: '1bORWfJ8M0Kh7MuN20xx4LHZ81Gn2sz1f61m8dFd',
        sessionToken: 'IQoJb3JpZ2luX2VjECgaCXVzLXdlc3QtMiJGMEQCICNeZaChy0B/oaMaPac6S3UsRM4DZd0YGXoxWvDsgB0BAiBUWqAo1ue4efvZGun0ezpngT4Tyg3C2ywX+eCexr3WFSq7AgiR//////////8BEAAaDDYxODIyMzY4NjQxMSIMzFzRwp0DoJOv3BJiKo8ChQfRllIbmBxMTVS88NnMuhHucJTgHbunfcgHdU77OpuRjHslFj8EeULdq0PaJsaEWnT66RwJvlAJjslTDn9xx/X7EzCj30BioZjNMolZ/GEPIAqf0orZx4ZSV5NDSoIKDFPA1DsgB0iTgpbAZOfpjyFWNmBl+8p0z3dKRREM2EdJ38I6w7XtpJ4ckmkZTWw3w7+04DqfdoPvhdzqcMtgbt+Ggqaa42t38y6tQsFDNotpenbbN4DQaPnRkrr+5wiqamZVZenF5EivMauqZ6HB5Ao5dYZOoT5BzG7/Yu+YTRt03fTM5O5rzNMxKo9NF7QEjiow6arq0kQ9JBi+AB7zJkstHWB5BVkUHJchLNZrCDCf5dm4BjqeATNw0kYqUgkIVrSm/SPaUQD4Zac6QxB0t7rwJ/BdsFJGdOS0lxRNqRB93vsbubAbfQy2bAhlu5JMcVUuqc/ijpi0o5/dtCmMWgxr6syQEm3wyK/V32DVgkKGIh/xQVk+NaZ61OIkBTrZ9J2/VfXnyBwJgEL81Tck+FQLrvfKyQFOL+l9ctXw40rNuOMzlWK0an1vSGCQsTwQRX3TaEOi',
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
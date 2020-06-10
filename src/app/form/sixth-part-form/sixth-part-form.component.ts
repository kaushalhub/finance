import { Component, AfterViewInit } from '@angular/core';
import { GroupFormToPDFService } from 'src/app/services/group-form-to-pdf.service';
import * as jsPDF from 'jspdf';
import { Router } from '@angular/router';
import Email from './../../../assets/scripts/smtp.js'; //file path may change → 
import { User } from 'src/app/models/user.model.js';


@Component({
  selector: 'app-sixth-part-form',
  templateUrl: './sixth-part-form.component.html',
  styleUrls: ['./sixth-part-form.component.scss']
})
export class SixthPartFormComponent implements AfterViewInit {
  menuFont = true;
  fullData = [];
  newUser: User;
  labels: any;
  time: number;
  isLoading = false;
  urlSigningDocument = 'URL_DOCUMENT';
  file = './../../../assets/emails/application.html';

  constructor(
    public pdfService: GroupFormToPDFService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.fullData = this.pdfService.exportData();
    this.labels = this.pdfService.exportLabels();
  }

  ngAfterViewInit() {
    this.newUser = JSON.parse(localStorage.getItem('newUser'));
    const body = this.readTextFile(this.file);
    this.sendEmail(this.newUser.profile.email, body);
  }

  makePDF() {
    var doc = new jsPDF("portrait", "cm", "letter");

    // Logo
    doc.setFontSize(40);
    doc.setTextColor(235, 91, 109);
    doc.setFontType("bold");
    doc.setFont("helvetica");
    doc.text(2, 2, 'Guava');

    // Title
    doc.setTextColor(70, 70, 70);
    doc.setFontSize(25);
    doc.text(7.8, 1.9, 'Details of your application');

    // Display of elements
    doc.setFontSize(10);
    doc.setFontType("regular");
    doc.setFont("helvetica");
    let yPosition = 4;
    this.fullData.forEach((form, index) => {
      Object.values(form).forEach((input, indexInput) => {
        let text = this.labels[index][indexInput] + input;
        if (text.length > 100) {
          let newLines = text.match(/.{1,101}/g);
          doc.text(3, yPosition, newLines[0]);
          yPosition += 0.7;
          doc.text(3, yPosition, newLines[1]);
        } else {
          doc.text(3, yPosition, text);
        }
        yPosition += 1;
        if (yPosition >= 26) {
          // Add a new page
          doc.addPage('letter', 'p');
          // Add the "Logo"
          doc.setFontSize(40);
          doc.setTextColor(235, 91, 109);
          doc.setFontType("bold");
          doc.setFont("helvetica");
          doc.text(2, 2, 'Guava');
          // Return to the body style
          doc.setTextColor(70, 70, 70);
          doc.setFontSize(10);
          doc.setFontType("regular");
          doc.setFont("helvetica");
          yPosition = 3;
        }
      });
      yPosition += 1;
    });
    return doc.output('datauri');
  }

  readTextFile(file: string) {
    let returnHTML: string;
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = () => {
      if (rawFile.readyState === 4) {
        if (rawFile.status === 200 || rawFile.status == 0) {
          returnHTML = rawFile.responseText;
        }
      }
    }
    rawFile.send(null);
    return returnHTML;
  }

  sendEmail(email: string, body: string) {
    Email.send({
      Host: 'smtp.elasticemail.com',
      Username: '', // Add SMTP username
      Password: '', // Add SMTP password
      To: email,
      From: '',     // Add SMTP mail
      Subject: 'New guava application',
      Body: body,
      Attachments: [
        {
          name: 'application.pdf',
          data: this.makePDF(),
        }
      ]
    })
      .then(message => {
        console.log(message);
      });

  }

}
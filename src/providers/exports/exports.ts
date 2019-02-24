import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file/ngx';
import * as xlsx from 'xlsx';
import { Platform } from 'ionic-angular';
import { FileOpener } from '@ionic-native/file-opener/ngx'
/*
  Generated class for the ExportsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ExportsProvider {
  data: any

  constructor(public http: HttpClient, public file: File, private plt: Platform,
    public fileOpener: FileOpener) {
    console.log('Hello ExportsProvider Provider');
  }


  createXlsx() {
    console.log("Data is ", this.data);

    let sheet = xlsx.utils.json_to_sheet(this.data);
    let book = {
      SheetNames: ["export"],
      Sheets: {
        "export": sheet
      }
    };

    let wbout = xlsx.write(book, {
      bookType: 'xlsx',
      bookSST: false,
      type: 'binary'
    });
    return wbout;
  }


  createBuffer(s) {
    let buffer = new ArrayBuffer(s.length);
    let view = new Uint8Array(buffer);
    for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buffer;
  }


  async exportXlsx(expenses: any[]) {
    console.log(xlsx.version, "is the version")
    this.data = expenses
    let wb = this.createXlsx();
    this.downloadXlsx(wb)
  }

  async exportPdf(expenses:any[]){
    console.log("expenses for export is ",expenses);
    
  }

  getStoragePath() {
    let file = this.file;
    return this.file.resolveDirectoryUrl(this.file.externalRootDirectory).then(function (directoryEntry) {
      return file.getDirectory(directoryEntry, "Ionic2ExportToXLSX", {
        create: true,
        exclusive: false
      }).then(function () {
        return directoryEntry.nativeURL + "Ionic2ExportToXLSX/";
      });
    });
  }

  downloadXlsx(wb) {
    let buffer = this.createBuffer(wb)
    let blob = new Blob([buffer], { type: 'application/octet-stream' });

    if (this.plt.is('cordova')) {
      // Save the xlsx to the data Directory of our App

      this.file.writeFile(this.file.dataDirectory, 'expenseExport.xlsx', blob, { append: true, replace: false })
        .then(fileEntry => {
          // Open the xlsx with the correct OS tools
          this.fileOpener.open(this.file.dataDirectory + 'myletter.pdf', 'application/pdf');
        })
    }
    else {
      //   // On a browser simply use download!
      let link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'expense_export.xlsx';
      link.click()
    }
  }
}

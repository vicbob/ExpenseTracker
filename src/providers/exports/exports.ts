import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file/ngx';
import * as xlsx from 'xlsx';
import { Platform } from 'ionic-angular';
import { TitleCasePipe } from '@angular/common';
import { FileOpener } from '@ionic-native/file-opener/ngx'
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { StatisticsProvider } from '../statistics/statistics';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

/*
  Generated class for the ExportsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ExportsProvider {
  data: any
  pdfObj: any = null;
  expenses: any[] = [];

  constructor(public http: HttpClient, public file: File, private plt: Platform,
    public fileOpener: FileOpener, private statsProvider: StatisticsProvider) {
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

  async exportPdf(expenses: any[], title: String) {
    this.expenses = expenses
    expenses.reverse()
    expenses.forEach(expense => {
      expense.date = expense.date.toISOString().slice(0, 10)
    })
    console.log(expenses);

    await this.createPdf(expenses, title)
    await this.downloadPdf()

  }
  async downloadPdf() {
    if (this.plt.is('cordova')) {
      this.pdfObj.getBuffer((buffer) => {
        var blob = new Blob([buffer], { type: 'application/pdf' });

        // Save the PDF to the data Directory of our App
        this.file.writeFile(this.file.dataDirectory, 'report' +
          new Date().toISOString().slice(0, 10) + '.pdf',
          blob, { append: true }).then(fileEntry => {
            // Open the PDf with the correct OS tools
            this.fileOpener.open(this.file.dataDirectory + 'report' +
              new Date().toISOString().slice(0, 10) + '.pdf',
              'application/pdf');
          })
      });
    } else {
      // On a browser simply use download!
      this.pdfObj.download();
    }
  }


  async createPdf(expenses: any[], title: String) {
    let tableHeader = [
      { text: "Name", style: 'subheader', alignment: "center" },
      { text: "Price", style: 'subheader', alignment: "center" },
      { text: "Date", style: 'subheader', alignment: "center" },
      { text: "Category", style: 'subheader', alignment: "center" }
    ]
    let docDefinition: any = {
      content: [
        //header
        { text: title, style: 'header', alignment: "center", margin: [0, 0, 0, 20] },
        //table starts
        {
          columns: [
            { width: '*', text: '' },
            {
              width: 'auto',
              table:
              {
                margin: [0, 0, 0, 30],
                headerRows: 1,
                widths: [120, 60, 80, 80],
                body: [
                  tableHeader
                ]
              }
            },
            { width: '*', text: '' },
          ]
        }
        //table structure ends
      ],
      footer: function (currentPage, pageCount) {
        return currentPage.toString() + ' of ' + pageCount;
      },

      styles: {
        header: {
          fontSize: 18,
          bold: true,
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 15, 0, 0]
        },
        story: {
          italic: true,
          alignment: 'center',
          width: '50%',
        }
      }
    }

    let sum = 0;
    let titleCase = new TitleCasePipe()
    expenses.forEach(expense => {
      sum += expense.price
      let row = [titleCase.transform(expense.name), expense.price,
      expense.date, titleCase.transform(expense.category)]
      docDefinition.content[1].columns[1].table.body.push(row)
    })
    let lastRow = [{ text: "Total", alignment: "right", style: { bold: true, color: "blue" } },
    { text: sum, style: { bold: true, color: "blue" } }, "", ""]
    docDefinition.content[1].columns[1].table.body.push(lastRow)

    //Stats
    docDefinition.content.push("\n\n\n")
    docDefinition.content.push({ text: "Stats", style: 'header', alignment: "center", margin: [0, 0, 0, 20] })
    let result = await this.statsProvider.generateStats(this.expenses);
    let naira = String.fromCharCode(8358);
    let stats = [
      { text: "Highest Spending Category", style: "subheader" },
      {
        columns:
          [{ text: "Category name:", bold: true }, titleCase.transform(result.hsc.category)]
      },
      {
        columns:
          [{ text: "Amount spent:", bold: true }, naira + result.hsc.price + "\n\n"]
      },
      { text: "Lowest Spending Category", style: "subheader" },
      {
        columns:
          [{ text: "Category name:", bold: true }, titleCase.transform(result.lsc.category)]
      },
      {
        columns:
          [{ text: "Amount spent:", bold: true }, naira + result.lsc.price + "\n\n"]
      },
      { text: "Highest Priced Expense", style: "subheader" },
      {
        columns:
          [{ text: "Expense name:", bold: true }, titleCase.transform(result.hpe.name)]
      },
      {
        columns:
          [{ text: "Price:", bold: true }, naira + result.hpe.price]
      },
      {
        columns:
          [{ text: "Category:", bold: true }, titleCase.transform(result.hpe.category)]
      },
      {
        columns:
          [{ text: "Date:", bold: true }, new Date(result.hpe.date).toDateString() + "\n\n"]
      },
      { text: "Highest Spending Day", style: "subheader" },
      {
        columns:
          [{ text: "Date:", bold: true }, new Date(result.hsd.date).toDateString()]
      },
      {
        columns:
          [{ text: "Amount spent:", bold: true }, naira + result.hsd.amount + "\n\n"]
      },
      { text: "Lowest Spending Day", style: "subheader" },
      {
        columns:
          [{ text: "Date:", bold: true }, new Date(result.lsd.date).toDateString()]
      },
      {
        columns:
          [{ text: "Amount spent:", bold: true }, naira + result.lsd.amount + "\n\n"]
      },
    ]

    stats.forEach(element => {
      docDefinition.content.push(element)
    })


    this.pdfObj = pdfMake.createPdf(docDefinition);
  }

  // getStoragePath() {
  //   let file = this.file;
  //   return this.file.resolveDirectoryUrl(this.file.externalRootDirectory).then(function (directoryEntry) {
  //     return file.getDirectory(directoryEntry, "Ionic2ExportToXLSX", {
  //       create: true,
  //       exclusive: false
  //     }).then(function () {
  //       return directoryEntry.nativeURL + "Ionic2ExportToXLSX/";
  //     });
  //   });
  // }

  downloadXlsx(wb) {
    let buffer = this.createBuffer(wb)
    let blob = new Blob([buffer], { type: 'application/octet-stream' });

    if (this.plt.is('cordova')) {
      // Save the xlsx to the data Directory of our App

      this.file.writeFile(this.file.dataDirectory, 'expenseExport.xlsx', blob, { append: true, replace: false })
        .then(fileEntry => {
          // Open the xlsx with the correct OS tools
          this.fileOpener.open(this.file.dataDirectory + 'expenseExport.xlsx', 'application/octet-stream');
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

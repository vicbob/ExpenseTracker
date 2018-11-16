import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the AppConstantsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AppConstantsProvider {
  BASEURL:string = "http://localhost:5000"

  constructor() {
  }

   /* This function takes last element as pivot, 
       places the pivot element at its correct 
       position in sorted array, and places all 
       smaller (smaller than pivot) to left of 
       pivot and all greater elements to right 
       of pivot */
        partition(arr:any[],low:number,high:number) 
       {    
          console.log("The value is ",arr[high])
           let pivot = arr[high].date;  
           let i = (low-1); // index of smaller element 
           for (let j=low; j<high; j++) 
           { 
               // If current element is smaller than or 
               // equal to pivot 
               if (arr[j].date <= pivot) 
               { 
                   i++; 
     
                   // swap arr[i] and arr[j] 
                   let temp = arr[i]; 
                   arr[i] = arr[j]; 
                   arr[j] = temp; 
               } 
           } 
     
           // swap arr[i+1] and arr[high] (or pivot) 
           let temp = arr[i+1]; 
           arr[i+1] = arr[high]; 
           arr[high] = temp; 
     
           return i+1; 
       }

  quickSortExpenses(expenses:any[],low:number,high:number){
    if (low < high) 
    { 
        /* pi is partitioning index, arr[pi] is  
          now at right place */
        let pi = this.partition(expenses, low, high); 

        // Recursively sort elements before 
        // partition and after partition 
        this.quickSortExpenses(expenses, low, pi-1); 
        this.quickSortExpenses(expenses, pi+1, high); 
    } 
  }

}

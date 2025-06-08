import { Injectable } from '@angular/core';
import { Item } from '../data/Item';
@Injectable({
  providedIn: 'root'
})

export class LocaldataService {
  private localStorageKey = 'items';
  constructor() {}

  getItems(): Item[] {
    const itemsJson = localStorage.getItem(this.localStorageKey); // Retrieve items JSON string from local storage
    return itemsJson ? JSON.parse(itemsJson) : []; // Parse JSON string to array of items, return empty array if no items found
  }

  getVarss(key:string): string|null {
    const itemsJson = localStorage.getItem(key) ; // Retrieve items JSON string from local storage
    return itemsJson; // Parse JSON string to array of items, return empty array if no items found
  }
  
  addItem(item: Item): void {
    let items = this.getItems(); // Retrieve current items from local storage
    items.push(item); // Add the new item to the array
    localStorage.setItem(this.localStorageKey, JSON.stringify(items)); // Store the updated array back to local storage
  }
  
  addVar(userV: string){
    localStorage.setItem(this.localStorageKey, userV); 
  }


 
 
  removeItem(itemId: string): void {
    let items = this.getItems();
    items = items.filter(item => item.id !== itemId);
    localStorage.setItem(this.localStorageKey, JSON.stringify(items));
  }
}
 

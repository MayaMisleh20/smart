import { Injectable } from '@angular/core';
import { getDatabase, ref, set, get, update, remove, push, child, onValue } from 'firebase/database';
import { initializeApp } from "firebase/app";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'; 
import { Observable } from 'rxjs';
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";

// firebase ==> promice 

@Injectable({
  providedIn: 'root'
})

export class FirebaseService { 
  db: any;
  storage: any;

  constructor() {
    this.setupFirebase();  
    this.db = getDatabase();    
    this.storage = getStorage();
  }
  
        // on click ==> on value changes ==> callback when data is recived we latch ==> proccess data

        
      setupFirebase(){ //got from FB
        const firebaseConfig = {
          apiKey: "AIzaSyAz7-0dyu7NrqIi325mstgpw9jsfYmoXGA",
          authDomain: "smartvac-642fb.firebaseapp.com",
          databaseURL: " https://smartvac-642fb-default-rtdb.firebaseio.com",
          projectId: "smartvac-642fb",
          storageBucket: "smartvac-642fb.firebasestorage.app",
          messagingSenderId: "644610854653",
          appId: "1:644610854653:web:e176a0a58316c8ee76f894",
          measurementId: "G-PQFNN2LMZT"
        };
        
        initializeApp(firebaseConfig);
        const auth = getAuth(initializeApp(firebaseConfig));
      }                 

      createObject(path: string, data: any) {
        return set(ref(this.db, path), data);
      }

      async readObject(path: string, key: string): Promise<string>{
        return get(child(ref(this.db), `${path}/${key}`)).then((snapshot) => {
          if (snapshot.exists()) return snapshot.val(); 
        })      
       }

      updateObject(path: string, key: string, data: any) { //wrapping service
        update(ref(this.db, `${path}/${key}`), data);
      }

      deleteObject(path: string, key: string){
        remove(ref(this.db, `${path}/${key}`));
      }

      async readList(path: string): Promise<any[]> {
        const snapshot = await get(ref(this.db, path));
        const list: any[] = [];
        snapshot.forEach(childSnapshot => {
          list.push(childSnapshot.val());
        });
        return list;
      }
    
      addToList(path: string, data: any){
        return push(ref(this.db, path), data).key;
      }
    
      removeFromList(path: string, key: string){
        remove(ref(this.db, `${path}/${key}`));
      }

     getDataContinuosly(field: string): Observable<[]>{
      return new Observable((observer) => {
        onValue(ref(this.db, field), (data) => {
          if(data.valueOf()!= null)
            observer.next(data.val());
        });
      });
     }
     
     reset(){
        remove(ref(this.db, '/'));
     }

     uploadImage(file: File, filePath: string): Promise<string> {
      const fileRef = storageRef(this.storage, filePath);
      return uploadBytes(fileRef, file).then(snapshot => {
        return getDownloadURL(snapshot.ref);
      });
    }

    registerUser(email: string, password: string): Promise<any> {
      const auth = getAuth();
      return createUserWithEmailAndPassword(auth, email, password);
    }
  
    signInUser(email: string, password: string): Promise<any> {
      const auth = getAuth();
      return signInWithEmailAndPassword(auth, email, password);
    }
  
    resetPassword(email: string): Promise<void> {
      const auth = getAuth();
      return sendPasswordResetEmail(auth, email);
    }

   deleteMessage(key: string): void {
      const confirmDelete = confirm("Are you sure you want to delete this message?");
      if (confirmDelete) {
        remove(ref(this.db, `/messages/${key}`));
      }
    }
    // Method to reset the messages (delete all messages)
    resetMessages(): void {
      remove(ref(this.db, '/messages'));
    }
}
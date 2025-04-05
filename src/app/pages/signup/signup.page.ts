import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonInput,
  IonButton,
  IonButtons,
  IonMenuButton,
  IonCheckbox,
  IonLabel
} from '@ionic/angular/standalone';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonItem,
    IonInput,
    IonButton,
    IonButtons,
    IonMenuButton,
    IonCheckbox,
    IonLabel
  ]
})
export class SignupPage implements OnInit {
  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      marketingOptIn: [false]
    });
  }

  async signup() {
    const { email, password } = this.signupForm.value;
  
    try {
      await createUserWithEmailAndPassword(this.auth, email, password);
      console.log('✅ Signup successful');
      this.router.navigateByUrl('/welcome');
    } catch (error) {
      alert((error as any).message);
    }
  }
  
  ngOnInit(): void {}
}

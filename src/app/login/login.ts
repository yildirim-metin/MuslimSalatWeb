import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Pour *ngIf
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true, // Si tu es en mode standalone
  imports: [ReactiveFormsModule, CommonModule], // Imports nécessaires
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    // Création du formulaire avec validations
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Données du formulaire :', this.loginForm.value);
      
      // Ici, tu appelleras plus tard ton service d'authentification
      // Pour l'instant, on simule une redirection
      this.router.navigate(['/dashboard']); 
    } else {
      this.errorMessage = "Veuillez remplir correctement tous les champs.";
    }
  }
}
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})

export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  userId: number | null = null;
  errorMessages: { [key: string]: string } = {};

  errorMessage: string = '';
  currentPassword: string = '';
  

  constructor(
    private router: Router,
    private formBuilder: FormBuilder, 
    private profileService: ProfileService
  ) {}

  ngOnInit() {
    this.profileForm = this.formBuilder.group({
      name: [''],
      email: ['', [Validators.email]],
      oldPassword: [''],
      newPassword: [''],
      confirmPassword: [''],
    }, { validators: this.passwordValidation });
  
    const storedUserId = localStorage.getItem('userId');
    this.userId = storedUserId ? Number(storedUserId) : null;
  
    if (this.userId !== null) {
      this.profileService.getUserProfile(this.userId).subscribe((user) => {
        this.profileForm.patchValue({
          name: user.name || '',
          email: user.email || '',
        });

        this.currentPassword = user.password; // Stocker le mot de passe récupéré
      });
    }
  }

  passwordValidation(group: FormGroup) {
    const oldPassword = group.get('oldPassword')?.value;
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
  
    let errors: any = {};
  
    if (oldPassword && (!newPassword || !confirmPassword)) {
      errors.passwordRequired = true;
    }
  
    if (newPassword !== confirmPassword) {
      errors.mismatch = true;
    }
  
    return Object.keys(errors).length ? errors : null;
  }
  
  
  passwordsMatch(group: FormGroup) {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  cancel(){
    // this.router.navigate([`/student/${this.userId}`]);
    window.history.back();
  }

  onSubmit(event: Event) {
    event.preventDefault();

    if (this.profileForm.valid) {
      const updatedData: any = {};

      if (this.profileForm.get('name')?.value) {
        updatedData.name = this.profileForm.get('name')?.value;
      }
      if (this.profileForm.get('email')?.value) {
        updatedData.email = this.profileForm.get('email')?.value;
      }

      const oldPassword = this.profileForm.get('oldPassword')?.value;
      const newPassword = this.profileForm.get('newPassword')?.value;
      const confirmPassword = this.profileForm.get('confirmPassword')?.value;

      // Vérifier si l'ancien mot de passe est correct (logique côté serveur)
      if (oldPassword) {
        updatedData.oldPassword = oldPassword;
      }

      // Vérification des nouveaux mots de passe
      if (newPassword && confirmPassword) {
        if (newPassword !== confirmPassword) {
          this.errorMessage = "Les mots de passe ne correspondent pas.";
          return;
        }
        updatedData.password = newPassword;
      }

      if (Object.keys(updatedData).length > 0 && this.userId !== null) {
        this.profileService.setUserProfile(this.userId, updatedData).subscribe({
          next: (response) => {
            console.log('Profil mis à jour:', response);
            this.errorMessages = {};
            this.errorMessage = '';
            this.router.navigate([`/modifprofile/${this.userId}`]);
          },
          error: (err) => {
            console.error('Erreur lors de la mise à jour du profil', err);
            if (err.error && typeof err.error === 'object') {
              this.errorMessages = err.error;
            } else if (err.error && typeof err.error === 'string') {
              this.errorMessage = err.error;
            } else {
              this.errorMessage = 'Une erreur inconnue est survenue.';
            }
          },
        });
      } else {
        alert('Aucune modification détectée.');
      }
    }
  }     
  
  get name() { return this.profileForm.get('name'); }
  get email() { return this.profileForm.get('email'); }
  get oldPassword() { return this.profileForm.get('oldPassword'); }
  get newPassword() { return this.profileForm.get('newPassword'); }
  get confirmPassword() { return this.profileForm.get('confirmPassword'); }
}

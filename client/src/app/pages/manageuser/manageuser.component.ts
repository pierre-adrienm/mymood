import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manageuser',
  imports: [CommonModule, FormsModule],
  templateUrl: './manageuser.component.html',
  styleUrl: './manageuser.component.css'
})
export class ManageuserComponent implements OnInit {
  userId: number | null = null;
  users: any[] = [];
  selectedUser: any = null;
  formUser: any = {};
  groups: any[] = [];
  newUser = { name: '', email: '', password: '', status: '' };
  newGroupName = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchUsers();
    this.fetchGroups();
    this.getUsers();
  }

  fetchUsers() {
    this.userService.getUsers().subscribe(data => this.users = data);
  }

  fetchGroups() {
    this.userService.getGroups().subscribe(data => this.groups = data);
  }

  addUser() {
    if (!this.newUser.name || !this.newUser.email || !this.newUser.password || !this.newUser.status) {
      alert('Tous les champs sont obligatoires.');
      return;
    }

    this.userService.addUser(this.newUser).subscribe({
      next: (response) => {
        console.log('Utilisateur ajouté avec succès', response);
        alert('Utilisateur ajouté avec succès');
        this.newUser = { name: '', email: '', password: '', status: '' }; // Réinitialise le formulaire
      },
      error: (error) => {
        console.error('Erreur lors de l\'ajout de l\'utilisateur', error);
        alert('Erreur : ' + (error.error?.message || 'Impossible d\'ajouter l\'utilisateur.'));
      }
    });
  }

  getUsers() {
    this.userService.getUsers().subscribe({
      next: (data) => {
        console.log("Données utilisateurs reçues :", data);
        this.users = data;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des utilisateurs', err);
        alert('Erreur : Impossible de charger la liste des utilisateurs.');
      }
    });
  }
  

  editUser(user: any) {
    this.selectedUser = { ...user, oldPassword: '' }; // Stocke une copie pour modification
  }

  openModal(user: any) {
    this.selectedUser = user;
    this.formUser = { 
      name: user.name || '',
      email: user.email || '',
      password: '',
      confirmPassword: '',
      status: user.status || ''
    };
  }

  closeModal() {
    this.selectedUser = null;
    this.formUser = {}; // Réinitialisation des champs
  }

  updateUser() {
    if (!this.selectedUser || !this.selectedUser.id_user) {
      console.error("Aucun utilisateur sélectionné");
      return;
    }

    const updatedUser = {
      id_user: Number(this.selectedUser.id_user),
      name: this.formUser.name,
      email: this.formUser.email,
      password: this.formUser.password || null,
      status: this.formUser.status
    };

    this.userService.updateUser(updatedUser.id_user, updatedUser).subscribe(
      (response) => {
        console.log("Utilisateur mis à jour:", response);
        this.closeModal();
      },
      (error) => {
        console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
      }
    );
  }

  deleteUser(id: number) {
    console.log("ID reçu pour suppression:", id); // <-- Test
    if (!id) {
      alert("Erreur : l'ID de l'utilisateur est invalide.");
      return;
    }
  
    if (confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          alert('Utilisateur supprimé');
          this.getUsers();
        },
        error: (err) => {
          console.error("Erreur lors de la suppression", err);
          alert('Erreur : Impossible de supprimer l\'utilisateur.');
        }
      });
    }
  }
  

  addGroup() {
    this.userService.addGroup(this.newGroupName).subscribe(() => {
      this.fetchGroups();
      this.newGroupName = '';
    });
  }

  deleteGroup(id: number) {
    this.userService.deleteGroup(id).subscribe(() => this.fetchGroups());
  }

  redirectToProfileGroup(groupId: number): void {
    if (this.userId !== null) {
      this.router.navigate([`/admin/${this.userId}/profilegroup/${groupId}`]);
    } else {
      this.router.navigate(['/login']);
    }
  }

  logUser(user: any) {
    console.log(user);
  }  
}
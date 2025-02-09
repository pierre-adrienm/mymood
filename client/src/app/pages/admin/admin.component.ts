import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  userId: number | null = null;
  groups: any[] = [];

  constructor(
    private adminService: AdminService, 
    private router: Router
  ) { }

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.userId = +userId; // Conversion en nombre
    } else {
      // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
      this.router.navigate(['/login']);
    }
  
    this.adminService.getGroups().subscribe(
      (data) => {
        this.groups = data;
      },
      (error) => {
        console.error('Error fetching groups', error);
      }
    );
  }

  redirectToProfileGroup(groupId: number): void {
    if (this.userId !== null) {
      this.router.navigate([`/admin/${this.userId}/profilegroup/${groupId}`]);
    } else {
      // Ajouter une redirection vers la page de connexion si l'utilisateur n'est pas connecté
      this.router.navigate(['/login']);
    }
  }

  redirectToManageUser(): void {
    this.router.navigate([`/manageuser/${this.userId}`]);
  } 
}

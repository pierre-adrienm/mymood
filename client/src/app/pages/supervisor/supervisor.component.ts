import { Component } from '@angular/core';
import { SupervisorService } from '../../services/supervisor.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-supervisor',
  imports: [CommonModule, RouterModule],
  templateUrl: './supervisor.component.html',
  styleUrl: './supervisor.component.css'
})
export class SupervisorComponent {
  groups: any[] = [];
  idUser: number | null = null;
  idGroup: number | null = null;

  constructor(
    private supervisorService: SupervisorService,
    private route: ActivatedRoute 
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.idUser = +params['id'];  // Récupère l'ID de l'utilisateur (superviseur)
      this.idGroup = +params['id_group'];  // Récupère l'ID du groupe
    });
  
    this.supervisorService.getGroups().subscribe(
      (data) => {
        console.log('Données récupérées:', data); // Affiche les données dans la console
        this.groups = data; // Assigner les groupes
      },
      (error) => {
        console.error('Erreur lors de la récupération des groupes', error);
      }
    );
  }
}

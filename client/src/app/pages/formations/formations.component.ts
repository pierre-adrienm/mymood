import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SupervisorService } from '../../services/supervisor.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-formations',
  imports: [CommonModule],
  templateUrl: './formations.component.html',
  styleUrl: './formations.component.css'
})
export class FormationsComponent implements OnInit{

  idUser: number | null = null;
  idGroup: number | null = null;
  idFormation: number | null = null;
  users: any[] = [];
  usersInFormation: any[] = [];
  averageHummer: number = 0;
  GroupName: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private supervisorService: SupervisorService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      console.log('params', params);
      this.idUser = +params['id'];  // Récupère l'ID du superviseur

      // Utilise idFormations comme idGroup
      const idGroupParam = params['idFormations'];
      if (idGroupParam && !isNaN(+idGroupParam)) {
        this.idGroup = +idGroupParam;  // Convertir en nombre seulement si c'est valide
      } else {
        console.error("idGroup is invalid:", idGroupParam);
        return;
      }

      this.idFormation = this.idGroup;  // Utilise idGroup comme idFormation

      // Vérification supplémentaire
      console.log('idGroup:', this.idGroup);

      // Affichage du nom de la formation
      this.supervisorService.getNameGroup(this.idGroup).subscribe(
        (groupArray: any[]) => {
          if (groupArray.length > 0 && groupArray[0].name) {
            this.GroupName = groupArray[0].name;
          } else {
            console.error("Le groupe n'a pas de nom valide :", groupArray);
          }
        },
        (error: any) => {
          console.error("Erreur lors de la récupération du nom du groupe :", error);
        }
      );      

      // Appel du service pour récupérer les utilisateurs du groupe
      this.supervisorService.getUsersInFormation(this.idGroup).subscribe(
        (users: any[]) => {
          this.users = users;
          this.usersInFormation = this.users;  // Filtrage des utilisateurs si nécessaire
        },
        (error: any) => {
          console.error(error);
        }
      );

      // Récupérer la moyenne du groupe
      this.supervisorService.getAverageHummer(this.idGroup).subscribe(
        (average: number) => {
          this.averageHummer = average;
        },
        (error: any) => {
          console.error("Erreur de récupération de la moyenne:", error);
        }
      );
    });
  }

  goBack(): void {
    if (this.idUser !== null) {
      this.router.navigate([`/supervisor/${this.idUser}`]);
    }
  }
  
  // Détermine la couleur en fonction de l'humeur
  getHummerColor(hummer: number): string {
    if (hummer <= 34) return 'red';
    if (hummer <= 67) return 'orange';
    return 'green';
  }

  // Détermine la couleur du cadre selon `call`
  getUserCardColor(call: boolean): string {
    return call ? 'lightcoral' : 'lightgray';
  }

  getGradientColor(): string {
    return `linear-gradient(to right, green, orange, red)`;
  }
  
  goToUserDetail(userId: number) {
    this.router.navigate([`/supervisor/${this.idUser}/formations/${this.idGroup}/user/${userId}`]);
  }
  
}

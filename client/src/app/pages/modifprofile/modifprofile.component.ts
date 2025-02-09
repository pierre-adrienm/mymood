import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-modifprofile',
  imports: [],
  templateUrl: './modifprofile.component.html',
  styleUrl: './modifprofile.component.css'
})
export class ModifprofileComponent {

  userId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private profileService: ProfileService
  ){}

  ngOnInit() {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ok() {
    if (this.userId) {
      this.profileService.getUserProfile(this.userId).subscribe(user => {
        console.log("Réponse complète de l'API :", user);
        console.log("Type de user :", typeof user, "| Contenu :", user);
  
        if (Array.isArray(user)) {
          user = user[0]; // Prendre le premier élément si c'est un tableau
        }
  
        console.log("Type de status :", typeof user.status, "| Valeur :", `"${user.status}"`);
  
        if (!user || !user.status) {
          console.error("Propriété 'status' absente de la réponse !");
          return;
        }
  
        switch (user.status.trim()) {
          case 'admin':
            this.router.navigate([`/admin/${this.userId}`]);
            break;
          case 'supervisor':
            this.router.navigate([`/supervisor/${this.userId}`]);
            break;
          case 'student':
            this.router.navigate([`/student/${this.userId}`]);
            break;
          default:
            console.error("Erreur : Rôle utilisateur inconnu");
        }
      }, error => {
        console.error("Erreur lors de la récupération du profil", error);
      });
    } else {
      console.error("Erreur : userId est null");
    }
  }  
}

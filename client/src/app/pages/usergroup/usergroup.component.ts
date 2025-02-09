import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SupervisorService } from '../../services/supervisor.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-usergroup',
  imports: [CommonModule, RouterModule],
  templateUrl: './usergroup.component.html',
  styleUrls: ['./usergroup.component.css']
})
export class UsergroupComponent implements OnInit {
  userId: number | null = null;
  userData: any = {};
  lastCall: any[] = [];
  lastHummerUpdate: any[] = [];
  last10Hummers: any[] = [];
  last10Calls: any[] = [];

  constructor(
    private supervisorService: SupervisorService,
    private route: ActivatedRoute // Ajout du service ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Récupérer les paramètres dans l'URL
    this.route.paramMap.subscribe(params => {
      const idUser = params.get('idUser'); // Récupérer idUser de l'URL
      this.userId = idUser ? parseInt(idUser, 10) : null; // Assurez-vous de bien le convertir en nombre
  
      if (this.userId !== null) {
        // Si userId est trouvé, charger les données
        this.loadUserData();
        this.loadLastCall();
        this.loadLastHummerUpdate();
        this.loadLast10Hummers();
        this.loadLast10Calls();
      } else {
        console.error('userId est null, impossible de récupérer les données utilisateur.');
      }
    });
  }
  
  loadUserData() {
    if (this.userId !== null) {
      this.supervisorService.getUserInfo(this.userId).subscribe(
        data => {
          console.log('Données utilisateur reçues:', data);
          this.userData = data;  // Assurez-vous que 'data' est bien l'objet que vous attendez
        },
        error => {
          console.error('Erreur lors de la récupération des informations utilisateur:', error);
        }
      );
    }
  }  
  
  loadLastCall() {
    if (this.userId !== null) {
      this.supervisorService.getLastCall(this.userId).subscribe(
        data => {
          console.log('Données dernier appel:', data);
          this.lastCall = data && data.length > 0 ? [data[0]] : [];  // Prendre le premier élément du tableau
        },
        error => {
          console.error('Erreur lors de la récupération du dernier appel:', error);
        }
      );
    }
  }
  
  loadLastHummerUpdate() {
    if (this.userId !== null) {
      this.supervisorService.getLastHummerUpdate(this.userId).subscribe(
        data => {
          console.log('Données dernière mise à jour d\'humeur:', data);
          this.lastHummerUpdate = data && data.length > 0 ? [data[0]] : [];  // Prendre le premier élément du tableau
        },
        error => {
          console.error('Erreur lors de la récupération de la dernière mise à jour d\'humeur:', error);
        }
      );
    }
  }
  
  loadLast10Hummers() {
    if (this.userId !== null) {
      this.supervisorService.getHummersHistory(this.userId).subscribe(
        data => {
          this.last10Hummers = data || [];
        },
        error => {
          console.error('Erreur lors de la récupération de l\'historique des 10 derniers humeurs:', error);
        }
      );
    }
  }

  loadLast10Calls() {
    if (this.userId !== null) {
      this.supervisorService.getCallsHistory(this.userId).subscribe(
        data => {
          this.last10Calls = data || [];
        },
        error => {
          console.error('Erreur lors de la récupération de l\'historique des 10 derniers appels:', error);
        }
      );
    }
  }

  resetCall() {
    if (this.userId !== null) {
      this.supervisorService.resetCall(this.userId).subscribe(
        () => {
          console.log('Appel réinitialisé');
          this.loadLastCall(); // Recharger les données après réinitialisation
        },
        error => {
          console.error('Erreur lors de la réinitialisation de l\'appel:', error);
        }
      );
    }
  }

  goBack() {
    window.history.back();
  }
}

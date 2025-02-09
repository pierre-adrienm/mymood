import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getUserProfile(userId: number | null) {
    console.log('Iduser reçu de l\'API:', userId);
    if (userId === null) {
      throw new Error('L\'ID utilisateur ne peut pas être null');
    }
    return this.http.get<any>(`${this.apiUrl}/user/${userId}`).pipe(
      catchError(err => {
        console.error('Erreur lors de la récupération du profil:', err);
        return throwError(() => err);
      })
    );
  }
  
  setUserProfile(userId: number, data: any): Observable<any> {
    console.log('Données envoyées à l\'API:', data);
    return this.http.put(`${this.apiUrl}/profile/${userId}`, data).pipe(
      catchError(err => {
        console.error('Erreur lors de l\'envoi des données:', err);
        return throwError(() => err);
      })
    );
  }  
}

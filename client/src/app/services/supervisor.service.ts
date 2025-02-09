import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupervisorService {

  private apiUrl = `http://localhost:3000`;

  constructor(private http: HttpClient) { }

  getGroups(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/groups`);
  }

  getNameGroup(idGroup: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/group/${idGroup}`);
  }
  getUsersInFormation(idGroup: number): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/group/${idGroup}/users`).pipe(
      map(response => response.users) // Récupère uniquement le tableau `users`
    );
  }

  getAverageHummer(idGroup: number): Observable<number> {
    return this.http.get<{ average_hummer: number }>(`${this.apiUrl}/group/${idGroup}/avg_hummer`).pipe(
      map(response => response.average_hummer || 0) // Assurer qu'on récupère une valeur numérique
    );
  }
  
  getUserInfo(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${userId}`);
  }

  getLastHummerUpdate(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/lasthistoryHummer/user/${userId}`);
  }

  getHummersHistory(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/historyHummer/user/${userId}`);
  }  

  getLastCall(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/lastAlert/user/${userId}`);
  }

  getCallsHistory(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/lastsAlerts/user/${userId}`);
  }

  getCall(userId: number): Observable<{ call: boolean }> {
    return this.http.get<{ call: boolean }>(`http://localhost:3000/call/${userId}`).pipe(
      tap(response => {
        console.log('Réponse API:', response);
        if (typeof response.call !== 'boolean') {
          response.call = false;
        }
      })
    );
  }

  resetCall(userId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/call/${userId}`, { call: 'f' });
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`);
  }

  addUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  updateUser(id: number, user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile/${id}`, user);
  }

  deleteUser(id: number): Observable<any> {
    console.log("Requête DELETE envoyée à:", `${this.apiUrl}/deleteUser/${id}`);
    return this.http.delete(`${this.apiUrl}/deleteUser/${id}`);
  }

  getGroups(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/groups`);
  }

  addGroup(name: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/createGroup`, { name });
  }

  updateGroup(id: number, name: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateGroup/${id}`, { name });
  }

  deleteGroup(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteGroup/${id}`);
  }
}
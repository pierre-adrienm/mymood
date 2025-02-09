import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getGroups(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/groups`);
  }

  getGroup(groupId: number) {
    return this.http.get(`${this.apiUrl}/group/${groupId}`);
  }

  getUsersInGroup(groupId: number) {
    return this.http.get(`${this.apiUrl}/group/${groupId}/users`);
  }

  addUserToGroup(groupId: number, userName: string) {
    return this.http.post(`${this.apiUrl}/group/${groupId}/registerFormation`, { name: userName });
  }

  removeUserFromGroup(groupId: number, userId: number) {
    return this.http.delete(`${this.apiUrl}/group/${groupId}/user/${userId}`);
  }

  updateGroupName(groupId: number, newName: string) {
    return this.http.put(`${this.apiUrl}/updateGroup/${groupId}`, { name: newName });
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl =`http://localhost:3000`;

  constructor(private http: HttpClient) { }

  getHummer(userId: number):Observable<any>{
    return this.http.get<{ hummer: number }>(`${this.apiUrl}/hummer/${userId}`);
  }

  updateHummer(userId: number, hummer: number):Observable<any>{
    return this.http.put(`${this.apiUrl}/hummer/${userId}`, { hummer });
  }

  callForHelp(userId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/call/${userId}`, { call: true });
  }
}

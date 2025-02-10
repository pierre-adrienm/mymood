import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../services/student.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { SevenSegmentDisplayComponent } from '../seven-segment-display/seven-segment-display.component';

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [
    FormsModule,
    RouterModule,
    SevenSegmentDisplayComponent
  ],
  templateUrl: './student.component.html',
  styleUrl: './student.component.css'
})
export class StudentComponent implements OnInit{

  hummer: number = 50;
  userId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private studentService: StudentService,
    private loginService: LoginService 
  ){}

  ngOnInit() {
    // Récupérer l'ID de l'utilisateur depuis l'URL
    this.userId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.userId) {
      this.studentService.getHummer(this.userId).subscribe(
        response => {
          this.hummer = response.hummer;
          console.log("Humeur récupérée :", this.hummer);
        },
        error => console.error("Erreur lors de la récupération de l'humeur", error)
      );
    } else {
      console.error("ID utilisateur introuvable dans l'URL.");
    }
  }

  updateHummer() {
    if (this.userId) {
      this.studentService.updateHummer(this.userId, this.hummer).subscribe(
        response => console.log("Humeur mise à jour:", response),
        error => console.error("Erreur lors de la mise à jour de l'humeur", error)
      );
    }
  }

  callForHelp() {
    console.log("Appel à l'aide envoyé !");
    
  }

  logout():void{
    this.loginService.logout().subscribe(() => {
      this.router.navigateByUrl('/');
    })
  }
}

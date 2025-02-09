import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-confirmation',
  imports: [],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.css'
})
export class ConfirmationComponent implements OnInit{

  userId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private studentService: StudentService
  ){}

  ngOnInit(){
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
  }

  confirmCall() {
    if (this.userId) {
      this.studentService.callForHelp(this.userId).subscribe(
        response => {
          console.log("Appel confirmé:", response);
          // Rediriger vers la page d'accueil ou autre après confirmation
          // this.router.navigate([`/student/${this.userId}`]);
          this.router.navigate([`/feedback/${this.userId}`]);
        },
        error => console.error("Erreur lors de l'appel à l'aide", error)
      );
    }
  }

  cancelCall() {
    this.router.navigate([`/student/${this.userId}`]);
  }
}

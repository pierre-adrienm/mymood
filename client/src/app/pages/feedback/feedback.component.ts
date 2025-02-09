import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-feedback',
  imports: [],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.css'
})
export class FeedbackComponent {

  userId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ){}

  ngOnInit() {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ok() {
    if (this.userId) {
      this.router.navigate([`/student/${this.userId}`]);
    } else {
      console.error("Erreur : userId est null");
    }
  }
}

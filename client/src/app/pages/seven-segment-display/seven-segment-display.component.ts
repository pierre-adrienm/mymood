import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-seven-segment-display',
  imports: [CommonModule],
  templateUrl: './seven-segment-display.component.html',
  styleUrls: ['./seven-segment-display.component.css']
})
export class SevenSegmentDisplayComponent {
  @Input() value: number = 0;

  // Définition des segments pour chaque chiffre de 0 à 9
  private segments = [
    ['1', '1', '1', '0', '1', '1', '1'],  // 0
    ['0', '0', '1', '0', '0', '1', '0'],  // 1
    ['1', '0', '1', '1', '1', '0', '1'],  // 2
    ['1', '0', '1', '1', '0', '1', '1'],  // 3
    ['0', '1', '1', '1', '0', '1', '0'],  // 4
    ['1', '1', '0', '1', '0', '1', '1'],  // 5
    ['1', '1', '0', '1', '1', '1', '1'],  // 6
    ['1', '0', '1', '0', '0', '1', '0'],  // 7
    ['1', '1', '1', '1', '1', '1', '1'],  // 8
    ['1', '1', '1', '1', '0', '1', '1']   // 9
  ];

  // Définition des segments pour la centaine (allume uniquement un "1" vertical si >= 100)
  private segmentsCentaines = [
    ['0', '0'],  // Moins de 100, éteint
    ['1', '1']   // 100 et plus, allume un "1"
  ];

  /**
   * Retourne les segments pour les unités (dernier chiffre)
   */
  getUnitesSegments(): string[] {
    const unit = this.value % 10;
    return this.segments[unit];
  }

  /**
   * Retourne les segments pour les dizaines (deuxième chiffre en partant de la droite)
   */
  getDizainesSegments(): string[] {
    if (this.value < 10) return ['0', '0', '0', '0', '0', '0', '0']; // Si < 10, affiche segments noirs
    const dizaine = Math.floor((this.value % 100) / 10);
    return this.segments[dizaine];
  }

  /**
   * Retourne les segments pour les centaines (si < 100, affiche segments noirs, sinon affiche un "1")
   */
  getCentainesSegments(): string[] {
    return this.value >= 100 ? this.segmentsCentaines[1] : ['0', '0']; // Affichage toujours présent
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class MapPage implements OnInit {
  // Robot's location on map (percent based)
  robotX = 50;
  robotY = 70;

  // TODO: Later - connect to Firebase or API for real-time tracking
  constructor() { }

  ngOnInit() {
  }

}



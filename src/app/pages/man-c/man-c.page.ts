import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HttpClient,HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-man-c',
  templateUrl: './man-c.page.html',
  styleUrls: ['./man-c.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule]
})
export class ManCPage implements OnInit {

  constructor(private http: HttpClient) {}

  commandHistory: string[] = [];
  showCommandPalette = false;

  ngOnInit() {}

  private sendDirection(dir: string) {
    const payload = { direction: dir };
    this.http.post('http://10.4.1.232:5000/motor', payload).subscribe({
      next: () => console.log(`Sent: ${dir}`),
      error: err => console.error('Motor control failed', err)
    });
  }

  private addHistory(entry: string) {
    this.commandHistory.unshift(entry);
    if (this.commandHistory.length > 6) {
      this.commandHistory.pop();
    }
  }

  toggleCommandPalette() {
    this.showCommandPalette = !this.showCommandPalette;
  }

  selectCommand(event: any) {
    const command = event.detail.value;
    this.addHistory(`Command: ${command}`);
  }

  performAction(action: string) {
    this.addHistory(`Action: ${action}`);
  }

  move(direction: string) {
    this.sendDirection(direction);
    this.addHistory(`Moving: ${direction}`);
  }
}

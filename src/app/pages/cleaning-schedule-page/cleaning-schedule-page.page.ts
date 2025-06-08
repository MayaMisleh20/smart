import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastController, AlertController, IonicModule } from '@ionic/angular';


@Component({
  selector: 'app-cleaning-schedule-page',
  templateUrl: './cleaning-schedule-page.page.html',
  styleUrls: ['./cleaning-schedule-page.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule,IonicModule]
})
export class CleaningSchedulePagePage implements OnInit {

 
  minDateTime: string = '';
  selectedDate: string = '';
  selectedTime: string = '';
  selectedRooms: string[] = [];
  selectedPriority: string = 'normal';
  selectedRecurrence: string = 'once';
  selectedMode: string = 'Standard';
 
  roomOptions: string[] = ['Living Room', 'Kitchen', 'Bedroom', 'Bathroom', 'Hallway', 'Dining Room'];
 
  scheduleList: any[] = [];
  historyList: any[] = [];
 
  smartSuggestion: string | null = 'You usually clean the Kitchen every morning. Want to schedule it?';
  nextCleaningCountdown: string = '';
  private countdownInterval: any;
 
  // 📅 Custom Calendar
  currentDate = new Date();
  currentMonth = this.currentDate.getMonth();
  currentYear = this.currentDate.getFullYear();
  calendarDays: Date[] = [];
 
  monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
 
  // ⏰ Custom Time Selection
  hours = Array.from({ length: 12 }, (_, i) => i + 1);
  minutes = Array.from({ length: 60 }, (_, i) => i); // 0–59
  isPM: boolean = false;
 
  selectedDay = this.currentDate.getDate();
  selectedMonth = this.currentDate.getMonth();
  selectedYear = this.currentDate.getFullYear();
  selectedHour = this.currentDate.getHours() % 12 || 12;
  selectedMinute = 0;
 
  constructor(
    private toastController: ToastController,
    private alertController: AlertController
  ) {}
 
  ngOnInit() {
    this.initializeDateTime();
    this.setCurrentTime(); 
    this.startCountdownTimer();
    this.generateCalendar();
  }
 
  ngOnDestroy() {
    clearInterval(this.countdownInterval);
  }
 
  initializeDateTime() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.minDateTime = today.toISOString().split('.')[0];
  }
 
  // 📅 Calendar Generation
  generateCalendar() {
    this.calendarDays = [];
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
 
    for (let i = 1; i <= lastDay.getDate(); i++) {
      this.calendarDays.push(new Date(this.currentYear, this.currentMonth, i));
    }
  }
  setCurrentTime() {
    const now = new Date();
    this.selectedHour = now.getHours() % 12 || 12;
    this.isPM = now.getHours() >= 12;
    this.selectedMinute = now.getMinutes();
    this.updateDateTime();
  }
  
  prevMonth() {
    this.currentMonth--;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.generateCalendar();
  }
 
  nextMonth() {
    this.currentMonth++;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.generateCalendar();
  }
 
  selectDate(day: Date) {
    this.selectedDay = day.getDate();
    this.selectedMonth = day.getMonth();
    this.selectedYear = day.getFullYear();
    this.updateDateTime();
  }
 
  isToday(day: Date) {
    const today = new Date();
    return day.getDate() === today.getDate() &&
           day.getMonth() === today.getMonth() &&
           day.getFullYear() === today.getFullYear();
  }
 
  isSelectedDate(day: Date) {
    return day.getDate() === this.selectedDay &&
           day.getMonth() === this.selectedMonth &&
           day.getFullYear() === this.selectedYear;
  }
 
  // ⏰ Time Selection Methods
  selectHour(hour: number) {
    this.selectedHour = hour;
    this.updateDateTime();
  }
 
  selectMinute(minute: number) {
    this.selectedMinute = minute;
    this.updateDateTime();
  }
 
  updateDateTime() {
    const month = this.selectedMonth + 1;
    let hour24 = this.selectedHour % 12;
    if (this.isPM) hour24 += 12;
 
    const dateString = `${this.selectedYear}-${month < 10 ? '0' + month : month}-${this.selectedDay < 10 ? '0' + this.selectedDay : this.selectedDay}`;
    this.selectedDate = dateString + 'T00:00:00';
    this.selectedTime = dateString + `T${hour24 < 10 ? '0' + hour24 : hour24}:${this.selectedMinute < 10 ? '0' + this.selectedMinute : this.selectedMinute}:00`;
 
    this.updateCountdown();
  }
 
  // ✅ Add Schedule
  addSchedule() {
    if (!this.selectedDate || !this.selectedTime || this.selectedRooms.length === 0 || !this.selectedPriority || !this.selectedRecurrence) {
      this.showToast('Please fill in all fields.', 'warning');
      return;
    }
 
    const combinedDateTime = `${this.selectedDate.split('T')[0]}T${this.selectedTime.split('T')[1]}`;
 
    this.scheduleList.push({
      dateTime: combinedDateTime,
      rooms: [...this.selectedRooms],
      priority: this.selectedPriority,
      recurrence: this.selectedRecurrence,
      mode: this.selectedMode
    });
 
    this.clearFields();
    this.updateCountdown();
    this.showToast('Schedule added successfully!', 'success');
  }
 
  clearFields() {
    this.initializeDateTime();
    this.selectedRooms = [];
    this.selectedPriority = 'normal';
    this.selectedRecurrence = 'once';
    this.selectedMode = 'Standard';
    this.generateCalendar();
  }
 
  confirmDelete(index: number) {
    this.alertController.create({
      header: 'Delete Schedule?',
      message: 'Are you sure you want to remove this schedule?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Delete', handler: () => this.deleteSchedule(index) }
      ]
    }).then(alert => alert.present());
  }
 
  deleteSchedule(index: number) {
    this.scheduleList.splice(index, 1);
    this.updateCountdown();
    this.showToast('Schedule removed.', 'medium');
  }
 
  startCleaningNow() {
    this.showToast('Cleaning started!', 'success');
    this.historyList.push({
      dateTime: new Date().toISOString(),
      rooms: ['All Rooms']
    });
  }
 
  cleanHighPriority() {
    this.showToast('High priority cleaning started!', 'success');
    this.historyList.push({
      dateTime: new Date().toISOString(),
      rooms: ['High Priority Rooms']
    });
  }
 
  acceptSuggestion() {
    const suggestedDateTime = new Date();
    suggestedDateTime.setHours(9, 0, 0, 0);
    this.scheduleList.push({
      dateTime: suggestedDateTime.toISOString(),
      rooms: ['Kitchen'],
      priority: 'normal',
      recurrence: 'daily',
      mode: 'Standard'
    });
    this.smartSuggestion = null;
    this.updateCountdown();
    this.showToast('Suggestion accepted!', 'success');
  }
 
  showToast(message: string, color: string) {
    this.toastController.create({
      message,
      duration: 2000,
      color
    }).then(toast => toast.present());
  }
 
  updateCountdown() {
    if (!this.scheduleList.length) {
      this.nextCleaningCountdown = '';
      return;
    }
 
    const now = new Date();
    const upcoming = this.scheduleList
      .map(schedule => new Date(schedule.dateTime))
      .filter(date => date > now)
      .sort((a, b) => a.getTime() - b.getTime())[0];
 
    if (upcoming) {
      const diff = upcoming.getTime() - now.getTime();
      this.nextCleaningCountdown = this.formatCountdown(diff);
    } else {
      this.nextCleaningCountdown = '';
    }
  }
 
  formatCountdown(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  }
 
  startCountdownTimer() {
    this.countdownInterval = setInterval(() => {
      this.updateCountdown();
    }, 1000);
  }
 
  formatDate(dateTime: string): string {
    return new Date(dateTime).toLocaleString();
  }
}
 
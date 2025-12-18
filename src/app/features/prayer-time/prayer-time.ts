import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnDestroy, signal } from '@angular/core';
import { PrayerTimeService } from '@core/services/prayer-time.service';
import { CalendarComponent } from '@core/components/calendar/calendar';
import { Spinner } from '@core/components/spinner/spinner';

@Component({
  selector: 'app-prayer-time',
  standalone: true,
  imports: [CommonModule, CalendarComponent, Spinner],
  templateUrl: './prayer-time.html',
  styleUrl: './prayer-time.scss',
})
export class PrayerTime implements OnDestroy {
  private readonly _prayerTimeService = inject(PrayerTimeService);

  public isLoading = this._prayerTimeService.isLoading;
  public prayerTiming = this._prayerTimeService.prayerTiming;
  public today = this.formatDate();

  public nextPrayerName: string = '--';
  public countDownDisplay: string = ''; // Vide par défaut
  public currentPrayerName: string = ''; 

  public intervalId: any;
  public currentDateTarget: Date = new Date();

  public cities = [
    { name: 'Bruxelles', zip: '1000' },
    { name: 'Anvers', zip: '2000' },
    { name: 'Gand', zip: '9000' },
    { name: 'Charleroi', zip: '6000' },
    { name: 'Liège', zip: '4000' },
    { name: 'Bruges', zip: '8000' },
    { name: 'Namur', zip: '5000' },
    { name: 'Louvain', zip: '3000' },
    { name: 'Mons', zip: '7000' },
    { name: 'Hasselt', zip: '3500' }
  ];

  public selectedCity = signal(this.cities[4]); 

  constructor() {
    this.loadPrayerTimes();

    effect(() => {
      const timings = this.prayerTiming();
      if (timings) {
        this.startCountdown();
      }
    });
  }

  ngOnDestroy(): void {
    this.stopInterval();
  }

  public isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  public onDateChangedFromCalendar(newDate: Date): void {
    this.currentDateTarget = newDate;
    this.loadPrayerTimes();
  }

  public onDropdownChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const zip = selectElement.value;
    const city = this.cities.find(c => c.zip === zip);
    
    if (city) {
      this.selectedCity.set(city);
      this.loadPrayerTimes();
    }
  }

  private loadPrayerTimes(): void {
    const city = this.selectedCity();
    this.stopInterval(); 
    this._prayerTimeService.getPrayerTiming(
      this.currentDateTarget,
      `${city.zip} ${city.name}, Belgium`
    );
  }

  private startCountdown(): void {
    this.stopInterval();
    this.updateCountdown();
    this.intervalId = setInterval(() => {
      this.updateCountdown();
    }, 1000);
  }

  private stopInterval(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private updateCountdown(): void {
    const timings = this.prayerTiming();
    if (!timings) return;

    if (!this.isToday(this.currentDateTarget)) {
      this.currentPrayerName = '';
      this.nextPrayerName = '';
      this.countDownDisplay = '';
      return; 
    }

    const now = new Date();
    const list = this.prayersList;
    let nextIdx = -1;

    for (let i = 0; i < list.length; i++) {
      const pDate = this.createDateFromTime(list[i].time ?? '');
      if (pDate > now) {
        nextIdx = i;
        break;
      }
    }

    let targetDate: Date;

    if (nextIdx === -1) {
      this.nextPrayerName = 'Fajr';
      targetDate = this.createDateFromTime(list[0].time ?? '');
      targetDate.setDate(targetDate.getDate() + 1);
    } else {
      this.nextPrayerName = list[nextIdx].label;
      targetDate = this.createDateFromTime(list[nextIdx].time ?? '');
    }

    this.currentPrayerName = this.nextPrayerName;
    this.countDownDisplay = this.formatMsToTime(targetDate.getTime() - now.getTime());
  }

  private createDateFromTime(timeStr: string): Date {
    const d = new Date();
    const [hours, minutes] = timeStr.split(':').map(Number);
    d.setHours(hours, minutes, 0, 0);
    return d;
  }

  private formatMsToTime(ms: number): string {
    if (ms < 0) return '00:00:00';
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor(ms / (1000 * 60 * 60));

    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  public formatDate(): string {
    let date = new Date();
    let str = date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'short' });
    str = str.replace('.', '');
    return str
      .split(' ')
      .map((mot) => mot.charAt(0).toUpperCase() + mot.slice(1))
      .join(' ');
  }

  public get prayersList() {
    const t = this.prayerTiming();
    if (!t) return [];
    return [
      { label: 'Fajr', time: t.fajr },
      { label: 'Dhuhr', time: t.dhuhr },
      { label: 'Asr', time: t.asr },
      { label: 'Maghrib', time: t.maghrib },
      { label: 'Isha', time: t.isha },
    ];
  }

  public returnToday() {
    this.onDateChangedFromCalendar(new Date());
  }
}
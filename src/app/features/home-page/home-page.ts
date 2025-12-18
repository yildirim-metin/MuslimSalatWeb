import { Component, effect, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrayerTimeService } from '@core/services/prayer-time.service';
import { Spinner } from '@core/components/spinner/spinner';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, Spinner],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage implements OnDestroy {
  private readonly _prayerTimeService = inject(PrayerTimeService);

  public isLoading = this._prayerTimeService.isLoading;
  public prayerTiming = this._prayerTimeService.prayerTiming;

  public today = this.formatDate();
  public nextPrayerName: string = '--';
  public countDownDisplay: string = '00:00:00';
  public currentPrayerName: string = ''; 

  private intervalId: any;
  public currentDateTarget: Date = new Date();

  public icons: { [key: string]: string } = {
    'Fajr': 'fa-solid fa-cloud-sun',
    'Dhuhr': 'fa-regular fa-sun',
    'Asr': 'fa-solid fa-cloud-sun',
    'Maghrib': 'fa-solid fa-moon',
    'Isha': 'fa-solid fa-moon'
  };

  constructor() {
    this._prayerTimeService.getPrayerTiming(
      this.currentDateTarget,
      '4000 Liège, Belgium',
    );

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

    return `${hours}h ${minutes}m ${seconds}s`;
  }

  public formatDate(): string {
    const date = new Date();
    let str = date.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
    return str.charAt(0).toUpperCase() + str.slice(1);
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
}
import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { PrayerTiming } from '@core/models/prayer-timing.model';
import { PrayerTimeService } from '@core/services/prayer-time.service';
import { CalendarComponent } from '@core/components/calendar/calendar';


@Component({
  selector: 'app-prayer-time',
  imports: [CommonModule, CalendarComponent],
  templateUrl: './prayer-time.html',
  styleUrl: './prayer-time.scss',
})
export class PrayerTime implements OnInit, OnDestroy {
  private readonly _prayerTimeService = inject(PrayerTimeService);

  public prayerTiming?: PrayerTiming | null;
  public today = this.formatDate();

  public nextPrayerName: string = '--';
  public countDownDisplay: string = '00:00:00';

  public intervalId: any;

  public currentDateTarget: Date = new Date();

  ngOnInit(): void {
    this._prayerTimeService.getPrayerTiming('Rue maubeuge 13, 4100 Seraing');

    this.prayerTiming = this._prayerTimeService.prayerTiming();

    if (this.prayerTiming) {
      this.startCountdown();
    }
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  public onDateChangedFromCalendar(newDate: Date): void {
    this.currentDateTarget = newDate;

    // TODO: Recharger les prières pour la date spécifique !
    // TODO: this._prayerTimeService.getPrayerTimingByDate(newDate); (à implémenter)
  }

  private startCountdown(): void {
    this.updateCountdown();
    this.intervalId = setInterval(() => {
      this.updateCountdown();
    }, 1000);
  }

  private updateCountdown(): void {
    if (!this.prayerTiming) return;

    const now = new Date();
    const times = [
      { name: 'Fajr', time: this.prayerTiming.fajr },
      { name: 'Dhuhr', time: this.prayerTiming.dhuhr },
      { name: 'Asr', time: this.prayerTiming.asr },
      { name: 'Maghrib', time: this.prayerTiming.maghrib },
      { name: 'Isha', time: this.prayerTiming.isha },
    ];

    let nextPrayerObj = null;
    let targetDate = new Date();

    for (const p of times) {
      const pDate = this.createDateFromTime(p.time);
      if (pDate > now) {
        nextPrayerObj = p;
        targetDate = pDate;
        break;
      }
    }

    if (!nextPrayerObj) {
      nextPrayerObj = times[0];
      targetDate = this.createDateFromTime(times[0].time);
      targetDate.setDate(targetDate.getDate() + 1);
    }

    this.nextPrayerName = nextPrayerObj.name;

    const diffMs = targetDate.getTime() - now.getTime();
    this.countDownDisplay = this.formatMsToTime(diffMs);
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
    if (!this.prayerTiming) return [];
    return [
      { label: 'Fajr', time: this.prayerTiming.fajr },
      { label: 'Dhuhr', time: this.prayerTiming.dhuhr },
      { label: 'Asr', time: this.prayerTiming.asr },
      { label: 'Maghrib', time: this.prayerTiming.maghrib },
      { label: 'Isha', time: this.prayerTiming.isha },
    ];
  }
}

import { Component, inject, OnInit } from '@angular/core';
import { PrayerTiming } from '@core/models/prayer-timing.model';
import { PrayerTimeService } from '@core/services/prayer-time.service';

@Component({
  selector: 'app-prayer-time',
  imports: [],
  templateUrl: './prayer-time.html',
  styleUrl: './prayer-time.scss',
})
export class PrayerTime implements OnInit {
  private readonly _prayerTimeService = inject(PrayerTimeService);

  public prayerTiming?: PrayerTiming | null;

  ngOnInit(): void {
    this._prayerTimeService.getPrayerTiming('Rue maubeuge 13, 4100 Seraing');

    this.prayerTiming = this._prayerTimeService.prayerTiming();
  }
}

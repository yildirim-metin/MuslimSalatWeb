import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { PrayerTiming } from '@core/models/prayer-timing.model';
import { environment } from '@env';
import { delay, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PrayerTimeService {
  private readonly _httpClient = inject(HttpClient);

  private _prayerTimings = signal<PrayerTiming | null>(null);
  public prayerTiming = this._prayerTimings.asReadonly();

  public isLoading = signal(false);

  public async getPrayerTiming(date: Date, address: string): Promise<void> {
    this.isLoading.set(true);
    const prayerTimings = await firstValueFrom(
      this._httpClient.get<PrayerTiming>(
        `${environment.apiUrl}PrayerTime?Date=${date.toISOString()}&Address=${address}`,
      ),
    );

    this.isLoading.set(false);

    this._prayerTimings.set(prayerTimings);
  }
}

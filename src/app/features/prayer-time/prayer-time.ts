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
ngOnInit(): void {
  throw new Error('Method not implemented.');
}
nextPrayer(): string {
  // Ensure this method returns a string value representing the next prayer
  return 'Fajr'; // Replace with your actual logic
}
}

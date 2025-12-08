import {
  Component,
  input,
  output,
  signal,
  computed,
  effect,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface CalendarDay {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent {
  public selectedDate = input.required<Date>();

  public dateChange = output<Date>();

  public viewDate = signal<Date>(new Date());

  public calendarDays = signal<CalendarDay[]>([]);

  public weekDays = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];

  public monthYearDisplay = computed(() => {
    return this.viewDate()
      .toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
      .replace(/^\w/, (c) => c.toUpperCase());
  });

  constructor() {
    effect(() => {
      const newDate = this.selectedDate();
      this.viewDate.set(new Date(newDate));
      this.generateCalendar();
    });
  }

  public prevMonth(): void {
    const current = this.viewDate();
    this.viewDate.set(new Date(current.getFullYear(), current.getMonth() - 1, 1));
    this.generateCalendar();
  }

  public nextMonth(): void {
    const current = this.viewDate();
    this.viewDate.set(new Date(current.getFullYear(), current.getMonth() + 1, 1));
    this.generateCalendar();
  }

  public selectDay(day: CalendarDay): void {
    this.dateChange.emit(day.date);
  }

  private generateCalendar(): void {
    const year = this.viewDate().getFullYear();
    const month = this.viewDate().getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    let startDayIndex = firstDayOfMonth.getDay() - 1;
    if (startDayIndex === -1) startDayIndex = 6;

    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - startDayIndex);

    const days: CalendarDay[] = [];

    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);

      const isSelected = currentDate.toDateString() === this.selectedDate().toDateString();
      const isSameMonth = currentDate.getMonth() === month;
      const isToday = currentDate.toDateString() === new Date().toDateString();

      days.push({
        date: currentDate,
        dayNumber: currentDate.getDate(),
        isCurrentMonth: isSameMonth,
        isToday: isToday,
        isSelected: isSelected,
      });
    }
  }
}

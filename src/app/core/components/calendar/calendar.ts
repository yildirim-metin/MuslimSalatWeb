import { Component, EventEmitter, Input, OnInit, Output, signal, computed } from '@angular/core';
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
  styleUrl: './calendar.scss'      
})
export class CalendarComponent implements OnInit {
  
  // Inputs / Outputs
  @Input() set selectedDate(date: Date) {
    this.currentDate.set(new Date(date));
    this.generateCalendar();
  }
  @Output() dateChange = new EventEmitter<Date>();

  
  currentViewDate = signal(new Date()); 
  currentDate = signal(new Date());  
  calendarDays = signal<CalendarDay[]>([]);

  weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  
  monthYearDisplay = computed(() => {
    return this.currentViewDate().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  });

  ngOnInit() {
    this.generateCalendar();
  }

  generateCalendar() {
    const viewDate = this.currentViewDate();
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    
    const firstDayOfMonth = new Date(year, month, 1);
    
    const lastDayOfMonth = new Date(year, month + 1, 0);

    
    let startDayOfWeek = firstDayOfMonth.getDay(); 
    if (startDayOfWeek === 0) startDayOfWeek = 7; 
    
   
    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - (startDayOfWeek - 1));

    const days: CalendarDay[] = [];
    const today = new Date();
    today.setHours(0,0,0,0);

   
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      
      const isCurrentMonth = date.getMonth() === month;
      const isToday = date.getTime() === today.getTime();
      const isSelected = date.toDateString() === this.currentDate().toDateString();

      days.push({
        date: date,
        dayNumber: date.getDate(),
        isCurrentMonth,
        isToday,
        isSelected
      });
    }

    this.calendarDays.set(days);
  }

  prevMonth() {
    const newDate = new Date(this.currentViewDate());
    newDate.setMonth(newDate.getMonth() - 1);
    this.currentViewDate.set(newDate);
    this.generateCalendar();
  }

  nextMonth() {
    const newDate = new Date(this.currentViewDate());
    newDate.setMonth(newDate.getMonth() + 1);
    this.currentViewDate.set(newDate);
    this.generateCalendar();
  }

  selectDay(day: CalendarDay) {
    this.currentDate.set(day.date);
   
    if (!day.isCurrentMonth) {
      this.currentViewDate.set(new Date(day.date));
    }
    this.generateCalendar();
    this.dateChange.emit(day.date);
  }
}
import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Event } from '@core/models/event.model';
import { environment } from '@env';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private readonly _httpClient = inject(HttpClient);

  private _events = signal<Event[]>([]);
  public events = this._events.asReadonly();

  public isLoading = computed<boolean>(() => this._events().length === 0);

  public async getAll(): Promise<void> {
    try {
      const result = await lastValueFrom(
        this._httpClient.get<Event[]>(`${environment.apiUrl}event`),
      );

      this._events.set(result);
    } catch (error) {
      console.error('Erreur lors du chargement des évènements:', error);
      throw error;
    }
  }

  public async add(event: Event): Promise<void> {
    try {
      const createdEvent = await lastValueFrom(
        this._httpClient.post<Event>(`${environment.apiUrl}event`, event),
      );

      this._events.update((events) => [...events, createdEvent]);
    } catch (error) {
      console.error("Erreur lors de la création de l'évènement", error);
      throw error;
    }
  }

  public async update(id: number, event: Event): Promise<void> {
    try {
      await lastValueFrom(this._httpClient.put(`${environment.apiUrl}event/${id}`, event));

      this._events.update((events) => events.map((e) => (e.id === id ? { ...e, ...event } : e)));
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l\'évènement ${id}`, error);
      throw error;
    }
  }

  public async remove(id: number): Promise<void> {
    try {
      await lastValueFrom(this._httpClient.delete(`${environment.apiUrl}event/${id}`));

      this._events.update((events) => events.filter((e) => e.id != id));
    } catch (error) {
      console.error(`Erreur lors de la suppression de l\'évènement ${id}`, error);
      throw error;
    }
  }

  public async subscribe(idUser: number, idEvent: number) {
    try {
      await lastValueFrom(
        this._httpClient.post(`${environment.apiUrl}event/${idUser}/subscribe/${idEvent}`, {}),
      );
    } catch (error) {
      console.error(`Erreur lors de l'inscription à l\'évènement`);
      throw error;
    }
  }
}

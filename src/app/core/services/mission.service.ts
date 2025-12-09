import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Mission } from '@core/models/mission.model';
import { environment } from '@env';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MissionService {
  private readonly _httpClient = inject(HttpClient);

  private _missions = signal<Mission[]>([]);
  public missions = this._missions.asReadonly();

  public async GetAll(): Promise<void> {
    try {
      const result = await lastValueFrom(
        this._httpClient.get<Mission[]>(`${environment.apiUrl}mission`),
      );

      this._missions.set(result);
    } catch (error) {
      console.error('Erreur lors du chargement des missions:', error);
      throw error;
    }
  }

  public async Add(mission: Mission): Promise<void> {
    try {
      const createdMission = await lastValueFrom(
        this._httpClient.post<Mission>(`${environment.apiUrl}mission`, mission),
      );

      this._missions.update((currentMissions) => [...currentMissions, createdMission]);
    } catch (error) {
      console.error('Erreur lors de la création de la mission', error);
      throw error;
    }
  }

  public async Update(id: number, mission: Mission): Promise<void> {
    try {
      await lastValueFrom(this._httpClient.put(`${environment.apiUrl}mission/${id}`, mission));

      this._missions.update((currentMissions) =>
        currentMissions.map((m) => (m.id === id ? { ...m, ...mission } : m)),
      );
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la mission ${id}`, error);
      throw error;
    }
  }

  public async Remove(id: number): Promise<void> {
    try {
      await lastValueFrom(this._httpClient.delete(`${environment.apiUrl}mission/${id}`));

      this._missions.update((currentMissions) => currentMissions.filter((m) => m.id != id));
    } catch (error) {
      console.error(`Erreur lors de la suppression de la mission ${id}`, error);
      throw error;
    }
  }
}

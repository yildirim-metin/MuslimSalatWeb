import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { User } from '@core/models/user.model';
import { environment } from '@env';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly _httpClient = inject(HttpClient);

  private _users = signal<User[]>([]);
  public users = this._users.asReadonly();

  public async GetAll(): Promise<void> {
    try {
      const result = await lastValueFrom(
        this._httpClient.get<User[]>(`${environment.apiUrl}user`),
      );

      console.log(result);
      

      this._users.set(result);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async Add(user: Partial<User>): Promise<void> {
    try {
      const createdUser = await lastValueFrom(
        this._httpClient.post<User>(`${environment.apiUrl}user`, user),
      );

      this._users.update((currentUsers) => [...currentUsers, createdUser]);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async Update(id: number, user: Partial<User>): Promise<void> {
    try {
      await lastValueFrom(
        this._httpClient.put(`${environment.apiUrl}user/${id}`, user)
      );

      this._users.update((currentUsers) =>
        currentUsers.map((u) => (u.id === id ? { ...u, ...user } as User : u)),
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async Remove(id: number): Promise<void> {
    try {
      await lastValueFrom(
        this._httpClient.delete(`${environment.apiUrl}user/${id}`)
      );

      this._users.update((currentUsers) => 
        currentUsers.filter((u) => u.id != id)
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
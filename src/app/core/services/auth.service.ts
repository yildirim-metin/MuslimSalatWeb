import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { UserRole } from '@core/enums/user-role.enum';
import { ApiResponseError } from '@core/models/api-response-error.model';
import { LoginResponse } from '@core/models/login-response.model';
import { CLAIM_ROLE_KEY, TokenPayload } from '@core/models/token.model';
import { UserRegisterForm } from '@core/models/user-register-form.model';
import { environment } from '@env';
import { jwtDecode } from 'jwt-decode';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _httpClient = inject(HttpClient);

  public isConnected = computed(() => !!this.token());

  private _token = signal<string | null>(null);
  public token = this._token.asReadonly();

  private _role = signal<UserRole | null>(null);
  public role = this._role.asReadonly();

  constructor() {
    const tokenStr = localStorage.getItem('token');

    if (tokenStr) {
      this._token.set(tokenStr);
    }

    effect(() => {
      const token = this._token();

      if (token == null) {
        localStorage.removeItem('token');
      } else {
        localStorage.setItem('token', token);
        this.decodeJwtPayload(token);
      }
    });
  }

  private decodeJwtPayload(token: string) {
    const payload = jwtDecode<TokenPayload>(token);

    const rawRole = payload[CLAIM_ROLE_KEY];
    if (!rawRole) {
      this._role.set(null);
      return;
    }

    const matchingRole = Object.values(UserRole).find(
      (enumValue) => enumValue.toLowerCase() === rawRole.toLowerCase(),
    );

    if (matchingRole) {
      this._role.set(matchingRole);
    } else {
      console.warn(`Role inconnu reçu: "${rawRole}". Accès Restreint.`);
      this._role.set(null);
    }
  }

  public async login(email: string, password: string): Promise<void> {
    try {
      const response = await firstValueFrom(
        this._httpClient.post<LoginResponse>(environment.apiUrl + 'auth/login', {
          emailOrUsername: email,
          password,
        }),
      );

      this._token.set(response.token);
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        let apiResponseError: ApiResponseError = error.error;
        throw apiResponseError;
      }
    }
  }

  public register(form: UserRegisterForm): Promise<void> {
    return firstValueFrom(this._httpClient.post<void>(environment.apiUrl + 'auth/register', form));
  }

  public logout() {
    this._token.set(null);
    this._role.set(null);
  }
}

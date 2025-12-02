import { UserRole } from '@core/enums/user-role.enum';

export interface Token {
  userId: number;
  role: UserRole;
  iat: number;
  exp: number;
}

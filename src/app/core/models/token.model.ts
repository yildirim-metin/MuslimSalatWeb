import { JwtPayload } from 'jwt-decode';

export const CLAIM_ROLE_KEY = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
export const CLAIM_SID_KEY = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid';

export interface TokenPayload extends JwtPayload {
  [CLAIM_SID_KEY]: string;
  [CLAIM_ROLE_KEY]: string;
}

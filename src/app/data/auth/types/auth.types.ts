export interface LoginRequest {
  username: string
  password: string
  scopes: string[] | string | undefined
  rememberMe: boolean
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
  scopes?: string
}

type GrantType = 'check_token' | 'refresh_token' | 'revoke'

export interface TokenRequest {
  grant_type?: GrantType
  client_id?: string
  refresh_token?: string
  access_token?: string
  scopes?: string[] | string
  username?: string
}

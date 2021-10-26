export interface TokenResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
  scopes?: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
  scopes?: string
}

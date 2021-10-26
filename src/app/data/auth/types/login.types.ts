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

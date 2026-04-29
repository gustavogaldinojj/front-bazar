export interface User {
  id: number
  email: string
  nome: string
  role?: string
}

export interface LoginRequest {
  email: string
  senha: string
}

export interface LoginResponse {
  token: string
  user: User
}

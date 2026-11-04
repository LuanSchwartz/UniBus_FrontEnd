const TOKEN_KEY = 'unibus_token'

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token)
export const clearToken = () => localStorage.removeItem(TOKEN_KEY)

export const api = async <T>(path: string, options: { method?: string; body?: unknown } = {}) => {
  const token = getToken()
  const res = await fetch(`/api/v1${path}`, {
    method: options.method ?? 'GET',
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  if (res.status === 204) return undefined as T

  const data = await res.json().catch(() => null)

  // Sessão expirada ou revogada: o token dura 1h e não há refresh no back.
  if (res.status === 401 && token) {
    clearToken()
    window.location.href = '/login'
  }
  if (!res.ok) throw new Error(data?.erro ?? 'Não foi possível conectar ao servidor')

  return data as T
}

export const login = async (email: string, senha: string) => {
  const { token } = await api<{ token: string }>('/auth/login', {
    method: 'POST',
    body: { email, senha },
  })
  setToken(token)
}

export const logout = async () => {
  await api('/auth/logout', { method: 'POST' }).catch(() => undefined)
  clearToken()
}

export type Usuario = {
  id: string
  nome: string
  email: string
  telefone: string
  perfil: 'ESTUDANTE' | 'MOTORISTA' | 'OPERADOR'
  dataNascimento: string | null
  estudante: {
    curso: string | null
    cidadeOrigem: { nome: string } | null
    unidadeEnsino: { nome: string; instituicaoEnsino: { nome: string } }
  } | null
}

export const perfilLabel = { ESTUDANTE: 'Estudante', MOTORISTA: 'Motorista', OPERADOR: 'Operador' }

export const getUsuario = () => api<Usuario>('/usuarios/me')

// O back só permite ao próprio usuário alterar nome e telefone; o resto é feito pelo operador.
export const atualizarUsuario = (dados: { nome?: string; telefone?: string }) =>
  api<Usuario>('/usuarios/me', { method: 'PATCH', body: dados })

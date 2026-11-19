const TOKEN_KEY = 'unibus_token'

// Leituras repetidas entre telas ficam guardadas por pouco tempo: cada chamada ao back custa 1–2 s
// e várias telas pedem o mesmo dado. Quem altera um dado limpa a chave correspondente.
const cache = new Map<string, { expira: number; valor: Promise<unknown> }>()

// A última resposta também fica no aparelho, para a primeira tela aparecer na hora ao reabrir o app.
const SALVO = 'unibus_cache:'

export const ultimoValor = <T>(chave: string): T | undefined => {
  try {
    const salvo = localStorage.getItem(SALVO + chave)
    return salvo ? (JSON.parse(salvo) as T) : undefined
  } catch {
    return undefined
  }
}

export const emCache = <T>(chave: string, buscar: () => Promise<T>, ms = 60_000): Promise<T> => {
  const guardado = cache.get(chave)
  if (guardado && guardado.expira > Date.now()) return guardado.valor as Promise<T>
  const valor = buscar()
  cache.set(chave, { expira: Date.now() + ms, valor })
  valor.then(
    dado => {
      try {
        localStorage.setItem(SALVO + chave, JSON.stringify(dado))
      } catch {
        // Sem espaço ou armazenamento bloqueado: segue só com a memória.
      }
    },
    // Falha não fica guardada: a próxima tela tenta de novo.
    () => cache.delete(chave),
  )
  return valor
}

export const limparCache = (...chaves: string[]) => {
  const todas = chaves.length === 0
  if (todas) cache.clear()
  chaves.forEach(chave => cache.delete(chave))
  try {
    Object.keys(localStorage)
      .filter(item => item.startsWith(SALVO) && (todas || chaves.includes(item.slice(SALVO.length))))
      .forEach(item => localStorage.removeItem(item))
  } catch {
    // Armazenamento indisponível: não há nada salvo para apagar.
  }
}

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (token: string) => {
  limparCache()
  localStorage.setItem(TOKEN_KEY, token)
}
export const clearToken = () => {
  limparCache()
  localStorage.removeItem(TOKEN_KEY)
}

export const api = async <T>(path: string, options: { method?: string; body?: unknown } = {}) => {
  const token = getToken()
  // FormData (envio de arquivo) vai como multipart; o navegador define o Content-Type.
  const multipart = options.body instanceof FormData
  const res = await fetch(`/api/v1${path}`, {
    method: options.method ?? 'GET',
    headers: {
      ...(options.body && !multipart ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: multipart ? (options.body as FormData) : options.body ? JSON.stringify(options.body) : undefined,
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
  fotoUrl: string | null
  estudante: {
    curso: string | null
    cidadeOrigem: { nome: string } | null
    unidadeEnsino: { nome: string; instituicaoEnsino: { nome: string } }
  } | null
}

export const perfilLabel = { ESTUDANTE: 'Estudante', MOTORISTA: 'Motorista', OPERADOR: 'Operador' }

export const getUsuario = () => emCache('usuario', () => api<Usuario>('/usuarios/me'))

// O back só permite ao próprio usuário alterar nome e telefone; o resto é feito pelo operador.
export const atualizarUsuario = async (dados: { nome?: string; telefone?: string }) => {
  const usuario = await api<Usuario>('/usuarios/me', { method: 'PATCH', body: dados })
  limparCache('usuario')
  return usuario
}

// A foto é privada: a rota exige o token, então não dá para usar a URL direto num <img>.
export const getFotoPerfil = async () => {
  const res = await fetch('/api/v1/usuarios/me/foto', { headers: { Authorization: `Bearer ${getToken()}` } })
  return res.ok ? URL.createObjectURL(await res.blob()) : null
}

export const FOTO_MAX_BYTES = 5 * 1024 * 1024

export const enviarFotoPerfil = (arquivo: File) => {
  const form = new FormData()
  form.set('foto', arquivo)
  return api<{ fotoUrl: string | null }>('/usuarios/me/foto', { method: 'PUT', body: form }).finally(() =>
    limparCache('usuario'),
  )
}

export const removerFotoPerfil = () =>
  api<{ fotoUrl: string | null }>('/usuarios/me/foto', { method: 'DELETE' }).finally(() => limparCache('usuario'))

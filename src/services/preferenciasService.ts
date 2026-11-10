import { api } from './api'

export type PreferenciasNotificacao = {
  ativadas: boolean
  confirmacoes: boolean
  alteracoesRota: boolean
  cancelamentos: boolean
  lembretes: boolean
  avisosOperador: boolean
  novidades: boolean
}

export const getPreferenciasNotificacao = () =>
  api<PreferenciasNotificacao>('/notificacoes/preferencias')

export const atualizarPreferenciasNotificacao = (dados: Partial<PreferenciasNotificacao>) =>
  api<PreferenciasNotificacao>('/notificacoes/preferencias', { method: 'PATCH', body: dados })

export type Turno = 'MANHA' | 'TARDE' | 'NOITE'

type Opcao = { id: string; nome: string }

export type OpcoesPreferencias = { rotas: Opcao[]; cidades: Opcao[] }

export type Preferencias = { rotaIds: string[]; cidadeIds: string[]; turnos: Turno[]; rotas: Opcao[] }

export const getOpcoesPreferencias = () => api<OpcoesPreferencias>('/preferencias/opcoes')

export const getPreferencias = () => api<Preferencias>('/preferencias/me')

export const atualizarPreferencias = (dados: Partial<Omit<Preferencias, 'rotas'>>) =>
  api<Preferencias>('/preferencias/me', { method: 'PATCH', body: dados })

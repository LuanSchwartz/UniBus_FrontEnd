import type { NoticesCardProps } from '@/components/noticesCard/NoticesCard'

import { api } from './api'

type AvisoApi = {
  id: string
  titulo: string
  mensagem: string
  categoria: 'GERAL' | 'VIAGENS'
  importante: boolean
  publicadoEm: string
}

export type Aviso = NoticesCardProps & {
  id: string
  importante: boolean
  viagem: boolean
}

const timeZone = 'America/Sao_Paulo'

// shortcut: traz só os 100 mais recentes, paginar quando a tela precisar de histórico.
export const listarAvisos = async (limite = 100): Promise<Aviso[]> => {
  const { dados } = await api<{ dados: AvisoApi[] }>(`/avisos?limite=${limite}`)

  return dados.map(aviso => ({
    id: aviso.id,
    status: aviso.importante ? 'danger' : aviso.categoria === 'VIAGENS' ? 'warning' : 'safe',
    importante: aviso.importante,
    viagem: aviso.categoria === 'VIAGENS',
    mensageTitle: aviso.titulo,
    date: new Date(aviso.publicadoEm).toLocaleDateString('pt-BR', { timeZone }),
    hours: new Date(aviso.publicadoEm).toLocaleTimeString('pt-BR', {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
    }),
    mensageDescription: aviso.mensagem,
  }))
}

import { api, getUsuario } from './api'

type Parada = { id: string; nome: string; cidade: string; ordem: number }

type Participacao = {
  id: string
  trechoId: string
  status: 'EM_ESPERA' | 'CONFIRMADA' | 'CANCELADA' | 'EXPIRADA'
}

type Trecho = {
  id: string
  status: string
  saidaPrevistaEm: string
  limiteConfirmacaoEm: string
  capacidade: number | null
  capacidadeExtra: number | null
  inscricoesSuspensas?: boolean
  viagem: { nomeRota: string }
  paradas: Parada[]
  _count: { participacoes: number }
  minhaParticipacao?: Participacao | null
}

export type Viagem = {
  id: string
  status: 'confirmed' | 'pending' | 'canceled'
  proxima: boolean
  origin: string
  destination: string
  date: string
  time: string
  occupiedSeats: number
  totalSeats: number
  boarding: string
  arrival: string
  description: string
  origemId: string
  destinoId: string
  participacaoId?: string
  ativa: boolean
  emEspera: boolean
  podeConfirmar: boolean
}

const timeZone = 'America/Sao_Paulo'
const LIMITE = 100

// A API devolve arrays sem total e a listagem começa pelas viagens mais antigas.
const todasPaginas = async <T>(path: string) => {
  const itens: T[] = []
  for (let pagina = 1; ; pagina++) {
    const dados = await api<T[]>(`${path}?pagina=${pagina}&limite=${LIMITE}`)
    itens.push(...dados)
    if (dados.length < LIMITE) return itens
  }
}

const formatarData = (data: Date) => {
  const dia = data.toLocaleDateString('pt-BR', { timeZone, day: 'numeric', month: 'long' })
  const semana = data.toLocaleDateString('pt-BR', { timeZone, weekday: 'short' }).replace('.', '')
  return `${dia} (${semana[0].toUpperCase()}${semana.slice(1)})`
}

const paraViagem = (trecho: Trecho, participacao?: Participacao | null): Viagem => {
  const saida = new Date(trecho.saidaPrevistaEm)
  const agora = new Date()
  const origem = trecho.paradas[0]
  const destino = trecho.paradas[trecho.paradas.length - 1]
  const cancelada = trecho.status === 'CANCELADO' || participacao?.status === 'CANCELADA'
  const confirmada = participacao?.status === 'CONFIRMADA'
  const emEspera = participacao?.status === 'EM_ESPERA'

  return {
    id: trecho.id,
    status: confirmada && trecho.status !== 'CANCELADO' ? 'confirmed' : cancelada ? 'canceled' : 'pending',
    proxima: saida > agora && trecho.status !== 'CANCELADO' && trecho.status !== 'CONCLUIDO',
    origin: origem?.cidade ?? '',
    destination: destino?.cidade ?? '',
    date: formatarData(saida),
    time: saida.toLocaleTimeString('pt-BR', { timeZone, hour: '2-digit', minute: '2-digit' }),
    occupiedSeats: trecho._count.participacoes,
    totalSeats: (trecho.capacidade ?? 0) + (trecho.capacidadeExtra ?? 0),
    boarding: origem?.nome ?? '',
    arrival: destino?.nome ?? '',
    description: `Viagem da rota ${trecho.viagem.nomeRota}.`,
    origemId: origem?.id ?? '',
    destinoId: destino?.id ?? '',
    participacaoId: participacao?.id,
    ativa: trecho.status !== 'CANCELADO' && (confirmada || emEspera),
    emEspera,
    podeConfirmar:
      trecho.status === 'ABERTO' &&
      !trecho.inscricoesSuspensas &&
      agora <= new Date(trecho.limiteConfirmacaoEm),
  }
}

export const listarViagens = async () => {
  const [trechos, usuario] = await Promise.all([
    todasPaginas<Trecho>('/operacao/trechos'),
    getUsuario(),
  ])
  // A rota de participações é restrita a estudantes e responde 403 para os demais perfis.
  const participacoes =
    usuario.perfil === 'ESTUDANTE' ? await todasPaginas<Participacao>('/operacao/participacoes/minhas') : []

  return trechos.map(trecho =>
    paraViagem(
      trecho,
      participacoes.find(participacao => participacao.trechoId === trecho.id),
    ),
  )
}

export const obterViagem = async (id: string) => {
  const trecho = await api<Trecho>(`/operacao/trechos/${id}`)
  return paraViagem(trecho, trecho.minhaParticipacao)
}

// Confirmar cobra a tarifa na carteira; cancelar dentro do prazo estorna. Sem saldo, entra em espera.
// shortcut: inscreve da primeira à última parada, criar seleção de pontos quando houver paradas intermediárias.
export const alternarPresenca = async (viagem: Viagem) => {
  if (viagem.ativa && viagem.participacaoId) {
    await api(`/operacao/participacoes/${viagem.participacaoId}/cancelar`, { method: 'POST' })
  } else {
    await api(`/operacao/trechos/${viagem.id}/inscricoes`, {
      method: 'POST',
      body: { origemId: viagem.origemId, destinoId: viagem.destinoId },
    })
  }
  return obterViagem(viagem.id)
}

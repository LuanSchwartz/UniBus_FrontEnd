import { api, emCache, getUsuario, limparCache } from './api'
import type { Sentido } from '@/components/sentidoTag/SentidoTag'

import type { Preferencias, Turno } from './preferenciasService'

type Parada = { id: string; nome: string; cidade: string; ordem: number; endereco?: string | null; referencia?: string | null }

type Veiculo = { identificacao: string; placa: string; tipo: 'ONIBUS' | 'VAN' }

type Participacao = {
  id: string
  trechoId: string
  status: 'EM_ESPERA' | 'CONFIRMADA' | 'CANCELADA' | 'EXPIRADA'
}

type Trecho = {
  id: string
  status: string
  sentido: Sentido
  saidaPrevistaEm: string
  chegadaPrevistaEm: string
  limiteConfirmacaoEm: string
  limiteCancelamentoEm: string
  inscricoesSuspensas?: boolean
  capacidade: number | null
  capacidadeExtra: number | null
  viagem: { nomeRota: string; turno: Turno }
  paradas: Parada[]
  _count: { participacoes: number }
  minhaParticipacao?: Participacao | null
  // Só no detalhe do trecho.
  tarifa?: string
  motorista?: { usuario: { nome: string } } | null
  motoristaExtra?: { usuario: { nome: string } } | null
  veiculo?: Veiculo | null
  veiculoExtra?: Veiculo | null
}

export type Viagem = {
  id: string
  status: 'confirmed' | 'pending' | 'canceled' | 'completed'
  proxima: boolean
  origin: string
  destination: string
  date: string
  // Dia da saída no fuso de Pedro Osório, no formato AAAA-MM-DD.
  dia: string
  turno: Turno
  rota: string
  sentido: Sentido
  time: string
  arrivalTime: string
  // Horário-limite para confirmar presença (1 h antes da saída).
  limite: string
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
  // Motivo para o botão de presença ficar desabilitado; null quando a ação ainda é permitida.
  bloqueio: string | null
}

const timeZone = 'America/Sao_Paulo'

export const diaLocal = (data: Date) => data.toLocaleDateString('en-CA', { timeZone })
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

const hora = (iso: string) =>
  new Date(iso).toLocaleTimeString('pt-BR', { timeZone, hour: '2-digit', minute: '2-digit' })

// Espelha as regras do back: confirmar até 1 h antes com o trecho aberto; cancelar até o mesmo limite
// (quem está na fila de espera pode sair até a saída).
const motivoBloqueio = (trecho: Trecho, ativa: boolean, emEspera: boolean, agora: Date) => {
  if (trecho.status === 'CANCELADO') return 'Viagem cancelada'
  if (trecho.status === 'CONCLUIDO') return 'Viagem concluída'
  if (trecho.status === 'EM_ANDAMENTO') return 'Viagem em andamento'
  if (ativa) {
    const limite = emEspera ? trecho.saidaPrevistaEm : trecho.limiteCancelamentoEm
    return agora > new Date(limite) || (!emEspera && trecho.inscricoesSuspensas)
      ? `Cancelamento encerrado às ${hora(limite)}`
      : null
  }
  return trecho.status !== 'ABERTO' || trecho.inscricoesSuspensas || agora > new Date(trecho.limiteConfirmacaoEm)
    ? `Confirmações encerradas às ${hora(trecho.limiteConfirmacaoEm)}`
    : null
}

const paraViagem = (trecho: Trecho, participacao?: Participacao | null): Viagem => {
  const saida = new Date(trecho.saidaPrevistaEm)
  const agora = new Date()
  const origem = trecho.paradas[0]
  const destino = trecho.paradas[trecho.paradas.length - 1]
  // Só a operação cancela a viagem; presença cancelada pelo estudante volta a "pendente" e pode ser reconfirmada.
  const cancelada = trecho.status === 'CANCELADO'
  const confirmada = participacao?.status === 'CONFIRMADA'
  const emEspera = participacao?.status === 'EM_ESPERA'

  return {
    id: trecho.id,
    status: cancelada
      ? 'canceled'
      : trecho.status === 'CONCLUIDO'
        ? 'completed'
        : confirmada
          ? 'confirmed'
          : 'pending',
    proxima: saida > agora && trecho.status !== 'CANCELADO' && trecho.status !== 'CONCLUIDO',
    origin: origem?.cidade ?? '',
    destination: destino?.cidade ?? '',
    date: formatarData(saida),
    dia: diaLocal(saida),
    turno: trecho.viagem.turno,
    rota: trecho.viagem.nomeRota,
    sentido: trecho.sentido,
    time: saida.toLocaleTimeString('pt-BR', { timeZone, hour: '2-digit', minute: '2-digit' }),
    limite: hora(trecho.limiteConfirmacaoEm),
    arrivalTime: new Date(trecho.chegadaPrevistaEm).toLocaleTimeString('pt-BR', { timeZone, hour: '2-digit', minute: '2-digit' }),
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
    bloqueio: motivoBloqueio(trecho, confirmada || emEspera, emEspera, agora),
  }
}

// Lista vazia de turnos ou rotas nas preferências quer dizer "qualquer um".
export const combinaComPreferencias = (viagem: Viagem, preferencias: Preferencias | null) => {
  const turnos = preferencias?.turnos ?? []
  const rotas = (preferencias?.rotas ?? []).map(rota => rota.nome)
  return (
    (turnos.length === 0 || turnos.includes(viagem.turno)) &&
    (rotas.length === 0 || rotas.includes(viagem.rota))
  )
}

export const listarViagens = () => emCache('viagens', buscarViagens)

const buscarViagens = async () => {
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

export type DetalheViagem = Viagem & {
  dataCompleta: string
  duracao: string
  tarifa: string
  cancelamentoAte: string
  paradas: Parada[]
  transporte: { veiculo: Veiculo; motorista: string | null; extra: boolean }[]
}

const duracao = (inicio: string, fim: string) => {
  const minutos = Math.round((new Date(fim).getTime() - new Date(inicio).getTime()) / 60000)
  const horas = Math.floor(minutos / 60)
  return [horas && `${horas} h`, minutos % 60 && `${minutos % 60} min`].filter(Boolean).join(' ') || '0 min'
}

export const obterViagem = async (id: string): Promise<DetalheViagem> => {
  const trecho = await api<Trecho>(`/operacao/trechos/${id}`)
  const saida = new Date(trecho.saidaPrevistaEm)
  const dataCompleta = saida.toLocaleDateString('pt-BR', { timeZone, weekday: 'long', day: 'numeric', month: 'long' })
  return {
    ...paraViagem(trecho, trecho.minhaParticipacao),
    dataCompleta: dataCompleta[0].toUpperCase() + dataCompleta.slice(1),
    duracao: duracao(trecho.saidaPrevistaEm, trecho.chegadaPrevistaEm),
    tarifa: trecho.tarifa ?? '2.00',
    cancelamentoAte: hora(trecho.limiteCancelamentoEm),
    paradas: trecho.paradas,
    transporte: [
      trecho.veiculo && { veiculo: trecho.veiculo, motorista: trecho.motorista?.usuario.nome ?? null, extra: false },
      trecho.veiculoExtra && { veiculo: trecho.veiculoExtra, motorista: trecho.motoristaExtra?.usuario.nome ?? null, extra: true },
    ].filter(item => item !== null && item !== undefined),
  }
}

// Confirmar cobra a tarifa na carteira; cancelar dentro do prazo estorna. Sem saldo, entra em espera.
// shortcut: inscreve da primeira à última parada, criar seleção de pontos quando houver paradas intermediárias.
export const alternarPresenca = async <T extends Viagem>(viagem: T): Promise<T> => {
  const participacao =
    viagem.ativa && viagem.participacaoId
      ? await api<Participacao>(`/operacao/participacoes/${viagem.participacaoId}/cancelar`, { method: 'POST' })
      : await api<Participacao>(`/operacao/trechos/${viagem.id}/inscricoes`, {
          method: 'POST',
          body: { origemId: viagem.origemId, destinoId: viagem.destinoId },
        })
  // Confirmar ou cancelar muda a lista de viagens e o saldo da carteira.
  limparCache('viagens', 'carteira')

  // O back já devolve a participação atualizada: monta a viagem com ela em vez de buscar tudo de novo
  // (cada chamada custa 1–2 s). A contagem de vagas é ajustada aqui e se acerta na próxima busca.
  const confirmada = participacao.status === 'CONFIRMADA'
  const emEspera = participacao.status === 'EM_ESPERA'
  const estavaConfirmada = viagem.status === 'confirmed'
  return {
    ...viagem,
    participacaoId: participacao.id,
    ativa: confirmada || emEspera,
    emEspera,
    status: confirmada ? 'confirmed' : 'pending',
    occupiedSeats: Math.max(viagem.occupiedSeats + Number(confirmada) - Number(estavaConfirmada), 0),
  }
}

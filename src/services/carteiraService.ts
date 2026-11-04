import { api } from './api'

export type Carteira = { id: string; saldo: string; limiteCredito: string }

type Movimentacao = {
  id: string
  tipo: 'RECARGA' | 'COBRANCA_CONFIRMACAO' | 'ESTORNO'
  valor: string
  criadoEm: string
  recargaId: string | null
  participacao: { trecho: { sentido: 'IDA' | 'VOLTA' } } | null
}

export type Recarga = {
  id: string
  valor: string
  formaPagamento: 'PIX' | 'DINHEIRO'
  status: 'PENDENTE' | 'APROVADA' | 'REJEITADA' | 'CANCELADA'
  criadoEm: string
  analisadaEm: string | null
  observacaoAnalise: string | null
}

export type Transacao = {
  id: string
  titulo: string
  valor: number
  criadoEm: string
  tipo: 'entrada' | 'saida' | 'pendente' | 'recusada'
  // Depósitos levam ao comprovante (/deposito_realizado?id=...).
  recargaId?: string
}

const timeZone = 'America/Sao_Paulo'

// O back serializa dinheiro como texto com duas casas ("10.50").
export const formatarMoeda = (valor: number | string) =>
  Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export const formatarData = (iso: string) =>
  new Date(iso).toLocaleDateString('pt-BR', { timeZone, day: 'numeric', month: 'short', year: 'numeric' })

export const formatarHora = (iso: string) =>
  new Date(iso).toLocaleTimeString('pt-BR', { timeZone, hour: '2-digit', minute: '2-digit' })

export const getCarteira = () => api<Carteira>('/carteira')

export const listarRecargas = async () =>
  (await api<{ dados: Recarga[] }>('/carteira/recargas?ordem=desc&limite=20')).dados

const tituloMovimentacao = (mov: Movimentacao) => {
  if (mov.tipo === 'RECARGA') return 'Depósito'
  if (mov.tipo === 'COBRANCA_CONFIRMACAO') {
    return mov.participacao ? `Passagem (${mov.participacao.trecho.sentido === 'IDA' ? 'ida' : 'volta'})` : 'Passagem'
  }
  return Number(mov.valor) > 0 ? 'Estorno de passagem' : 'Estorno de depósito'
}

// shortcut: mostra só as 20 movimentações e recargas mais recentes, paginar quando houver "ver mais".
export const listarTransacoes = async (): Promise<Transacao[]> => {
  const [{ dados: extrato }, recargas] = await Promise.all([
    api<{ dados: Movimentacao[] }>('/carteira/extrato?limite=20'),
    listarRecargas(),
  ])

  // Recargas aprovadas já aparecem no extrato; aqui entram só as que ainda não mexeram no saldo.
  const pedidos: Transacao[] = recargas
    .filter(recarga => recarga.status === 'PENDENTE' || recarga.status === 'REJEITADA')
    .map(recarga => ({
      id: recarga.id,
      titulo: recarga.status === 'PENDENTE' ? 'Aguardando confirmação' : 'Depósito recusado',
      valor: Number(recarga.valor),
      criadoEm: recarga.criadoEm,
      tipo: recarga.status === 'PENDENTE' ? 'pendente' : 'recusada',
      recargaId: recarga.id,
    }))

  const movimentacoes: Transacao[] = extrato.map(mov => ({
    id: mov.id,
    titulo: tituloMovimentacao(mov),
    valor: Math.abs(Number(mov.valor)),
    criadoEm: mov.criadoEm,
    tipo: Number(mov.valor) >= 0 ? 'entrada' : 'saida',
    recargaId: mov.tipo === 'RECARGA' ? (mov.recargaId ?? undefined) : undefined,
  }))

  return [...pedidos, ...movimentacoes].sort((a, b) => b.criadoEm.localeCompare(a.criadoEm))
}

// A chave de idempotência evita pedido duplicado se o estudante tocar duas vezes ou repetir após erro de rede.
export const solicitarRecarga = (valor: string, chaveIdempotencia: string) =>
  api<Recarga>('/carteira/recargas', { method: 'POST', body: { valor, chaveIdempotencia } })

// Aceita "10", "10,5" ou "10.50"; devolve o texto que o back espera ("10.50") ou null se inválido.
export const normalizarValor = (texto: string) => {
  const valor = texto.trim().replace(',', '.')
  if (!/^(0|[1-9]\d{0,7})(\.\d{1,2})?$/.test(valor)) return null
  return Number(valor).toFixed(2)
}

export const RECARGA_MINIMA = 2

// Chave de exemplo: example.com não recebe e-mail, então não pode ser cadastrada como chave Pix real.
// Defina NEXT_PUBLIC_PIX_CHAVE com a chave da secretaria para receber pagamentos de verdade.
export const PIX_CHAVE = process.env.NEXT_PUBLIC_PIX_CHAVE ?? 'financeiro@example.com'
const PIX_NOME = 'UNIBUS'
const PIX_CIDADE = 'PEDRO OSORIO'

const campo = (id: string, valor: string) => `${id}${valor.length.toString().padStart(2, '0')}${valor}`

// CRC16-CCITT (polinômio 0x1021, início 0xFFFF), exigido no campo 63 do BR Code.
const crc16 = (texto: string) => {
  let crc = 0xffff
  for (const char of texto) {
    crc ^= char.charCodeAt(0) << 8
    for (let bit = 0; bit < 8; bit++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1
      crc &= 0xffff
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0')
}

// Monta o "Pix copia e cola" (BR Code estático do Banco Central) que também vira o QR code.
export const pixCopiaECola = (valor: string, chave = PIX_CHAVE, nome = PIX_NOME, cidade = PIX_CIDADE) => {
  const payload =
    campo('00', '01') +
    campo('26', campo('00', 'br.gov.bcb.pix') + campo('01', chave)) +
    campo('52', '0000') +
    campo('53', '986') +
    (valor ? campo('54', valor) : '') +
    campo('58', 'BR') +
    campo('59', nome.slice(0, 25)) +
    campo('60', cidade.slice(0, 15)) +
    campo('62', campo('05', '***')) +
    '6304'
  return payload + crc16(payload)
}

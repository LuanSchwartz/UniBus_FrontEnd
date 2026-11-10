import { Flex, Text } from '@nexpy/design-system'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import MyTripsCard from '@/components/myTripsCard/MyTripsCard'
import { type Preferencias, type Turno, getPreferencias } from '@/services/preferenciasService'
import { type Viagem, combinaComPreferencias, diaLocal, listarViagens } from '@/services/viagensService'

import iconCalendar from '../../../icons/iconcalendar.svg'

type FiltroViagens = 'proximas' | 'todas' | 'canceladas'

const filtros: [FiltroViagens, string][] = [
  ['proximas', 'Próximas'],
  ['todas', 'Todas'],
  ['canceladas', 'Canceladas'],
]

// Datas como AAAA-MM-DD; o meio-dia em UTC evita que a conta de dias mude de data pelo fuso.
const paraData = (dia: string) => new Date(`${dia}T12:00:00Z`)

const somarDias = (dia: string, dias: number) => {
  const data = paraData(dia)
  data.setUTCDate(data.getUTCDate() + dias)
  return data.toISOString().slice(0, 10)
}

// Semana de segunda a domingo que contém o dia.
const semanaDe = (dia: string) => {
  const segunda = somarDias(dia, -((paraData(dia).getUTCDay() + 6) % 7))
  return Array.from({ length: 7 }, (_, indice) => somarDias(segunda, indice))
}

const formatar = (dia: string, opcoes: Intl.DateTimeFormatOptions) =>
  paraData(dia).toLocaleDateString('pt-BR', { timeZone: 'UTC', ...opcoes })

const nomeTurno: Record<Turno, string> = { MANHA: 'Manhã', TARDE: 'Tarde', NOITE: 'Noite' }

const maiuscula = (texto: string) => texto[0].toUpperCase() + texto.slice(1)

const filtrar = (viagem: Viagem, filtro: FiltroViagens) => {
  if (filtro === 'todas') return true
  if (filtro === 'canceladas') return viagem.status === 'canceled'
  return viagem.proxima && viagem.status !== 'canceled'
}

const botaoRedondo = {
  alignItems: 'center',
  background: '#F1F5F9',
  border: 'none',
  borderRadius: '50%',
  color: '#132A4D',
  cursor: 'pointer',
  display: 'flex',
  fontSize: '2rem',
  height: '3.2rem',
  justifyContent: 'center',
  lineHeight: 1,
  width: '3.2rem',
} as const

const Viagens = () => {
  const [filtro, setFiltro] = useState<FiltroViagens>('proximas')
  const [viagens, setViagens] = useState<Viagem[] | null>(null)
  const [erro, setErro] = useState('')
  const hoje = diaLocal(new Date())
  const [diaSelecionado, setDiaSelecionado] = useState(hoje)
  const [preferencias, setPreferencias] = useState<Preferencias | null>(null)
  const [mostrarTodas, setMostrarTodas] = useState(false)
  const router = useRouter()

  useEffect(() => {
    listarViagens()
      .then(setViagens)
      .catch(error => setErro(error.message))
    // Sem preferências (ou se falhar), a lista simplesmente não é filtrada.
    getPreferencias().then(setPreferencias).catch(() => undefined)
  }, [])

  const turnosPreferidos = preferencias?.turnos ?? []
  const rotasPreferidas = (preferencias?.rotas ?? []).map(rota => rota.nome)
  const temPreferencias = turnosPreferidos.length > 0 || rotasPreferidas.length > 0
  const usarPreferencias = temPreferencias && !mostrarTodas

  const viagensDoFiltro = (viagens ?? []).filter(
    viagem => filtrar(viagem, filtro) && (!usarPreferencias || combinaComPreferencias(viagem, preferencias)),
  )
  const viagensDoDia = viagensDoFiltro.filter(viagem => viagem.dia === diaSelecionado)
  const semana = semanaDe(diaSelecionado)
  const mesSelecionado = diaSelecionado.slice(0, 7)

  return (
    <Flex direction='column' bg='grey200' minHeight='100vh' pb='8rem'>
      <Flex bg='systemWhite' direction='column' pt='3.5rem'>
        <Text fontSize='3.4rem' fontWeight='bold' px='3.5rem' pb='1.5rem'>
          Minhas viagens
        </Text>

        <Flex justifyContent='space-around'>
          {filtros.map(([valor, rotulo]) => (
            <button
              key={valor}
              type='button'
              aria-pressed={filtro === valor}
              style={{
                backgroundColor: 'transparent',
                color: filtro === valor ? '#2F5FD8' : '#64748B',
                border: 'none',
                borderBottom: `2px solid ${filtro === valor ? '#2F5FD8' : 'transparent'}`,
                boxShadow: 'none',
                fontWeight: 'bold',
                padding: '1rem 4rem',
                cursor: 'pointer',
              }}
              onClick={() => setFiltro(valor)}
            >
              {rotulo}
            </button>
          ))}
        </Flex>

        <Flex direction='column' gap='1.2rem' p='1.6rem 1.6rem 1.2rem'>
          <Flex alignItems='center' justifyContent='space-between' gap='0.8rem'>
            {/* O input de data fica invisível por cima do botão: tocar no mês abre o calendário do aparelho. */}
            <label
              style={{
                alignItems: 'center',
                cursor: 'pointer',
                display: 'flex',
                gap: '0.8rem',
                position: 'relative',
              }}
            >
              <Image src={iconCalendar} alt='' width={18} height={18} />
              <Text color='prussianBlue' fontSize='1.8rem' fontWeight='bold'>
                {maiuscula(formatar(diaSelecionado, { month: 'long', year: 'numeric' }))}
              </Text>
              <Text color='blueSlate' fontSize='1.2rem'>
                ▼
              </Text>
              <input
                type='date'
                aria-label='Escolher data no calendário'
                value={diaSelecionado}
                onChange={evento => evento.target.value && setDiaSelecionado(evento.target.value)}
                style={{ cursor: 'pointer', inset: 0, opacity: 0, position: 'absolute', width: '100%' }}
              />
            </label>

            <Flex alignItems='center' gap='0.6rem'>
              {diaSelecionado !== hoje && (
                <button
                  type='button'
                  onClick={() => setDiaSelecionado(hoje)}
                  style={{
                    background: '#E7F0FF',
                    border: 'none',
                    borderRadius: '2rem',
                    color: '#2F5FD8',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    padding: '0.6rem 1.2rem',
                  }}
                >
                  Hoje
                </button>
              )}
              <button
                type='button'
                aria-label='Semana anterior'
                onClick={() => setDiaSelecionado(dia => somarDias(dia, -7))}
                style={botaoRedondo}
              >
                ‹
              </button>
              <button
                type='button'
                aria-label='Próxima semana'
                onClick={() => setDiaSelecionado(dia => somarDias(dia, 7))}
                style={botaoRedondo}
              >
                ›
              </button>
            </Flex>
          </Flex>

          <Flex justifyContent='space-between' gap='0.4rem'>
            {semana.map(dia => {
              const selecionado = dia === diaSelecionado
              const ehHoje = dia === hoje
              const outroMes = dia.slice(0, 7) !== mesSelecionado
              const quantidade = viagensDoFiltro.filter(viagem => viagem.dia === dia).length
              const nomeDia = maiuscula(formatar(dia, { weekday: 'short' }).replace('.', ''))

              return (
                <button
                  key={dia}
                  type='button'
                  aria-pressed={selecionado}
                  aria-label={`${maiuscula(formatar(dia, { weekday: 'long', day: 'numeric', month: 'long' }))}${
                    ehHoje ? ', hoje' : ''
                  }, ${quantidade} ${quantidade === 1 ? 'viagem' : 'viagens'}`}
                  onClick={() => setDiaSelecionado(dia)}
                  style={{
                    alignItems: 'center',
                    background: selecionado ? '#2F5FD8' : ehHoje ? '#E7F0FF' : 'transparent',
                    border: 'none',
                    borderRadius: '1.4rem',
                    color: selecionado ? '#FFFFFF' : outroMes ? '#94A3B8' : '#132A4D',
                    cursor: 'pointer',
                    display: 'flex',
                    flex: 1,
                    flexDirection: 'column',
                    gap: '0.3rem',
                    padding: '0.8rem 0',
                  }}
                >
                  <span style={{ fontSize: '1.1rem', opacity: selecionado ? 0.9 : 0.7 }}>{nomeDia}</span>
                  <span style={{ fontSize: '1.7rem', fontWeight: 'bold' }}>{paraData(dia).getUTCDate()}</span>
                  {/* Bolinha: o dia tem viagens no filtro atual. */}
                  <span
                    style={{
                      background: quantidade ? (selecionado ? '#FFFFFF' : '#2F5FD8') : 'transparent',
                      borderRadius: '50%',
                      height: '0.5rem',
                      width: '0.5rem',
                    }}
                  />
                </button>
              )
            })}
          </Flex>
        </Flex>
      </Flex>

      <Flex direction='column' gap='1rem' p='2rem'>
        {temPreferencias && (
          <Flex
            alignItems='center'
            bg={usarPreferencias ? 'aliceBlue' : 'systemWhite'}
            border='1px solid #DBEAFE'
            borderRadius='1.4rem'
            gap='1rem'
            p='1.2rem 1.4rem'
          >
            <Flex direction='column' flex={1} gap='0.2rem'>
              <Text color='prussianBlue' fontWeight='bold' variant='caption'>
                {usarPreferencias ? 'Mostrando suas preferências' : 'Mostrando todas as viagens'}
              </Text>
              <Text color='blueSlate' fontSize='1.2rem'>
                {[...turnosPreferidos.map(turno => nomeTurno[turno]), ...rotasPreferidas].join(' · ')}
              </Text>
            </Flex>
            <button
              type='button'
              onClick={() => setMostrarTodas(valor => !valor)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#2F5FD8',
                cursor: 'pointer',
                fontSize: '1.2rem',
                fontWeight: 'bold',
              }}
            >
              {usarPreferencias ? 'Ver todas' : 'Aplicar'}
            </button>
            <button
              type='button'
              aria-label='Editar preferências'
              onClick={() => router.push('/minhas_preferencias')}
              style={{
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '2rem',
                color: '#132A4D',
                cursor: 'pointer',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                padding: '0.6rem 1.2rem',
              }}
            >
              Editar
            </button>
          </Flex>
        )}

        <Flex alignItems='baseline' justifyContent='space-between'>
          <Text color='prussianBlue' fontWeight='bold'>
            {diaSelecionado === hoje ? 'Hoje, ' : ''}
            {formatar(diaSelecionado, {
              weekday: diaSelecionado === hoje ? undefined : 'long',
              day: 'numeric',
              month: 'long',
            }).replace(/^./, letra => (diaSelecionado === hoje ? letra : letra.toUpperCase()))}
          </Text>
          {viagens && (
            <Text color='blueSlate' variant='caption'>
              {viagensDoDia.length} {viagensDoDia.length === 1 ? 'viagem' : 'viagens'}
            </Text>
          )}
        </Flex>

        {viagensDoDia.map(viagem => (
          <MyTripsCard
            id={viagem.id}
            key={viagem.id}
            status={viagem.status}
            sentido={viagem.sentido}
            bloqueio={viagem.bloqueio}
            origin={viagem.origin}
            destination={viagem.destination}
            boarding={viagem.boarding}
            arrival={viagem.arrival}
            time={viagem.time}
            arrivalTime={viagem.arrivalTime}
            seats={`${viagem.occupiedSeats} / ${viagem.totalSeats} vagas`}
          />
        ))}

        {(erro || !viagens || viagensDoDia.length === 0) && (
          <Text color={erro ? 'systemDanger' : 'blueSlate'} textAlign='center' mt='2rem'>
            {erro ||
              (!viagens
                ? 'Carregando...'
                : usarPreferencias
                  ? 'Nenhuma viagem das suas preferências neste dia.'
                  : 'Nenhuma viagem neste dia.')}
          </Text>
        )}
      </Flex>
    </Flex>
  )
}

export default Viagens

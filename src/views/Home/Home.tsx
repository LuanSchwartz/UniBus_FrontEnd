import { Button, Flex, Text } from '@nexpy/design-system'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import Image from 'next/image'
import iconbell from '../../../icons/iconbell.svg'
import iconConfirmed from '../../../icons/iconconfirmed.svg'
import iconCancel from '../../../icons/iconcancel.svg'

import MyTripsCard, { Parada } from '@/components/myTripsCard/MyTripsCard'
import NoticesCard from '@/components/noticesCard/NoticesCard'
import { sentidoVisual } from '@/components/sentidoTag/SentidoTag'
import { getUsuario } from '@/services/api'
import { type Aviso, listarAvisos } from '@/services/avisosService'
import { type Preferencias, type Turno, getPreferencias } from '@/services/preferenciasService'
import {
  type Viagem,
  alternarPresenca,
  combinaComPreferencias,
  diaLocal,
  listarViagens,
} from '@/services/viagensService'

const nomeTurno: Record<Turno, string> = { MANHA: 'Manhã', TARDE: 'Tarde', NOITE: 'Noite' }

const formatarDia = (dia: string, opcoes: Intl.DateTimeFormatOptions) =>
  new Date(`${dia}T12:00:00Z`).toLocaleDateString('pt-BR', { timeZone: 'UTC', ...opcoes }).replace('.', '')

const maiuscula = (texto: string) => texto[0].toUpperCase() + texto.slice(1)

// "Hoje", "Amanhã" ou "Seg, 9 nov".
const diaRelativo = (dia: string, hoje: string) => {
  if (dia === hoje) return 'Hoje'
  const amanha = new Date(`${hoje}T12:00:00Z`)
  amanha.setUTCDate(amanha.getUTCDate() + 1)
  if (dia === amanha.toISOString().slice(0, 10)) return 'Amanhã'
  const semana = maiuscula(formatarDia(dia, { weekday: 'short' }))
  return `${semana}, ${formatarDia(dia, { day: 'numeric', month: 'short' })}`
}

const linkStyle = {
  background: 'transparent',
  border: 'none',
  color: '#2F5FD8',
  cursor: 'pointer',
  fontSize: '1.3rem',
  fontWeight: 'bold',
  padding: 0,
} as const

const Home = () => {
  const [nome, setNome] = useState('')
  const [viagens, setViagens] = useState<Viagem[] | null>(null)
  const [preferencias, setPreferencias] = useState<Preferencias | null>(null)
  const [avisos, setAvisos] = useState<Aviso[]>([])
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)
  const hoje = diaLocal(new Date())

  const router = useRouter()

  useEffect(() => {
    const falhar = (error: Error) => setErro(error.message)
    getUsuario()
      .then(usuario => setNome(usuario.nome.split(' ')[0]))
      .catch(falhar)
    listarViagens()
      .then(lista => setViagens(lista.filter(viagem => viagem.proxima)))
      .catch(falhar)
    // Sem preferências (ou se falhar), a Home mostra todas as viagens.
    getPreferencias().then(setPreferencias).catch(() => undefined)
    listarAvisos(3).then(setAvisos).catch(falhar)
  }, [])

  const minhas = (viagens ?? []).filter(viagem => combinaComPreferencias(viagem, preferencias))
  const proxima = minhas[0]
  const isConfirmed = proxima?.ativa ?? false
  const vagasOcupadas = proxima?.occupiedSeats ?? 0
  const totalVagas = proxima?.totalSeats ?? 0
  const porcentagem = totalVagas > 0 ? Math.min((vagasOcupadas / totalVagas) * 100, 100) : 0
  const resumoPreferencias = [
    ...(preferencias?.turnos ?? []).map(turno => nomeTurno[turno]),
    ...(preferencias?.rotas ?? []).map(rota => rota.nome),
  ].join(' · ')

  const handleAttendance = async () => {
    setErro('')
    setEnviando(true)
    try {
      const atualizada = await alternarPresenca(proxima)
      setViagens(lista => (lista ?? []).map(viagem => (viagem.id === atualizada.id ? atualizada : viagem)))
    } catch (error) {
      setErro((error as Error).message)
    } finally {
      setEnviando(false)
    }
  }

  const aviso = !proxima
    ? null
    : proxima.emEspera
      ? { cor: '#7C3AED', fundo: '#F5F0FF', texto: 'Você está na fila de espera desta viagem.' }
      : isConfirmed
        ? { cor: '#059669', fundo: '#ECFDF5', texto: 'Presença confirmada. Boa viagem!' }
        : proxima.bloqueio
          ? { cor: '#64748B', fundo: '#F1F5F9', texto: proxima.bloqueio }
          : { cor: '#B45309', fundo: '#FFF7ED', texto: `Confirme até ${proxima.limite} para garantir sua vaga.` }

  return (
    <Flex direction='column' bg='grey200' minHeight='100vh' pb='12rem'>
      <Flex direction='column' bg='prussianBlue' p='4.5rem 2.4rem 7rem' gap='1.4rem'>
        <Flex justifyContent='space-between' alignItems='center'>
          <Text fontSize='1.3rem' color='paleSlate'>
            {maiuscula(formatarDia(hoje, { weekday: 'long', day: 'numeric', month: 'long' }))}
          </Text>
          <button
            type='button'
            aria-label='Ver avisos'
            onClick={() => router.push('/avisos')}
            style={{
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.12)',
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              height: '4rem',
              justifyContent: 'center',
              width: '4rem',
            }}
          >
            <Image src={iconbell} alt='' width={18} height={18} style={{ filter: 'brightness(0) invert(1)' }} />
          </button>
        </Flex>

        <Text fontSize='3rem' color='systemWhite' fontWeight='bold'>
          {nome ? `Olá, ${nome}!` : 'Olá!'}
        </Text>

        {resumoPreferencias && (
          <button
            type='button'
            onClick={() => router.push('/minhas_preferencias')}
            style={{
              alignSelf: 'flex-start',
              background: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              borderRadius: '2rem',
              color: '#E2E8F0',
              cursor: 'pointer',
              fontSize: '1.2rem',
              padding: '0.6rem 1.2rem',
            }}
          >
            Suas preferências: <strong style={{ color: '#FFFFFF' }}>{resumoPreferencias}</strong> · editar
          </button>
        )}
      </Flex>

      <Flex
        direction='column'
        bg='systemWhite'
        mx='1.6rem'
        mt='-5rem'
        borderRadius='2rem'
        boxShadow='0 12px 28px rgba(21, 28, 42, 0.14)'
        position='relative'
        zIndex={1}
        overflow='hidden'
      >
        <Flex justifyContent='space-between' alignItems='center' p='1.6rem 2rem 0'>
          <Text color='blueSlate' fontSize='1.3rem' fontWeight='bold'>
            Próxima viagem
          </Text>
          {proxima && (
            <Text color='prussianBlue' fontSize='1.3rem' fontWeight='bold'>
              {diaRelativo(proxima.dia, hoje)}
            </Text>
          )}
        </Flex>

        {!proxima && (
          <Flex direction='column' alignItems='center' gap='1rem' p='3rem 2rem'>
            <Text color={erro ? 'systemDanger' : 'blueSlate'} textAlign='center'>
              {erro ||
                (!viagens
                  ? 'Carregando...'
                  : resumoPreferencias
                    ? 'Nenhuma viagem programada nas suas preferências.'
                    : 'Nenhuma viagem programada.')}
            </Text>
            {viagens && !erro && (
              <button type='button' onClick={() => router.push('/viagens')} style={linkStyle}>
                Ver todas as viagens
              </button>
            )}
          </Flex>
        )}

        {proxima && aviso && (
          <Flex direction='column' gap='1.8rem' p='1.4rem 2rem 2rem'>
            <Flex gap='1.8rem' alignItems='stretch'>
              <Flex direction='column' minWidth='7rem' gap='0.2rem'>
                <Text color='prussianBlue' fontSize='3.4rem' fontWeight='bold' lineHeight='1'>
                  {proxima.time}
                </Text>
                <Text fontSize='1.3rem' fontWeight='bold' style={{ color: sentidoVisual[proxima.sentido].cor }}>
                  {sentidoVisual[proxima.sentido].label} · {nomeTurno[proxima.turno]}
                </Text>
              </Flex>

              <Flex direction='column' flex={1} gap='1.4rem' position='relative'>
                <span
                  aria-hidden
                  style={{
                    borderLeft: `2px dashed ${sentidoVisual[proxima.sentido].cor}55`,
                    bottom: '2.6rem',
                    left: '0.45rem',
                    position: 'absolute',
                    top: '1.2rem',
                  }}
                />
                <Parada cidade={proxima.origin} ponto={proxima.boarding} cor={sentidoVisual[proxima.sentido].cor} />
                <Parada
                  cidade={proxima.destination}
                  ponto={proxima.arrival}
                  detalhe={`chega ${proxima.arrivalTime}`}
                  cor={sentidoVisual[proxima.sentido].cor}
                  preenchida
                />
              </Flex>
            </Flex>

            <Flex direction='column' gap='0.6rem'>
              <Flex justifyContent='space-between'>
                <Text color='blueSlate' fontSize='1.2rem'>
                  Rota {proxima.rota}
                </Text>
                <Text color='blueSlate' fontSize='1.2rem'>
                  {vagasOcupadas} de {totalVagas} vagas ocupadas
                </Text>
              </Flex>
              <div
                role='progressbar'
                aria-label='Ocupação do ônibus'
                aria-valuenow={vagasOcupadas}
                aria-valuemin={0}
                aria-valuemax={totalVagas}
                style={{ background: '#EEF2F7', borderRadius: '1rem', height: '0.6rem', overflow: 'hidden' }}
              >
                <div
                  style={{
                    background: '#2F5FD8',
                    borderRadius: '1rem',
                    height: '100%',
                    transition: 'width 0.3s ease',
                    width: `${porcentagem}%`,
                  }}
                />
              </div>
            </Flex>

            <Flex
              alignItems='center'
              gap='0.8rem'
              p='1rem 1.2rem'
              borderRadius='1.2rem'
              style={{ background: aviso.fundo }}
            >
              <span
                aria-hidden
                style={{ background: aviso.cor, borderRadius: '50%', flexShrink: 0, height: '0.8rem', width: '0.8rem' }}
              />
              <Text fontSize='1.3rem' fontWeight='bold' style={{ color: aviso.cor }}>
                {aviso.texto}
              </Text>
            </Flex>

            {erro && (
              <Text color='systemDanger' textAlign='center' role='alert' fontSize='1.3rem'>
                {erro}
              </Text>
            )}

            <Button
              onClick={handleAttendance}
              disabled={enviando || Boolean(proxima.bloqueio)}
              size='auto'
              bg={proxima.bloqueio ? 'grey300' : isConfirmed ? 'systemDanger' : 'royalAzure'}
              minHeight='5.2rem'
              borderRadius='1.4rem'
              p='1.4rem 2rem'
              gap='1rem'
              color='systemWhite'
              fontSize='1.7rem'
              fontWeight='bold'
              textTransform='none'
            >
              {!proxima.bloqueio && (
                <Image src={isConfirmed ? iconCancel : iconConfirmed} alt='' width={22} height={22} />
              )}
              {proxima.bloqueio ?? (isConfirmed ? 'Cancelar presença' : 'Confirmar presença')}
            </Button>

            <button
              type='button'
              onClick={() => router.push(`/detalhes_viagem?id=${proxima.id}`)}
              style={{ ...linkStyle, alignSelf: 'center' }}
            >
              Ver detalhes da viagem
            </button>
          </Flex>
        )}
      </Flex>

      {minhas.length > 1 && (
        <Flex direction='column' p='2.8rem 1.6rem 0' gap='1.2rem'>
          <Flex justifyContent='space-between' alignItems='center'>
            <Text color='prussianBlue' fontSize='1.8rem' fontWeight='bold'>
              Próximas viagens
            </Text>
            <button type='button' onClick={() => router.push('/viagens')} style={linkStyle}>
              Ver todas
            </button>
          </Flex>
          {minhas.slice(1, 4).map(viagem => (
            <MyTripsCard
              key={viagem.id}
              id={viagem.id}
              status={viagem.status}
              sentido={viagem.sentido}
              bloqueio={viagem.bloqueio}
              dia={diaRelativo(viagem.dia, hoje)}
              origin={viagem.origin}
              destination={viagem.destination}
              boarding={viagem.boarding}
              arrival={viagem.arrival}
              time={viagem.time}
              arrivalTime={viagem.arrivalTime}
              seats={`${viagem.occupiedSeats} / ${viagem.totalSeats} vagas`}
            />
          ))}
        </Flex>
      )}

      <Flex direction='column' p='2.8rem 1.6rem 0' gap='1.2rem'>
        <Flex justifyContent='space-between' alignItems='center'>
          <Text color='prussianBlue' fontSize='1.8rem' fontWeight='bold'>
            Avisos recentes
          </Text>
          <button type='button' onClick={() => router.push('/avisos')} style={linkStyle}>
            Ver todos
          </button>
        </Flex>
        {avisos.map(item => (
          <NoticesCard
            key={item.id}
            status={item.status}
            mensageTitle={item.mensageTitle}
            date={item.date}
            hours={item.hours}
            mensageDescription={item.mensageDescription}
          />
        ))}
      </Flex>
    </Flex>
  )
}

export default Home

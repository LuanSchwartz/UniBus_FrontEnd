import { Box, Button, Flex, Text } from '@nexpy/design-system'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { type ReactNode, useEffect, useState } from 'react'

import { sentidoVisual } from '@/components/sentidoTag/SentidoTag'
import { formatarMoeda } from '@/services/carteiraService'
import { type DetalheViagem, alternarPresenca, obterViagem } from '@/services/viagensService'

import iconConfirmed from '../../../icons/iconconfirmed.svg'
import iconCancel from '../../../icons/iconcancel.svg'

const statusConfig = {
  confirmed: {
    label: 'Presença confirmada',
    background: 'turfeGreen',
    color: 'systemSafe',
  },
  pending: {
    label: 'Presença pendente',
    background: 'ivoryMist',
    color: 'systemWarning',
  },
  canceled: {
    label: 'Viagem cancelada',
    background: 'snow',
    color: 'systemDanger',
  },
  completed: {
    label: 'Viagem concluída',
    background: 'grey100',
    color: 'grey500',
  },
}

const nomeTurno = { MANHA: 'Manhã', TARDE: 'Tarde', NOITE: 'Noite' }

const Secao = ({ titulo, children }: { titulo: string; children: ReactNode }) => (
  <Flex
    direction='column'
    gap='1.4rem'
    bg='systemWhite'
    borderRadius='1.6rem'
    p='1.8rem'
    boxShadow='0 2px 10px rgba(21, 28, 42, 0.08)'
  >
    <Text fontSize='1.6rem' fontWeight='bold' color='prussianBlue'>
      {titulo}
    </Text>
    {children}
  </Flex>
)

const Linha = ({ rotulo, valor, destaque }: { rotulo: string; valor: ReactNode; destaque?: boolean }) => (
  <Flex justifyContent='space-between' alignItems='flex-start' gap='1.6rem'>
    <Text color='blueSlate' fontSize='1.4rem'>
      {rotulo}
    </Text>
    <Text
      color='prussianBlue'
      fontSize='1.4rem'
      fontWeight={destaque ? 'bold' : 'normal'}
      textAlign='right'
    >
      {valor}
    </Text>
  </Flex>
)

const DetalhesViagem = () => {
  const router = useRouter()
  const tripId = typeof router.query.id === 'string' ? router.query.id : ''
  const [trip, setTrip] = useState<DetalheViagem | null>(null)
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    if (!tripId) return
    obterViagem(tripId)
      .then(setTrip)
      .catch(error => setErro(error.message))
  }, [tripId])

  if (!trip) {
    return (
      <Text color='blueSlate' textAlign='center' mt='4rem'>
        {erro || 'Carregando...'}
      </Text>
    )
  }

  const isActive = trip.ativa
  const occupiedSeats = trip.occupiedSeats
  const livres = Math.max(trip.totalSeats - occupiedSeats, 0)
  const direcao = sentidoVisual[trip.sentido]
  const visual =
    trip.bloqueio === 'Viagem em andamento'
      ? { label: trip.bloqueio, background: 'aliceBlue', color: 'royalAzure' }
      : trip.status === 'pending' && trip.bloqueio
        ? { label: trip.bloqueio, background: 'grey100', color: 'grey500' }
        : statusConfig[trip.status]
  const occupancy = trip.totalSeats > 0 ? Math.min((occupiedSeats / trip.totalSeats) * 100, 100) : 0
  const ultimaParada = trip.paradas.length - 1

  const handleAttendance = async () => {
    setErro('')
    setEnviando(true)
    try {
      setTrip(await alternarPresenca(trip))
    } catch (error) {
      setErro((error as Error).message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <Flex direction='column' bg='grey200' minHeight='100vh' pb='20rem'>
      <Flex alignItems='center' justifyContent='center' p='2.4rem 2rem' bg='systemWhite' position='relative'>
        <button
          aria-label='Voltar para viagens'
          onClick={() => router.back()}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#132A4D',
            cursor: 'pointer',
            fontSize: '3rem',
            left: '2rem',
            lineHeight: 1,
            padding: 0,
            position: 'absolute',
          }}
        >
          ←
        </button>
        <Text fontSize='2rem' fontWeight='bold'>
          Detalhes da viagem
        </Text>
      </Flex>

      <Flex direction='column' gap='1.6rem' p='1.6rem'>
        <Flex
          direction='column'
          bg='systemWhite'
          borderRadius='1.6rem'
          overflow='hidden'
          boxShadow='0 2px 10px rgba(21, 28, 42, 0.10)'
        >
          <Flex bg={visual.background} alignItems='center' gap='0.8rem' p='1.2rem 2rem'>
            <Image src={iconConfirmed} alt='' width={16} height={16} />
            <Text color={visual.color} fontWeight='bold' variant='caption'>
              {visual.label}
            </Text>
          </Flex>

          <Flex direction='column' gap='1.2rem' p='2rem'>
            <Text fontSize='1.3rem' fontWeight='bold' style={{ color: direcao.cor }}>
              Viagem de {direcao.label.toLowerCase()} · {nomeTurno[trip.turno]} · Rota {trip.rota}
            </Text>
            <Text fontSize='2.4rem' fontWeight='bold' color='prussianBlue'>
              {trip.origin} → {trip.destination}
            </Text>
            <Text color='blueSlate'>{trip.dataCompleta}</Text>

            <Flex alignItems='center' gap='1.2rem' mt='0.8rem'>
              <Flex direction='column'>
                <Text color='blueSlate' fontSize='1.2rem'>
                  Saída
                </Text>
                <Text color='prussianBlue' fontSize='2.6rem' fontWeight='bold'>
                  {trip.time}
                </Text>
              </Flex>
              <Flex direction='column' alignItems='center' flex={1} gap='0.4rem'>
                <Text color='blueSlate' fontSize='1.2rem'>
                  {trip.duracao}
                </Text>
                <span
                  aria-hidden
                  style={{ borderTop: `2px dashed ${direcao.cor}66`, display: 'block', width: '100%' }}
                />
              </Flex>
              <Flex direction='column' alignItems='flex-end'>
                <Text color='blueSlate' fontSize='1.2rem'>
                  Chegada
                </Text>
                <Text color='prussianBlue' fontSize='2.6rem' fontWeight='bold'>
                  {trip.arrivalTime}
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </Flex>

        <Secao titulo='Itinerário'>
          <Flex direction='column' position='relative'>
            {trip.paradas.map((parada, indice) => {
              const ponta = indice === 0 || indice === ultimaParada
              return (
                <Flex key={parada.id} gap='1.2rem' alignItems='stretch'>
                  <Flex direction='column' alignItems='center' w='1.4rem'>
                    <span
                      aria-hidden
                      style={{
                        background: indice === ultimaParada ? direcao.cor : '#FFFFFF',
                        border: `2px solid ${ponta ? direcao.cor : '#CBD5E1'}`,
                        borderRadius: '50%',
                        flexShrink: 0,
                        height: ponta ? '1.4rem' : '1rem',
                        marginTop: '0.4rem',
                        width: ponta ? '1.4rem' : '1rem',
                      }}
                    />
                    {indice < ultimaParada && (
                      <span aria-hidden style={{ background: '#E2E8F0', flex: 1, minHeight: '1.6rem', width: '2px' }} />
                    )}
                  </Flex>
                  <Flex direction='column' gap='0.2rem' pb={indice < ultimaParada ? '1.4rem' : 0} flex={1}>
                    <Flex justifyContent='space-between' gap='1rem'>
                      <Text color='prussianBlue' fontWeight={ponta ? 'bold' : 'normal'}>
                        {parada.nome}
                      </Text>
                      {indice === 0 && (
                        <Text color='prussianBlue' fontWeight='bold' fontSize='1.3rem'>
                          {trip.time}
                        </Text>
                      )}
                      {indice === ultimaParada && (
                        <Text color='prussianBlue' fontWeight='bold' fontSize='1.3rem'>
                          {trip.arrivalTime}
                        </Text>
                      )}
                    </Flex>
                    <Text color='blueSlate' fontSize='1.2rem'>
                      {[parada.cidade, parada.endereco, parada.referencia].filter(Boolean).join(' · ')}
                    </Text>
                    {indice === 0 && (
                      <Text fontSize='1.1rem' fontWeight='bold' style={{ color: direcao.cor }}>
                        Embarque
                      </Text>
                    )}
                    {indice === ultimaParada && (
                      <Text fontSize='1.1rem' fontWeight='bold' style={{ color: direcao.cor }}>
                        Desembarque
                      </Text>
                    )}
                  </Flex>
                </Flex>
              )
            })}
          </Flex>
        </Secao>

        <Secao titulo='Ônibus e motorista'>
          {trip.transporte.length === 0 && (
            <Text color='blueSlate' fontSize='1.4rem'>
              O transporte ainda não foi definido.
            </Text>
          )}
          {trip.transporte.map(({ veiculo, motorista, extra }) => (
            <Flex key={veiculo.placa} direction='column' gap='0.8rem'>
              {trip.transporte.length > 1 && (
                <Text color='blueSlate' fontSize='1.2rem' fontWeight='bold'>
                  {extra ? 'Veículo extra' : 'Veículo principal'}
                </Text>
              )}
              <Linha rotulo='Veículo' valor={veiculo.identificacao} destaque />
              <Linha rotulo='Tipo' valor={veiculo.tipo === 'VAN' ? 'Van' : 'Ônibus'} />
              <Linha rotulo='Placa' valor={veiculo.placa} />
              <Linha rotulo='Motorista' valor={motorista ?? 'A definir'} />
            </Flex>
          ))}
        </Secao>

        <Secao titulo='Vagas'>
          <Flex justifyContent='space-between'>
            <Text color='prussianBlue' fontWeight='bold'>
              {occupiedSeats} de {trip.totalSeats} ocupadas
            </Text>
            <Text color='blueSlate'>
              {livres} {livres === 1 ? 'livre' : 'livres'}
            </Text>
          </Flex>
          <Box
            w='100%'
            h='0.9rem'
            bg='grey100'
            borderRadius='1rem'
            overflow='hidden'
            role='progressbar'
            aria-label='Ocupação do ônibus'
            aria-valuenow={occupiedSeats}
            aria-valuemin={0}
            aria-valuemax={trip.totalSeats}
          >
            <Box
              w={`${occupancy}%`}
              h='100%'
              bg='royalAzure'
              borderRadius='1rem'
              transition='width 0.3s ease'
            />
          </Box>
          {trip.emEspera && (
            <Text color='blueSlate' fontSize='1.3rem'>
              Você está na fila de espera e entra automaticamente se abrir uma vaga.
            </Text>
          )}
        </Secao>

        <Secao titulo='Passagem e prazos'>
          <Linha rotulo='Passagem' valor={formatarMoeda(trip.tarifa)} destaque />
          <Linha rotulo='Confirmar presença até' valor={trip.limite} />
          <Linha rotulo='Cancelar com estorno até' valor={trip.cancelamentoAte} />
          <Text color='blueSlate' fontSize='1.2rem' lineHeight='1.5'>
            A passagem é descontada da carteira quando você confirma. Se cancelar dentro do prazo, o
            valor volta para a carteira.
          </Text>
        </Secao>

        <Flex
          bg='aliceBlue'
          borderColor='aliceBlue2'
          borderStyle='solid'
          borderWidth='1px'
          borderRadius='1.6rem'
          p='1.6rem'
          gap='1.2rem'
          alignItems='center'
        >
          <Text fontSize='2.4rem'>📣</Text>
          <Flex direction='column'>
            <Text fontWeight='bold' color='prussianBlue'>
              Chegue com 10 minutos de antecedência
            </Text>
            <Text color='blueSlate' variant='caption'>
              Mudanças de horário ou cancelamentos aparecem em Avisos.
            </Text>
          </Flex>
        </Flex>
      </Flex>

      {trip.status !== 'completed' && (
      <Flex bg='systemWhite' bottom='8rem' direction='column' gap='0.8rem' left={0} p='2rem' position='fixed' right={0}>
        {(erro || trip.emEspera) && (
          <Text color={erro ? 'systemDanger' : 'blueSlate'} textAlign='center' role='alert'>
            {erro || 'Você está na fila de espera desta viagem.'}
          </Text>
        )}
        <Button
          onClick={handleAttendance}
          disabled={enviando || Boolean(trip.bloqueio)}
          size='auto'
          bg={trip.bloqueio ? 'grey300' : isActive ? 'systemDanger' : 'royalAzure'}
          borderRadius='1.6rem'
          color='systemWhite'
          flex={1}
          minHeight='5.2rem'
          p='1.5rem 2rem'
          gap='1rem'
          fontSize='1.8rem'
          fontWeight='bold'
          textTransform='none'
        >
          {!trip.bloqueio && (
            <Image src={isActive ? iconCancel : iconConfirmed} alt='' width={24} height={24} />
          )}
          {trip.bloqueio ??
            (enviando
              ? isActive ? 'Cancelando...' : 'Confirmando...'
              : isActive ? 'Cancelar presença' : 'Confirmar presença')}
        </Button>
      </Flex>
      )}
    </Flex>
  )
}

export default DetalhesViagem

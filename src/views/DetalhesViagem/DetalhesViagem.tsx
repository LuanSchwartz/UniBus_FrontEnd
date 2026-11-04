import { Box, Button, Flex, Text } from '@nexpy/design-system'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { type Viagem, alternarPresenca, obterViagem } from '@/services/viagensService'

import iconCalendar from '../../../icons/iconcalendar.svg'
import iconClock from '../../../icons/iconclock.svg'
import iconConfirmed from '../../../icons/iconconfirmed.svg'
import iconCancel from '../../../icons/iconcancel.svg'
import iconbank from '../../../icons/iconbank.svg'
import iconpin from '../../../icons/iconpin.svg'

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
    label: 'Presença cancelada',
    background: 'snow',
    color: 'systemDanger',
  },
}

const DetalhesViagem = () => {
  const router = useRouter()
  const tripId = typeof router.query.id === 'string' ? router.query.id : ''
  const [trip, setTrip] = useState<Viagem | null>(null)
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
  const visual = statusConfig[trip.status]
  const occupancy = trip.totalSeats > 0 ? Math.min((occupiedSeats / trip.totalSeats) * 100, 100) : 0

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
    <Flex direction='column' bg='systemWhite' minHeight='100vh' pb='18rem'>
      <Flex alignItems='center' justifyContent='center' p='2.4rem 2rem'>
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

      <Flex direction='column' gap='2.4rem' px='2rem'>
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

          <Flex direction='column' gap='1.5rem' p='2rem'>
            <Text fontSize='2.4rem' fontWeight='bold' color='prussianBlue'>
              {trip.origin} → {trip.destination}
            </Text>

            <Flex gap='1.2rem' alignItems='center'>
              <Image src={iconCalendar} alt='' width={18} height={18} />
              <Text color='blueSlate'>{trip.date}</Text>
            </Flex>

            <Flex gap='1.2rem' alignItems='center'>
              <Image src={iconClock} alt='' width={18} height={18} />
              <Text color='blueSlate'>{trip.time}</Text>
            </Flex>

            <Flex gap='1.2rem' alignItems='flex-start'>
              <Image src={iconpin} alt='' width={18} height={18} />
              <Text color='blueSlate' lineHeight='1.5'>
                Saída: {trip.boarding}
                <br />
                Chegada: {trip.arrival}
              </Text>
            </Flex>

            <Flex gap='1.2rem' alignItems='center'>
              <Image src={iconbank} alt='Banco' width={18} height={18} />
              <Text color='blueSlate'>
                {occupiedSeats} / {trip.totalSeats} vagas ocupadas
              </Text>
            </Flex>

            <Box
              w='100%'
              h='0.9rem'
              bg='grey100'
              borderRadius='1rem'
              overflow='hidden'
              role='progressbar'
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
          </Flex>
        </Flex>

        <Flex direction='column' gap='0.8rem'>
          <Text fontSize='1.8rem' fontWeight='bold' color='prussianBlue'>
            Sobre a viagem
          </Text>
          <Text color='blueSlate' lineHeight='1.6'>
            {trip.description}
            <br />
            Por favor, chegue com 10 minutos de antecedência.
          </Text>
        </Flex>

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
              Dúvidas ou avisos?
            </Text>
            <Text color='blueSlate' variant='caption'>
              Acesse a seção de avisos para mais informações.
            </Text>
          </Flex>
        </Flex>
      </Flex>

      {(isActive || trip.podeConfirmar || erro) && (
      <Flex bg='systemWhite' bottom='8rem' direction='column' gap='0.8rem' left={0} p='2rem' position='fixed' right={0}>
        {(erro || trip.emEspera) && (
          <Text color={erro ? 'systemDanger' : 'blueSlate'} textAlign='center' role='alert'>
            {erro || 'Você está na fila de espera desta viagem.'}
          </Text>
        )}
        {(isActive || trip.podeConfirmar) && (
        <Button
          onClick={handleAttendance}
          disabled={enviando}
          size='auto'
          bg={isActive ? 'systemDanger' : 'royalAzure'}
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
          <Image src={isActive ? iconCancel : iconConfirmed} alt='' width={24} height={24} />
          {isActive ? 'Cancelar presença' : 'Confirmar presença'}
        </Button>
        )}
      </Flex>
      )}
    </Flex>
  )
}

export default DetalhesViagem

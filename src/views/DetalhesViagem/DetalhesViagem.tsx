import { Box, Button, Flex, Text } from '@nexpy/design-system'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'

import iconCalendar from '../../../icons/iconcalendar.svg'
import iconClock from '../../../icons/iconclock.svg'
import iconConfirmed from '../../../icons/iconconfirmed.svg'
import iconCancel from '../../../icons/iconcancel.svg'

type TripDetails = {
  id: string
  status: 'confirmed' | 'pending' | 'canceled'
  origin: string
  destination: string
  date: string
  time: string
  occupiedSeats: number
  totalSeats: number
  boarding: string
  arrival: string
  description: string
}

const trips: TripDetails[] = [
  {
    id: '1',
    status: 'confirmed',
    origin: 'Pedro Osório',
    destination: 'Pelotas',
    date: '26 de agosto (Segunda-feira)',
    time: '07:00',
    occupiedSeats: 4,
    totalSeats: 42,
    boarding: 'Terminal de Pedro Osório',
    arrival: 'Rodoviária de Pelotas',
    description: 'Viagem regular da linha Pedro Osório → Pelotas.',
  },
  {
    id: '2',
    status: 'canceled',
    origin: 'Pedro Osório',
    destination: 'Pelotas',
    date: '26 de agosto (Segunda-feira)',
    time: '07:00',
    occupiedSeats: 12,
    totalSeats: 42,
    boarding: 'Terminal de Pedro Osório',
    arrival: 'Rodoviária de Pelotas',
    description: 'Viagem regular da linha Pedro Osório → Pelotas.',
  },
  {
    id: '3',
    status: 'pending',
    origin: 'Pedro Osório',
    destination: 'Pelotas',
    date: '26 de agosto (Segunda-feira)',
    time: '07:00',
    occupiedSeats: 12,
    totalSeats: 42,
    boarding: 'Terminal de Pedro Osório',
    arrival: 'Rodoviária de Pelotas',
    description: 'Viagem regular da linha Pedro Osório → Pelotas.',
  },
]

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
  const trip = trips.find(item => item.id === tripId) ?? trips[0]
  const [isConfirmed, setIsConfirmed] = useState(trip.status === 'confirmed')
  const status = isConfirmed ? 'confirmed' : trip.status === 'canceled' ? 'canceled' : 'pending'
  const visual = statusConfig[status]
  const occupancy = Math.min((trip.occupiedSeats / trip.totalSeats) * 100, 100)

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
              <Text color='blueSlate' fontSize='2rem' lineHeight='1'>
                ⌖
              </Text>
              <Text color='blueSlate' lineHeight='1.5'>
                Saída: {trip.boarding}
                <br />
                Chegada: {trip.arrival}
              </Text>
            </Flex>

            <Flex gap='1.2rem' alignItems='center'>
              <Text color='blueSlate' fontSize='1.8rem'>
                ♿
              </Text>
              <Text color='blueSlate'>
                {trip.occupiedSeats} / {trip.totalSeats} vagas ocupadas
              </Text>
            </Flex>

            <Box
              w='100%'
              h='0.9rem'
              bg='grey100'
              borderRadius='1rem'
              overflow='hidden'
              role='progressbar'
              aria-valuenow={trip.occupiedSeats}
              aria-valuemin={0}
              aria-valuemax={trip.totalSeats}
            >
              <Box w={`${occupancy}%`} h='100%' bg='royalAzure' borderRadius='1rem' />
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

      <Flex bg='systemWhite' bottom='8rem' left={0} p='2rem' position='fixed' right={0}>
        <Button
          onClick={() => setIsConfirmed(value => !value)}
          size='auto'
          bg={isConfirmed ? 'systemDanger' : 'royalAzure'}
          borderRadius='1.6rem'
          color='systemWhite'
          flex={1}
          minHeight='5.2rem'
          textTransform='none'
        >
          <Image src={isConfirmed ? iconCancel : iconConfirmed} alt='' width={18} height={18} />
          {isConfirmed ? 'Cancelar presença' : 'Confirmar presença'}
        </Button>
      </Flex>
    </Flex>
  )
}

export default DetalhesViagem

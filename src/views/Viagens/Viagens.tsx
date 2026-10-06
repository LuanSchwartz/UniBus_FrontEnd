import { Flex, Text } from '@nexpy/design-system'
import { useState } from 'react'

import MyTripsCard from '@/components/myTripsCard/MyTripsCard'

type FiltroViagens = 'proximas' | 'todas' | 'canceladas'

type Viagem = {
  id: number
  status: 'confirmed' | 'pending' | 'canceled'
  categoria: 'proxima' | 'cancelada'
  origin: string
  destination: string
  date: string
  time: string
  seats: string
  tag?: string
}

const viagens: Viagem[] = [
  {
    id: 1,
    status: 'confirmed',
    categoria: 'proxima',
    origin: 'Pedro Osório',
    destination: 'Pelotas',
    date: '26 de agosto (Seg)',
    time: '07:00',
    seats: '4 / 42 vagas',
  },
  {
    id: 2,
    status: 'canceled',
    categoria: 'cancelada',
    origin: 'Pedro Osório',
    destination: 'Pelotas',
    date: '26 de agosto (Seg)',
    time: '07:00',
    seats: '12/ 42 vagas'
  },
  {
    id: 3,
    status: 'pending',
    categoria: 'proxima',
    origin: 'Pedro Osório',
    destination: 'Pelotas',
    date: '26 de agosto (Seg)',
    time: '07:00',
    seats: '12/ 42 vagas'
  }
]

const Viagens = () => {
  const [filtro, setFiltro] = useState<FiltroViagens>('proximas')

  const viagensFiltradas = viagens.filter(viagem => {
    if (filtro === 'todas') return true

    if (filtro === 'canceladas') {
      return viagem.categoria === 'cancelada'
    }

    return viagem.categoria === 'proxima'
  })

    return (
    <Flex direction='column' bg='grey200' minHeight='100vh' pb='8rem'>
      <Flex bg='systemWhite' direction='column' pt='3.5rem'>
        <Text fontSize='3.4rem' fontWeight='bold' px='3.5rem' pb='1.5rem'>
          Minhas viagens
        </Text>

        <Flex justifyContent='space-around'>
  <button
    style={{
      backgroundColor: 'transparent',
      color: filtro === 'proximas' ? '#2F5FD8' : '#64748B',
      border: 'none',
      borderBottom: `2px solid ${
        filtro === 'proximas' ? '#2F5FD8' : 'transparent'
      }`,
      boxShadow: 'none',
      fontWeight: 'bold',
      padding: '1rem 4rem',
      cursor: 'pointer',
    }}
    onClick={() => setFiltro('proximas')}
  >
    Próximas
  </button>

  <button
    style={{
      backgroundColor: 'transparent',
      color: filtro === 'todas' ? '#2F5FD8' : '#64748B',
      border: 'none',
      borderBottom: `2px solid ${filtro === 'todas' ? '#2F5FD8' : 'transparent'}`,
      boxShadow: 'none',
      fontWeight: 'bold',
      padding: '1rem 4rem',
      cursor: 'pointer',
    }}
    onClick={() => setFiltro('todas')}
  >
    Todas
  </button>

  <button
    style={{
      backgroundColor: 'transparent',
      color: filtro === 'canceladas' ? '#2F5FD8' : '#64748B',
      border: 'none',
      borderBottom: `2px solid ${
        filtro === 'canceladas' ? '#2F5FD8' : 'transparent'
      }`,
      boxShadow: 'none',
      fontWeight: 'bold',
      padding: '1rem 4rem',
      cursor: 'pointer',
    }}
    onClick={() => setFiltro('canceladas')}
  >
    Canceladas
  </button>
        </Flex>
      </Flex>

      <Flex direction='column' gap='1rem' p='2rem'>
        {viagensFiltradas.map(viagem => (
            <MyTripsCard
            key={viagem.id}
            status={viagem.status}
            origin={viagem.origin}
            destination={viagem.destination}
            date={viagem.date}
            time={viagem.time}
            seats={viagem.seats}
            tag={viagem.tag}
            />
        ))}

        {viagensFiltradas.length === 0 && (
          <Text color='blueSlate' textAlign='center' mt='2rem'>
            Nenhuma viagem encontrada.
          </Text>
        )}
      </Flex>
    </Flex>
  )
}

export default Viagens
import { Flex, Text } from '@nexpy/design-system'
import { useEffect, useState } from 'react'

import MyTripsCard from '@/components/myTripsCard/MyTripsCard'
import { type Viagem, listarViagens } from '@/services/viagensService'

type FiltroViagens = 'proximas' | 'todas' | 'canceladas'

const Viagens = () => {
  const [filtro, setFiltro] = useState<FiltroViagens>('proximas')
  const [viagens, setViagens] = useState<Viagem[] | null>(null)
  const [erro, setErro] = useState('')

  useEffect(() => {
    listarViagens()
      .then(setViagens)
      .catch(error => setErro(error.message))
  }, [])

  const viagensFiltradas = (viagens ?? []).filter(viagem => {
    if (filtro === 'todas') return true

    if (filtro === 'canceladas') {
      return viagem.status === 'canceled'
    }

    return viagem.proxima && viagem.status !== 'canceled'
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
            id={viagem.id}
            key={viagem.id}
            status={viagem.status}
            origin={viagem.origin}
            destination={viagem.destination}
            date={viagem.date}
            time={viagem.time}
            seats={`${viagem.occupiedSeats} / ${viagem.totalSeats} vagas`}
            />
        ))}

        {(erro || (viagens && viagensFiltradas.length === 0)) && (
          <Text color='blueSlate' textAlign='center' mt='2rem'>
            {erro || 'Nenhuma viagem encontrada.'}
          </Text>
        )}
      </Flex>
    </Flex>
  )
}

export default Viagens
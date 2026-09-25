import NoticesCard, { type NoticesCardProps } from '@/components/noticesCard/NoticesCard'

import { Flex, Text } from '@nexpy/design-system'
import { useState } from 'react'

type FiltroAvisos = 'todos' | 'importantes' | 'viagens'

type Aviso = NoticesCardProps & {
  id: number
  categoria: 'importantes' | 'viagem'
}

const avisos: Aviso[] = [
  {
    id: 1,
    status: 'warning',
    categoria: 'viagem',
    mensageTitle: 'Viagem extra na sexta-feira',
    date: '20/08/2025',
    hours: '09:15',
    mensageDescription: 'Teremos uma viagem extra às 17:00.',
  },

  {
    id: 2,
    status: 'danger',
    categoria: 'viagem',
    mensageTitle: 'Viagem extra na sexta-feira',
    date: '20/08/2025',
    hours: '09:15',
    mensageDescription: 'Teremos uma viagem extra às 17:00.',
  },

  {
    id: 3,
    status: 'safe',
    categoria: 'importantes',
    mensageTitle: 'Viagem extra na sexta-feira',
    date: '20/08/2025',
    hours: '09:15',
    mensageDescription: 'Teremos uma viagem extra às 17:00.',
  },
]

const Avisos = () => {
  const [filtro, setFiltro] = useState<FiltroAvisos>('todos')

  const avisosFiltrados = avisos.filter(aviso => {
    if (filtro === 'importantes') return aviso.categoria === 'importantes'
    if (filtro === 'viagens') return aviso.categoria === 'viagem'
    return true
  })

  return (
    <Flex direction='column' bg='grey200' minHeight='100vh' pb='8rem'>
      <Flex bg='systemWhite' direction='column' gap='1rem' p='3.5rem 3.5rem 0 3.5rem'>
        <Text fontSize='3.4rem' fontWeight='bold'>
          Avisos
        </Text>

        <Flex justifyContent='space-between'>
          <button
            style={{
              backgroundColor: 'transparent',
              color: filtro === 'todos' ? '#2F5FD8' : '#64748B',
              border: 'none',
              borderBottom: `2px solid ${filtro === 'todos' ? '#2F5FD8' : 'transparent'}`,
              boxShadow: 'none',
              fontWeight: 'bold',
              padding: '1rem 4rem',
              cursor: 'pointer',
            }}
            onClick={() => setFiltro('todos')}
          >
            Todos
          </button>
          <button
            style={{
              backgroundColor: 'transparent',
              color: filtro === 'importantes' ? '#2F5FD8' : '#64748B',
              border: 'none',
              borderBottom: `2px solid ${
                filtro === 'importantes' ? '#2F5FD8' : 'transparent'
              }`,
              boxShadow: 'none',
              fontWeight: 'bold',
              padding: '1rem 4rem',
              cursor: 'pointer',
            }}
            onClick={() => setFiltro('importantes')}
          >
            Importantes
          </button>
          <button
            style={{
              backgroundColor: 'transparent',
              color: filtro === 'viagens' ? '#2F5FD8' : '#64748B',
              border: 'none',
              borderBottom: `2px solid ${
                filtro === 'viagens' ? '#2F5FD8' : 'transparent'
              }`,
              boxShadow: 'none',
              fontWeight: 'bold',
              padding: '1rem 4rem',
              cursor: 'pointer',
            }}
            onClick={() => setFiltro('viagens')}
          >
            Viagens
          </button>
        </Flex>
      </Flex>

      <Flex direction='column' gap='0.8rem' p='3.5rem'>
        {avisosFiltrados.map(aviso => (
          <NoticesCard
            key={aviso.id}
            status={aviso.status}
            mensageTitle={aviso.mensageTitle}
            date={aviso.date}
            hours={aviso.hours}
            mensageDescription={aviso.mensageDescription}
          />
        ))}
      </Flex>
    </Flex>
  )
}

export default Avisos

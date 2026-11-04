import NoticesCard from '@/components/noticesCard/NoticesCard'
import { type Aviso, listarAvisos } from '@/services/avisosService'

import { Flex, Text } from '@nexpy/design-system'
import { useEffect, useState } from 'react'

type FiltroAvisos = 'todos' | 'importantes' | 'viagens'

const Avisos = () => {
  const [filtro, setFiltro] = useState<FiltroAvisos>('todos')
  const [avisos, setAvisos] = useState<Aviso[] | null>(null)
  const [erro, setErro] = useState('')

  useEffect(() => {
    listarAvisos()
      .then(setAvisos)
      .catch(error => setErro(error.message))
  }, [])

  const avisosFiltrados = (avisos ?? []).filter(aviso => {
    if (filtro === 'importantes') return aviso.importante
    if (filtro === 'viagens') return aviso.viagem
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

        {(erro || avisos?.length === 0 || (avisos && avisosFiltrados.length === 0)) && (
          <Text color='blueSlate' textAlign='center' mt='2rem'>
            {erro || 'Nenhum aviso encontrado.'}
          </Text>
        )}
      </Flex>
    </Flex>
  )
}

export default Avisos

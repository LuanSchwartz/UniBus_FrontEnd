import { Flex, Text } from '@nexpy/design-system'
import { useRouter } from 'next/router'
import Image from 'next/image'

import iconArrowRight from '../../../icons/iconarrow.svg'
import { type Sentido, sentidoVisual } from '../sentidoTag/SentidoTag'

type TripStatus = 'confirmed' | 'pending' | 'canceled' | 'completed'

type MyTripsCardProps = {
  id: string
  status: TripStatus
  sentido: Sentido
  origin: string
  destination: string
  boarding: string
  arrival: string
  time: string
  arrivalTime: string
  seats: string
  bloqueio: string | null
  // Mostrado acima do horário quando a lista mistura dias diferentes.
  dia?: string
}

const statusConfig = {
  confirmed: { label: 'Presença confirmada', cor: '#059669' },
  pending: { label: 'Presença pendente', cor: '#D97706' },
  canceled: { label: 'Viagem cancelada', cor: '#E11D48' },
  completed: { label: 'Viagem concluída', cor: '#94A3B8' },
}

type ParadaProps = { cidade: string; ponto: string; detalhe?: string; cor: string; preenchida?: boolean }

export const Parada = ({ cidade, ponto, detalhe, cor, preenchida = false }: ParadaProps) => (
  <Flex gap='1rem' alignItems='flex-start'>
    <span
      aria-hidden
      style={{
        background: preenchida ? cor : '#FFFFFF',
        border: `2px solid ${cor}`,
        borderRadius: '50%',
        flexShrink: 0,
        height: '1.1rem',
        marginTop: '0.35rem',
        position: 'relative',
        width: '1.1rem',
        zIndex: 1,
      }}
    />
    <Flex direction='column' gap='0.1rem'>
      <Text color='prussianBlue' fontWeight='bold' fontSize='1.5rem'>
        {cidade}
      </Text>
      <Text color='blueSlate' fontSize='1.2rem'>
        {ponto}
        {detalhe ? ` · ${detalhe}` : ''}
      </Text>
    </Flex>
  </Flex>
)

const MyTripsCard = ({
  id,
  status,
  sentido,
  origin,
  destination,
  boarding,
  arrival,
  time,
  arrivalTime,
  seats,
  bloqueio,
  dia,
}: MyTripsCardProps) => {
  const router = useRouter()
  // Antes da saída, a pendente sem prazo para confirmar e a viagem já iniciada ganham texto próprio.
  const situacao =
    bloqueio === 'Viagem em andamento'
      ? { label: bloqueio, cor: '#2563EB' }
      : status === 'pending' && bloqueio
        ? { label: bloqueio, cor: '#64748B' }
        : statusConfig[status]
  const direcao = sentidoVisual[sentido]
  const apagada = status === 'canceled' || status === 'completed'

  return (
    <button
      type='button'
      onClick={() => router.push(`/detalhes_viagem?id=${id}`)}
      aria-label={`Viagem de ${direcao.label.toLowerCase()} às ${time}, de ${origin} para ${destination}. ${situacao.label}.`}
      style={{
        background: '#FFFFFF',
        border: '1px solid #EEF2F7',
        borderRadius: '1.6rem',
        boxShadow: '0 4px 12px rgba(21, 28, 42, 0.06)',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        opacity: apagada ? 0.75 : 1,
        padding: 0,
        textAlign: 'left',
        width: '100%',
      }}
    >
      <Flex w='100%' p='1.6rem 1.4rem 1.4rem 1.6rem' gap='1.4rem' alignItems='stretch'>
        <Flex direction='column' minWidth='5.6rem' gap='0.2rem'>
          {dia && (
            <Text color='blueSlate' fontSize='1.1rem' fontWeight='bold'>
              {dia}
            </Text>
          )}
          <Text
            color='prussianBlue'
            fontSize='2rem'
            fontWeight='bold'
            style={{ textDecoration: status === 'canceled' ? 'line-through' : 'none' }}
          >
            {time}
          </Text>
          <Text fontSize='1.2rem' fontWeight='bold' style={{ color: direcao.cor }}>
            {direcao.label}
          </Text>
        </Flex>

        <Flex direction='column' flex={1} gap='1.4rem' position='relative'>
          {/* Linha que liga o embarque ao desembarque. */}
          <span
            aria-hidden
            style={{
              borderLeft: `2px dashed ${direcao.cor}55`,
              bottom: '2.6rem',
              left: '0.45rem',
              position: 'absolute',
              top: '1.2rem',
            }}
          />
          <Parada cidade={origin} ponto={boarding} cor={direcao.cor} />
          <Parada
            cidade={destination}
            ponto={arrival}
            detalhe={`chega ${arrivalTime}`}
            cor={direcao.cor}
            preenchida
          />
        </Flex>

        <Flex alignItems='center'>
          <Image src={iconArrowRight} alt='' width={20} height={20} />
        </Flex>
      </Flex>

      <Flex
        w='100%'
        justifyContent='space-between'
        alignItems='center'
        p='1rem 1.6rem'
        style={{ background: '#F8FAFC', borderTop: '1px solid #EEF2F7', borderRadius: '0 0 1.6rem 1.6rem' }}
      >
        <Flex alignItems='center' gap='0.6rem'>
          <span
            aria-hidden
            style={{ background: situacao.cor, borderRadius: '50%', height: '0.8rem', width: '0.8rem' }}
          />
          <Text fontSize='1.2rem' fontWeight='bold' style={{ color: situacao.cor }}>
            {situacao.label}
          </Text>
        </Flex>
        <Text color='blueSlate' fontSize='1.2rem'>
          {seats}
        </Text>
      </Flex>
    </button>
  )
}

export default MyTripsCard

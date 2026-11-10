export type Sentido = 'IDA' | 'VOLTA'

export const sentidoVisual = {
  IDA: { label: 'Ida', cor: '#2563EB' },
  VOLTA: { label: 'Volta', cor: '#7C3AED' },
} as const

const SentidoTag = ({ sentido }: { sentido: Sentido }) => {
  const visual = sentidoVisual[sentido]

  return (
    <span style={{ color: visual.cor, fontSize: '1.3rem', fontWeight: 'bold' }}>
      Viagem de {visual.label.toLowerCase()}
    </span>
  )
}

export default SentidoTag

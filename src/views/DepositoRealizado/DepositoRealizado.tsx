import { Flex, Text } from '@nexpy/design-system'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import {
  type Recarga,
  formatarData,
  formatarHora,
  formatarMoeda,
  listarRecargas,
} from '@/services/carteiraService'

import aguardando from '../../../icons/aguardando.svg'
import iconcalendar from '../../../icons/iconcalendar.svg'
import iconclock from '../../../icons/iconclock.svg'
import icone_certo from '../../../icons/icone_certo.svg'
import carteira_azul from '../../../icons/carteira_azul.svg'
import seta_cima from '../../../icons/seta_cima.svg'

const statusVisual = {
  PENDENTE: {
    background: 'ochre',
    circle: '#F59E0B',
    icon: aguardando,
    title: 'Solicitação enviada!',
    description: 'A secretaria vai conferir o Pix. Seu saldo é atualizado após a aprovação.',
    label: 'Aguardando confirmação',
  },
  APROVADA: {
    background: 'turfeGreen',
    circle: '#10B981',
    icon: icone_certo,
    title: 'Depósito aprovado!',
    description: 'Seu saldo foi atualizado com sucesso.',
    label: 'Aprovado',
  },
  REJEITADA: {
    background: 'snow',
    circle: '#E91546',
    icon: aguardando,
    title: 'Depósito recusado',
    description: 'A secretaria não confirmou este pagamento.',
    label: 'Recusado',
  },
  CANCELADA: {
    background: 'snow',
    circle: '#E91546',
    icon: aguardando,
    title: 'Depósito cancelado',
    description: 'Esta solicitação foi cancelada.',
    label: 'Cancelado',
  },
} as const

const DepositoRealizado = () => {
  const router = useRouter()
  const recargaId = typeof router.query.id === 'string' ? router.query.id : ''
  const [recargas, setRecargas] = useState<Recarga[] | null>(null)
  const [erro, setErro] = useState('')

  useEffect(() => {
    listarRecargas()
      .then(setRecargas)
      .catch(error => setErro(error.message))
  }, [])

  // shortcut: o back não tem rota de recarga por id; só acha entre as 20 mais recentes.
  const recarga = recargaId ? recargas?.find(item => item.id === recargaId) : recargas?.[0]
  const visual = recarga ? statusVisual[recarga.status] : null

  if (!recarga || !visual) {
    return (
      <Text color={erro ? 'systemDanger' : 'blueSlate'} textAlign='center' mt='4rem'>
        {erro || (recargas ? 'Nenhum depósito encontrado.' : 'Carregando...')}
      </Text>
    )
  }

  return (
    <Flex direction='column' bg='grey200' minHeight='100vh' pb='8rem'>
      <Flex
        bg='systemWhite'
        alignItems='center'
        justifyContent='center'
        p='2rem'
        position='relative'
      >
        <button
          aria-label='Voltar para a carteira'
          onClick={() => router.push('/carteira')}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#132A4D',
            cursor: 'pointer',
            fontSize: '2.6rem',
            left: '2rem',
            lineHeight: 1,
            padding: 0,
            position: 'absolute',
          }}
        >
          ←
        </button>
        <Text fontSize='2rem' fontWeight='bold' color='prussianBlue'>
          Comprovante de depósito
        </Text>
      </Flex>

      <Flex
        direction='column'
        gap='1.2rem'
        m='2rem 1rem'
        p='1.2rem'
        bg='systemWhite'
        border='1px solid #E2E8F0'
        borderRadius='3rem'
      >
        <Flex
          alignItems='center'
          bg={visual.background}
          borderRadius='1.6rem'
          gap='1rem'
          p='1.2rem'
        >
          <Flex
            alignItems='center'
            bg={visual.circle}
            borderRadius='50%'
            h='3.6rem'
            justifyContent='center'
            minWidth='3.6rem'
            w='3.6rem'
          >
            <Image src={visual.icon} alt='' width={18} height={18} />
          </Flex>
          <Flex direction='column' gap='0.2rem'>
            <Text color='prussianBlue' fontWeight='bold'>
              {visual.title}
            </Text>
            <Text color='blueSlate' variant='caption'>
              {recarga.status === 'REJEITADA' && recarga.observacaoAnalise
                ? recarga.observacaoAnalise
                : visual.description}
            </Text>
          </Flex>
        </Flex>

        <Flex
          direction='column'
          gap='0.8rem'
          border='1px solid #E2E8F0'
          borderRadius='1.6rem'
          p='1.2rem'
        >
          <Flex alignItems='center' gap='0.9rem'>
            <Image src={carteira_azul} alt='' width={16} height={16} />
            <Text color='prussianBlue' fontWeight='bold'>
              Detalhes do depósito
            </Text>
          </Flex>
          <Flex justifyContent='space-between'>
            <Text color='coolSteal' variant='caption'>Valor</Text>
            <Text color='prussianBlue' variant='caption' fontWeight='bold'>
              {formatarMoeda(recarga.valor)}
            </Text>
          </Flex>
          <Flex justifyContent='space-between'>
            <Text color='coolSteal' variant='caption'>Forma</Text>
            <Text color='prussianBlue' variant='caption'>
              {recarga.formaPagamento === 'PIX' ? 'Pix' : 'Dinheiro'}
            </Text>
          </Flex>
          <Flex justifyContent='space-between'>
            <Text color='coolSteal' variant='caption'>Situação</Text>
            <Text color='prussianBlue' variant='caption'>{visual.label}</Text>
          </Flex>
          <Flex justifyContent='space-between'>
            <Text color='coolSteal' variant='caption'>Solicitado em</Text>
            <Text color='prussianBlue' variant='caption'>
              {formatarData(recarga.criadoEm)} às {formatarHora(recarga.criadoEm)}
            </Text>
          </Flex>
          {recarga.analisadaEm && (recarga.status === 'APROVADA' || recarga.status === 'REJEITADA') && (
            <Flex justifyContent='space-between'>
              <Text color='coolSteal' variant='caption'>
                {recarga.status === 'APROVADA' ? 'Aprovado em' : 'Recusado em'}
              </Text>
              <Text color='prussianBlue' variant='caption'>
                {formatarData(recarga.analisadaEm)} às {formatarHora(recarga.analisadaEm)}
              </Text>
            </Flex>
          )}
        </Flex>

        <Text color='prussianBlue' fontSize='1.2rem' fontWeight='bold'>
          Histórico de depósitos
        </Text>

        {(recargas ?? []).map(deposit => (
            <Flex
              key={deposit.id}
              alignItems='center'
              border='1px solid #E2E8F0'
              borderRadius='1.6rem'
              gap='1rem'
              p='1rem'
            >
              <Flex
                alignItems='center'
                bg={statusVisual[deposit.status].background}
                borderRadius='50%'
                h='4rem'
                justifyContent='center'
                minWidth='4rem'
                w='4rem'
              >
                <Image
                  src={deposit.status === 'APROVADA' ? seta_cima : aguardando}
                  alt=''
                  width={18}
                  height={18}
                />
              </Flex>
              <Flex direction='column' gap='0.2rem'>
                <Text color='prussianBlue' fontWeight='bold'>
                  {formatarMoeda(deposit.valor)} · {statusVisual[deposit.status].label}
                </Text>
                <Flex alignItems='center' gap='0.3rem'>
                  <Image src={iconcalendar} alt='' width={12} height={12} />
                  <Text color='coolSteal' fontSize='0.9rem'>{formatarData(deposit.criadoEm)}</Text>
                  <Text color='coolSteal' fontSize='0.9rem'>•</Text>
                  <Image src={iconclock} alt='' width={12} height={12} />
                  <Text color='coolSteal' fontSize='0.9rem'>{formatarHora(deposit.criadoEm)}</Text>
                </Flex>
              </Flex>
            </Flex>
        ))}
      </Flex>
    </Flex>
  )
}

export default DepositoRealizado

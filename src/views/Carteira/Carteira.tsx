import { Button, Flex, Text } from '@nexpy/design-system'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import {
  type Transacao,
  formatarData,
  formatarHora,
  formatarMoeda,
  getCarteira,
  listarTransacoes,
} from '@/services/carteiraService'

import icone_carteira from '../../../icons/icone_carteira.svg'
import seta_cima from '../../../icons/seta_cima.svg'
import seta_baixo from '../../../icons/seta_baixo.svg'
import aguardando from '../../../icons/aguardando.svg'
import iconcalendar from '../../../icons/iconcalendar.svg'
import iconclock from '../../../icons/iconclock.svg'
import wallet_wave from '../../../icons/wallet_wave.svg'

const transactionVisual = {
  entrada: { background: 'turfeGreen', icon: seta_cima },
  saida: { background: 'snow2', icon: seta_baixo },
  pendente: { background: 'ochre', icon: aguardando },
  recusada: { background: 'snow', icon: aguardando },
} as const

const Carteira = () => {
  const router = useRouter()
  const [balance, setBalance] = useState<string | null>(null)
  const [transactions, setTransactions] = useState<Transacao[] | null>(null)
  const [erro, setErro] = useState('')

  useEffect(() => {
    const falhar = (error: Error) => setErro(error.message)
    getCarteira()
      .then(carteira => setBalance(carteira.saldo))
      .catch(falhar)
    listarTransacoes().then(setTransactions).catch(falhar)
  }, [])

  return (
    <Flex direction='column' bg='grey200' minHeight='100vh' pb='8rem'>
      <Flex bg='systemWhite' direction='column' gap='1rem' p='3.5rem 3.5rem 0 3.5rem'>
        <Text fontSize='3.4rem' fontWeight='bold'>
          Carteira
        </Text>
      </Flex>
      <Flex direction='column' alignItems='center' p='1.2rem 3.5rem 2.8rem'>
        <Text
          color='blueSlate'
          variant='caption'
          textAlign='left'
          alignSelf='flex-start'
          w='100%'
          maxWidth='30rem'
        >
Gerencie seu saldo e faça depósitos para
aproveitar todas as viagens.
        </Text>
      </Flex>
      <Flex direction='column' gap='1.2rem' px='2rem'>
        <Flex
          direction='column'
          bg='prussianBlue'
          borderRadius='2.4rem'
          boxShadow='0 10px 20px rgba(21, 42, 77, 0.20)'
          gap='1.2rem'
          overflow='hidden'
          p='2rem'
          position='relative'
        >
          <Image
            src={wallet_wave}
            alt=''
            fill
            priority
            sizes='100%'
            style={{ objectFit: 'cover', objectPosition: 'bottom', opacity: 0.7, zIndex: 0 }}
          />
          <Flex direction='column' gap='0.6rem' position='relative' zIndex={1}>
            <Flex alignItems='center' gap='0.6rem'>
              <Image src={icone_carteira} alt='Ícone da carteira' width={16} height={16} />
              <Text color='paleSlate'>Saldo atual</Text>
            </Flex>
            <Text color='systemWhite' fontSize='3.4rem' fontWeight='bold'>
              {balance === null ? '—' : formatarMoeda(balance)}
            </Text>
          </Flex>
          <Button
            onClick={() => router.push('/depositar_dinheiro')}
            size='auto'
            bg='royalAzure'
            borderRadius='1.5rem'
            color='systemWhite'
            minHeight='5.2rem'
            textTransform='none'
            zIndex={1}
          >
            <Flex alignItems='center' gap='0.6rem'>
              <Image src={icone_carteira} alt='Ícone da carteira' width={16} height={16} />
              <Text color='paleSlate'>Depositar Dinheiro</Text>
            </Flex>
          </Button>
        </Flex>
        <Text color='prussianBlue' fontSize='1.8rem' fontWeight='bold' mt='1rem'>
          Histórico de transações
        </Text>
        {(erro || transactions?.length === 0) && (
          <Text color={erro ? 'systemDanger' : 'blueSlate'} textAlign='center' mt='1rem'>
            {erro || 'Nenhuma transação ainda.'}
          </Text>
        )}
        {(transactions ?? []).map(transaction => {
          const visual = transactionVisual[transaction.tipo]
          const openReceipt = transaction.recargaId
            ? () => router.push({ pathname: '/deposito_realizado', query: { id: transaction.recargaId } })
            : undefined

          return (
            <Flex
              key={transaction.id}
              as={openReceipt ? 'button' : 'div'}
              type={openReceipt ? 'button' : undefined}
              onClick={openReceipt}
              aria-label={openReceipt ? `Ver comprovante: ${transaction.titulo}` : undefined}
              cursor={openReceipt ? 'pointer' : 'default'}
              border='none'
              textAlign='left'
              w='100%'
              direction='row'
              alignItems='center'
              bg='systemWhite'
              borderRadius='1.8rem'
              boxShadow='0 4px 12px rgba(21, 28, 42, 0.06)'
              gap='1.2rem'
              p='1.5rem'
            >
              <Flex
                alignItems='center'
                justifyContent='center'
                bg={visual.background}
                borderRadius='50%'
                w='4rem'
                minWidth='4rem'
                h='4rem'
              >
                <Image src={visual.icon} alt='' width={18} height={18} />
              </Flex>
              <Flex direction='column' gap='0.4rem'>
                <Text color='prussianBlue' fontWeight='bold'>
                  {transaction.titulo}
                </Text>
                <Text color='prussianBlue' fontSize='1.8rem' fontWeight='bold'>
                  {transaction.tipo === 'saida' ? '- ' : ''}
                  {formatarMoeda(transaction.valor)}
                </Text>
                <Flex alignItems='center' gap='0.4rem'>
                  <Image src={iconcalendar} alt='' width={16} height={16} />
                  <Text color='coolSteal' variant='caption'>
                    {formatarData(transaction.criadoEm)}
                  </Text>
                  <Image src={iconclock} alt='' width={16} height={16} />
                  <Text color='coolSteal' variant='caption'>
                    {formatarHora(transaction.criadoEm)}
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          )
        })}
      </Flex>
    </Flex>
  )
}

export default Carteira

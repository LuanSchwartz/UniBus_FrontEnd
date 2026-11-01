import { Button, Flex, Text } from '@nexpy/design-system'
import Image from 'next/image'
import { useState } from 'react'

import icone_carteira from '../../../icons/icone_carteira.svg'
import seta_cima from '../../../icons/seta_cima.svg'
import seta_baixo from '../../../icons/seta_baixo.svg'
import aguardando from '../../../icons/aguardando.svg'
import iconcalendar from '../../../icons/iconcalendar.svg'
import iconclock from '../../../icons/iconclock.svg'
import wallet_wave from '../../../icons/wallet_wave.svg'

type TransactionStatus = 'deposit' | 'trip' | 'pending'

type Transaction = {
  title: string
  amount: string
  date: string
  time: string
  status: TransactionStatus
}

const transactions: Transaction[] = [
  {
    title: 'Último depósito',
    amount: 'R$ 50,00',
    date: '26 de ago. de 2026',
    time: '14:32',
    status: 'deposit',
  },
  {
    title: 'Última passagem',
    amount: 'R$ 2,00',
    date: '25 de ago. de 2026',
    time: '22:32',
    status: 'trip',
  },
  {
    title: 'Aguardando Confirmação',
    amount: 'R$ 20,00',
    date: '25 de ago. de 2026',
    time: '22:32',
    status: 'pending',
  },
]

const transactionVisual = {
  deposit: { background: 'turfeGreen', icon: seta_cima },
  trip: { background: 'snow2', icon: seta_baixo },
  pending: { background: 'ochre', icon: aguardando },
} as const

const Carteira = () => {
  const [balance, setBalance] = useState(125.5)

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
              {balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </Text>
          </Flex>
          <Button
            onClick={() => setBalance(value => value + 10)}
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
        {transactions.map(transaction => {
          const visual = transactionVisual[transaction.status]

          return (
            <Flex
              key={`${transaction.title}-${transaction.date}`}
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
                  {transaction.title}
                </Text>
                <Text color='prussianBlue' fontSize='1.8rem' fontWeight='bold'>
                  {transaction.amount}
                </Text>
                <Flex alignItems='center' gap='0.4rem'>
                  <Image src={iconcalendar} alt='' width={16} height={16} />
                  <Text color='coolSteal' variant='caption'>
                    {transaction.date}
                  </Text>
                  <Image src={iconclock} alt='' width={16} height={16} />
                  <Text color='coolSteal' variant='caption'>
                    {transaction.time}
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

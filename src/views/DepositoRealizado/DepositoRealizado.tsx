import { Flex, Text } from '@nexpy/design-system'
import Image from 'next/image'
import { useRouter } from 'next/router'

import iconcalendar from '../../../icons/iconcalendar.svg'
import iconclock from '../../../icons/iconclock.svg'
import icone_certo from '../../../icons/icone_certo.svg'
import carteira_azul from '../../../icons/carteira_azul.svg'
import seta_cima from '../../../icons/seta_cima.svg'

const formatCurrency = (amount: number) =>
  amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const deposits = [
  { amount: 50, date: '26 de ago. de 2026', time: '11:22' }
]

const DepositoRealizado = () => {
  const router = useRouter()
  const queryAmount = Number(router.query.amount)
  const amount = Number.isFinite(queryAmount) && queryAmount > 0 ? queryAmount : 50

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
          aria-label='Voltar para o perfil'
          onClick={() => router.back()}
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
          bg='turfeGreen'
          borderRadius='1.6rem'
          gap='1rem'
          p='1.2rem'
        >
          <Flex
            alignItems='center'
            bg='#10B981'
            borderRadius='50%'
            h='3.6rem'
            justifyContent='center'
            minWidth='3.6rem'
            w='3.6rem'
          >
            <Image src={icone_certo} alt='Ícone de confirmação'/>
          </Flex>
          <Flex direction='column' gap='0.2rem'>
            <Text color='prussianBlue' fontWeight='bold'>
              Depósito realizado!
            </Text>
            <Text color='blueSlate' variant='caption'>
              Seu saldo foi atualizado com sucesso.
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
              {formatCurrency(amount)}
            </Text>
          </Flex>
          <Flex justifyContent='space-between'>
            <Text color='coolSteal' variant='caption'>Data</Text>
            <Text color='prussianBlue' variant='caption'>26 de ago. de 2026</Text>
          </Flex>
          <Flex justifyContent='space-between'>
            <Text color='coolSteal' variant='caption'>Horário</Text>
            <Text color='prussianBlue' variant='caption'>14:32</Text>
          </Flex>
        </Flex>

        <Text color='prussianBlue' fontSize='1.2rem' fontWeight='bold'>
          Histórico de depósitos
        </Text>

        {[{ amount, date: '26 de ago. de 2026', time: '14:32' }, ...deposits].map(
          (deposit, index) => (
            <Flex
              key={`${deposit.date}-${deposit.time}-${index}`}
              alignItems='center'
              border='1px solid #E2E8F0'
              borderRadius='1.6rem'
              gap='1rem'
              p='1rem'
            >
              <Flex
                alignItems='center'
                bg='turfeGreen'
                borderRadius='50%'
                h='4rem'
                justifyContent='center'
                minWidth='4rem'
                w='4rem'
              >
                <Image src={seta_cima} alt='Ícone de seta para cima' width={18} height={18} />
              </Flex>
              <Flex direction='column' gap='0.2rem'>
                <Text color='prussianBlue' fontWeight='bold'>
                  {formatCurrency(deposit.amount)}
                </Text>
                <Flex alignItems='center' gap='0.3rem'>
                  <Image src={iconcalendar} alt='' width={12} height={12} />
                  <Text color='coolSteal' fontSize='0.9rem'>{deposit.date}</Text>
                  <Text color='coolSteal' fontSize='0.9rem'>•</Text>
                  <Image src={iconclock} alt='' width={12} height={12} />
                  <Text color='coolSteal' fontSize='0.9rem'>{deposit.time}</Text>
                </Flex>
              </Flex>
            </Flex>
          ),
        )}
      </Flex>
    </Flex>
  )
}

export default DepositoRealizado

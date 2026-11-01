import { Flex, Text } from '@nexpy/design-system'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/router'

import icone_carteira from '../../../icons/icone_carteira.svg'

const amounts = [20, 50, 100, 200, 500] as const

const formatCurrency = (amount: number) =>
  amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const DepositarPix = () => {
  const router = useRouter()
  const [pixKey, setPixKey] = useState('')
  const [selectedAmount, setSelectedAmount] = useState<number | null>(20)
  const [customAmount, setCustomAmount] = useState('')

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
          Depositar Dinheiro
        </Text>
      </Flex>

      <Flex direction='column' gap='1.8rem' p='2.2rem 2rem'>
        <Flex direction='column' gap='0.5rem'>
          <Text color='prussianBlue' fontSize='1.5rem' fontWeight='bold'>
            Chave Pix
          </Text>
          <Text color='coolSteal' fontSize='1.1rem'>
            CPF, e-mail ou número de telefone.
          </Text>
          <Flex
            alignItems='center'
            bg='systemWhite'
            borderColor='paleSlate'
            borderRadius='1.2rem'
            borderStyle='solid'
            borderWidth='1px'
            justifyContent='space-between'
            mt='0.2rem'
            p='1rem'
          >
            <Flex direction='column' flex={1} gap='0.2rem'>
              <Text color='coolSteal' fontSize='1rem'>
                Chave
              </Text>
              <input
                type='text'
                value={pixKey}
                onChange={event => setPixKey(event.target.value)}
                placeholder='Digite a chave Pix'
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#132A4D',
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  outline: 'none',
                  padding: 0,
                  width: '100%',
                  appearance: 'textfield',
                }}
              />
            </Flex>
            <button
              type='button'
              aria-label='Limpar chave Pix'
              onClick={() => setPixKey('')}
              style={{
                alignItems: 'center',
                background: '#CBD5E1',
                border: 'none',
                borderRadius: '50%',
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                fontSize: '1.2rem',
                height: '1.8rem',
                justifyContent: 'center',
                width: '1.8rem',
              }}
            >
              ×
            </button>
          </Flex>
        </Flex>

        <Flex direction='column' gap='0.5rem'>
          <Text color='prussianBlue' fontSize='1.5rem' fontWeight='bold'>
            Escolha o valor
          </Text>
          <Text color='coolSteal' fontSize='1.1rem'>
            Selecione um valor ou digite o montante desejado.
          </Text>
          <Flex flexWrap='wrap' gap='0.8rem' mt='0.2rem'>
            {amounts.map(amount => {
              const isSelected = selectedAmount === amount

              return (
                <button
                  key={amount}
                  type='button'
                  onClick={() => {
                    setSelectedAmount(amount)
                    setCustomAmount('')
                  }}
                  style={{
                    background: isSelected ? '#2874E8' : '#FFFFFF',
                    border: isSelected ? 'none' : '1px solid #CBD5E1',
                    borderRadius: '2rem',
                    boxShadow: isSelected ? '0 3px 6px rgba(40, 116, 232, 0.25)' : 'none',
                    color: isSelected ? '#FFFFFF' : '#334155',
                    cursor: 'pointer',
                    flex: '1 1 28%',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    minHeight: '3.2rem',
                    padding: '0.6rem 1rem',
                  }}
                >
                  {formatCurrency(amount)}
                </button>
              )
            })}
            <button
              type='button'
              onClick={() => setSelectedAmount(null)}
              style={{
                background: selectedAmount === null ? '#2874E8' : '#FFFFFF',
                border: selectedAmount === null ? 'none' : '1px solid #CBD5E1',
                borderRadius: '2rem',
                color: selectedAmount === null ? '#FFFFFF' : '#64748B',
                cursor: 'pointer',
                flex: '1 1 28%',
                fontSize: '1.1rem',
                minHeight: '3.2rem',
                padding: '0.6rem 1rem',
              }}
            >
              Outro valor
            </button>
          </Flex>
        </Flex>

        <Flex
          alignItems='center'
          bg='systemWhite'
          borderColor='paleSlate'
          borderRadius='1.2rem'
          borderStyle='solid'
          borderWidth='1px'
          justifyContent='space-between'
          mt='-0.4rem'
          p='1rem'
        >
          <Flex direction='column' flex={1} gap='0.2rem'>
            <Text color='coolSteal' fontSize='1rem'>
              Valor selecionado
            </Text>
            {selectedAmount === null ? (
              <input
                type='text'
                inputMode='decimal'
                value={customAmount}
                onChange={event => setCustomAmount(event.target.value)}
                placeholder='Digite o valor'
                autoFocus
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#132A4D',
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  outline: 'none',
                  padding: 0,
                  width: '100%',
                }}
              />
            ) : (
              <Text color='prussianBlue' fontWeight='bold'>
                {formatCurrency(selectedAmount)}
              </Text>
            )}
          </Flex>
          <button
            type='button'
            aria-label='Limpar valor'
            onClick={() => {
              setSelectedAmount(null)
              setCustomAmount('')
            }}
            style={{
              alignItems: 'center',
              background: '#CBD5E1',
              border: 'none',
              borderRadius: '50%',
              color: '#FFFFFF',
              cursor: 'pointer',
              display: 'flex',
              fontSize: '1.2rem',
              height: '1.8rem',
              justifyContent: 'center',
              width: '1.8rem',
            }}
          >
            ×
          </button>
        </Flex>

        <button
          type='button'
          onClick={() => {
            const amount = selectedAmount ?? Number(customAmount.replace(',', '.'))

            router.push({
              pathname: '/deposito_realizado',
              query: { amount: Number.isFinite(amount) ? amount : 0 },
            })
          }}
          style={{
            alignItems: 'center',
            background: '#2874E8',
            border: 'none',
            borderRadius: '1rem',
            boxShadow: '0 4px 8px rgba(40, 116, 232, 0.35)',
            color: '#FFFFFF',
            cursor: 'pointer',
            display: 'flex',
            fontSize: '1.2rem',
            gap: '0.5rem',
            justifyContent: 'center',
            minHeight: '4.4rem',
            marginTop: '0.5rem',
          }}
        >
          <Image src={icone_carteira} alt='' width={16} height={16} />
          Continuar
        </button>
      </Flex>
    </Flex>
  )
}

export default DepositarPix

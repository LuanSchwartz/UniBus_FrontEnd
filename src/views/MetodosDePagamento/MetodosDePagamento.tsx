import { Flex, Text } from '@nexpy/design-system'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { z } from 'zod'

import iconcardactive from '../../../icons/iconcardactive.svg'

const luhnCheck = (value: string) => {
  let sum = 0
  let shouldDouble = false

  for (let index = value.length - 1; index >= 0; index -= 1) {
    let digit = Number(value[index])

    if (shouldDouble) {
      digit *= 2
      if (digit > 9) digit -= 9
    }

    sum += digit
    shouldDouble = !shouldDouble
  }

  return sum % 10 === 0
}

const cardSchema = z
  .object({
    number: z
      .string()
      .regex(/^\d{16}$/, 'Informe os 16 números do cartão.')
      .refine(luhnCheck, 'Informe um número de cartão válido.'),
    expiry: z
      .string()
      .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Use o formato MM/AA.'),
    cvv: z.string().regex(/^\d{3,4}$/, 'O CVV deve ter 3 ou 4 números.'),
    name: z.string().trim().min(3, 'Informe o nome impresso no cartão.'),
  })

const MetodosDePagamento = () => {
  const router = useRouter()
  const [isAddingCard, setIsAddingCard] = useState(false)
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const updateCard = (field: keyof typeof card, value: string) => {
    setCard(current => ({ ...current, [field]: value }))
    setErrors(current => ({ ...current, [field]: '' }))
  }

  const handleSaveCard = (event: { preventDefault: () => void }) => {
    event.preventDefault()

    const result = cardSchema.safeParse({
      ...card,
      number: card.number.replace(/\D/g, ''),
    })

    if (!result.success) {
      const nextErrors: Record<string, string> = {}

      result.error.issues.forEach(issue => {
        const field = String(issue.path[0] ?? 'form')
        if (!nextErrors[field]) nextErrors[field] = issue.message
      })

      setErrors(nextErrors)
      return
    }

    setErrors({})
    setIsAddingCard(false)
  }

  return (
    <Flex direction='column' bg='grey200' minHeight='100vh' pb='10rem'>
      <Flex
        bg='systemWhite'
        alignItems='center'
        justifyContent='center'
        p='2rem'
        position='relative'
      >
        <button
          type='button'
          aria-label={isAddingCard ? 'Voltar para métodos de pagamento' : 'Voltar para o perfil'}
          onClick={() => (isAddingCard ? setIsAddingCard(false) : router.back())}
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
        <Text color='prussianBlue' fontSize='2rem' fontWeight='bold'>
          {isAddingCard ? 'Adicionar cartão' : 'Métodos de pagamento'}
        </Text>
      </Flex>

      <Flex direction='column' alignItems='center' p='1.2rem 2rem 2.8rem'>
        <Text color='blueSlate' variant='caption' textAlign='center'>
          {isAddingCard ? (
            <>
              Cadastre um cartão de crédito para
              <br />
              facilitar seus pagamentos.
            </>
          ) : (
            <>
              Gerencie as formas de pagamento
              <br />
              usadas no aplicativo.
            </>
          )}
        </Text>
      </Flex>

      <Flex
        as='form'
        direction='column'
        gap='1.4rem'
        px='2rem'
        pt='0.5rem'
        style={{ display: isAddingCard ? 'flex' : 'none' }}
        onSubmit={handleSaveCard}
      >
          <Flex direction='column' gap='0.5rem'>
            <Text color='prussianBlue' fontWeight='bold'>Número do cartão</Text>
            <input
              type='text'
              inputMode='numeric'
              placeholder='0000 0000 0000 0000'
              value={card.number.replace(/(\d{4})(?=\d)/g, '$1 ')}
              onChange={event => updateCard('number', event.target.value.replace(/\D/g, '').slice(0, 16))}
              style={{
                border: '1px solid #CBD5E1',
                borderRadius: '1rem',
                fontSize: '1.2rem',
                minHeight: '4.6rem',
                padding: '0 1.2rem',
              }}
            />
            {errors.number && <Text color='systemDanger' variant='caption'>{errors.number}</Text>}
          </Flex>
          <Flex gap='1rem'>
            <Flex direction='column' flex={1} gap='0.5rem'>
              <Text color='prussianBlue' fontWeight='bold'>Validade</Text>
              <input
                type='text'
                inputMode='numeric'
                placeholder='MM/AA'
                value={card.expiry}
                onChange={event => {
                  const value = event.target.value.replace(/\D/g, '').slice(0, 4)
                  updateCard('expiry', value.length > 2 ? `${value.slice(0, 2)}/${value.slice(2)}` : value)
                }}
                style={{
                  border: '1px solid #CBD5E1',
                  borderRadius: '1rem',
                  fontSize: '1.2rem',
                  minHeight: '4.6rem',
                  padding: '0 1.2rem',
                  width: '100%',
                }}
              />
              {errors.expiry && <Text color='systemDanger' variant='caption'>{errors.expiry}</Text>}
            </Flex>
            <Flex direction='column' flex={1} gap='0.5rem'>
              <Text color='prussianBlue' fontWeight='bold'>CVV</Text>
              <input
                type='password'
                inputMode='numeric'
                placeholder='123'
                value={card.cvv}
                onChange={event => updateCard('cvv', event.target.value.replace(/\D/g, '').slice(0, 4))}
                style={{
                  border: '1px solid #CBD5E1',
                  borderRadius: '1rem',
                  fontSize: '1.2rem',
                  minHeight: '4.6rem',
                  padding: '0 1.2rem',
                  width: '100%',
                }}
              />
              {errors.cvv && <Text color='systemDanger' variant='caption'>{errors.cvv}</Text>}
            </Flex>
          </Flex>
          <Flex direction='column' gap='0.5rem'>
            <Text color='prussianBlue' fontWeight='bold'>Nome impresso no cartão</Text>
            <input
              type='text'
              placeholder='Nome completo'
              value={card.name}
              onChange={event => updateCard('name', event.target.value)}
              style={{
                border: '1px solid #CBD5E1',
                borderRadius: '1rem',
                fontSize: '1.2rem',
                minHeight: '4.6rem',
                padding: '0 1.2rem',
                width: '100%',
              }}
            />
            {errors.name && <Text color='systemDanger' variant='caption'>{errors.name}</Text>}
          </Flex>
          <button
            type='submit'
            style={{
              background: '#2167E8',
              border: 'none',
              borderRadius: '1rem',
              color: '#FFFFFF',
              cursor: 'pointer',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              minHeight: '4.8rem',
              marginTop: '0.8rem',
            }}
          >
            Salvar cartão
          </button>
        </Flex>
      <Flex
        direction='column'
        gap='1rem'
        px='2rem'
        style={{ display: isAddingCard ? 'none' : 'flex' }}
      >
        <Text color='prussianBlue' fontWeight='bold'>
          Métodos salvos
        </Text>

        <Flex
          alignItems='center'
          bg='systemWhite'
          border='1px solid #CBD5E1'
          borderRadius='1.2rem'
          gap='1.2rem'
          p='1.4rem'
        >
          <Flex
            alignItems='center'
            bg='#CBD5E1'
            borderRadius='1rem'
            h='4rem'
            justifyContent='center'
            minWidth='4rem'
            w='4rem'
          >
            <Image src={iconcardactive} alt='Ícone de cartão' width={20} height={20} />
          </Flex>
          <Flex direction='column' flex={1} gap='0.3rem'>
            <Text color='prussianBlue' fontWeight='bold'>
              Cartão cadastrado
            </Text>
            <Text color='blueSlate' variant='caption'>
              Final **** 1234
            </Text>
          </Flex>
          <Text color='systemSafe' fontSize='1.2rem' fontWeight='bold'>
            Ativo
          </Text>
        </Flex>

        <button
          type='button'
          onClick={() => setIsAddingCard(true)}
          style={{
            alignItems: 'center',
            background: '#FFFFFF',
            border: '1px dashed #94A3B8',
            borderRadius: '1.2rem',
            color: '#2F5FD8',
            cursor: 'pointer',
            display: 'flex',
            fontSize: '1.3rem',
            fontWeight: 'bold',
            gap: '0.8rem',
            justifyContent: 'center',
            minHeight: '5rem',
            marginTop: '0.8rem',
          }}
        >
          <Text fontSize='2rem' lineHeight='1.2' style={{ color: '#2F5FD8' }}>
            +
          </Text>
          Adicionar método de pagamento
        </button>

        <Flex
          bg='aliceBlue'
          borderRadius='1.2rem'
          direction='column'
          gap='0.4rem'
          mt='1.2rem'
          p='1.4rem'
        >
          <Text color='royalAzure' fontWeight='bold'>
            Pagamentos seguros
          </Text>
          <Text color='blueSlate' variant='caption'>
            Seus dados de pagamento são protegidos e usados somente para facilitar suas viagens.
          </Text>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default MetodosDePagamento

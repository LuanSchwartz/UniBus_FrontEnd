import { Flex, Text } from '@nexpy/design-system'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { QRCodeSVG } from 'qrcode.react'

import {
  PIX_CHAVE,
  RECARGA_MINIMA,
  formatarMoeda,
  normalizarValor,
  pixCopiaECola,
  solicitarRecarga,
} from '@/services/carteiraService'

import icone_carteira from '../../../icons/icone_carteira.svg'

const amounts = [20, 50, 100, 200, 500] as const

const primaryButton = {
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
} as const

const copyButton = {
  background: 'transparent',
  border: '1px solid #2874E8',
  borderRadius: '0.8rem',
  color: '#2874E8',
  cursor: 'pointer',
  fontSize: '1.1rem',
  fontWeight: 'bold',
  padding: '0.6rem 1rem',
  whiteSpace: 'nowrap',
} as const

const DepositarPix = () => {
  const router = useRouter()
  const [selectedAmount, setSelectedAmount] = useState<number | null>(20)
  const [customAmount, setCustomAmount] = useState('')
  const [amountError, setAmountError] = useState('')
  const [payment, setPayment] = useState<{ valor: string; chaveIdempotencia: string } | null>(null)
  const [copied, setCopied] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  const handleContinue = () => {
    const valor = normalizarValor(selectedAmount === null ? customAmount : String(selectedAmount))

    if (!valor) {
      setAmountError('Informe um valor válido, com até duas casas decimais. Ex.: 35,50')
      return
    }
    if (Number(valor) < RECARGA_MINIMA) {
      setAmountError(`O depósito mínimo é ${formatarMoeda(RECARGA_MINIMA)}.`)
      return
    }

    // Uma chave por pedido: se o envio falhar e o estudante tentar de novo, o back não duplica a recarga.
    setPayment({ valor, chaveIdempotencia: crypto.randomUUID() })
  }

  const copy = async (label: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(label)
    } catch {
      setCopied('')
    }
  }

  const handleConfirmPayment = async () => {
    if (!payment) return
    setErro('')
    setEnviando(true)
    try {
      const recarga = await solicitarRecarga(payment.valor, payment.chaveIdempotencia)
      await router.push({ pathname: '/deposito_realizado', query: { id: recarga.id } })
    } catch (error) {
      setErro((error as Error).message)
    } finally {
      setEnviando(false)
    }
  }

  const codigoPix = payment ? pixCopiaECola(payment.valor) : ''

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
          aria-label={payment ? 'Voltar para a escolha do valor' : 'Voltar para a carteira'}
          onClick={() => (payment ? setPayment(null) : router.back())}
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

      {!payment && (
        <Flex direction='column' gap='1.8rem' p='2.2rem 2rem'>
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
                    aria-pressed={isSelected}
                    onClick={() => {
                      setSelectedAmount(amount)
                      setCustomAmount('')
                      setAmountError('')
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
                    {formatarMoeda(amount)}
                  </button>
                )
              })}
              <button
                type='button'
                aria-pressed={selectedAmount === null}
                onClick={() => {
                  setSelectedAmount(null)
                  setAmountError('')
                }}
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
            borderColor={amountError ? 'systemDanger' : 'paleSlate'}
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
                  aria-label='Valor do depósito em reais'
                  value={customAmount}
                  onChange={event => {
                    setCustomAmount(event.target.value)
                    setAmountError('')
                  }}
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
                  {formatarMoeda(selectedAmount)}
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

          {amountError && (
            <Text color='systemDanger' variant='caption' role='alert' mt='-1rem'>
              {amountError}
            </Text>
          )}

          <button type='button' onClick={handleContinue} style={primaryButton}>
            <Image src={icone_carteira} alt='' width={16} height={16} />
            Continuar
          </button>
        </Flex>
      )}

      {payment && (
        <Flex direction='column' gap='1.6rem' p='2.2rem 2rem'>
          <Flex direction='column' alignItems='center' gap='0.4rem'>
            <Text color='coolSteal'>Valor do depósito</Text>
            <Text color='prussianBlue' fontSize='2.8rem' fontWeight='bold'>
              {formatarMoeda(payment.valor)}
            </Text>
            <Text color='blueSlate' variant='caption' textAlign='center'>
              Pague pelo app do seu banco lendo o QR code ou usando o Pix copia e cola.
            </Text>
          </Flex>

          <Flex
            alignSelf='center'
            bg='systemWhite'
            borderRadius='1.6rem'
            boxShadow='0 4px 12px rgba(21, 28, 42, 0.06)'
            p='1.6rem'
          >
            <QRCodeSVG value={codigoPix} size={200} title='QR code do Pix' />
          </Flex>

          <Flex direction='column' gap='0.8rem' bg='systemWhite' borderRadius='1.6rem' p='1.4rem'>
            <Flex alignItems='center' gap='1rem' justifyContent='space-between'>
              <Flex direction='column' gap='0.2rem' minWidth={0}>
                <Text color='coolSteal' fontSize='1rem'>
                  Chave Pix
                </Text>
                <Text color='prussianBlue' fontWeight='bold' style={{ overflowWrap: 'anywhere' }}>
                  {PIX_CHAVE}
                </Text>
              </Flex>
              <button type='button' onClick={() => copy('chave', PIX_CHAVE)} style={copyButton}>
                {copied === 'chave' ? 'Copiada!' : 'Copiar'}
              </button>
            </Flex>
            <Flex alignItems='center' gap='1rem' justifyContent='space-between'>
              <Flex direction='column' gap='0.2rem' minWidth={0}>
                <Text color='coolSteal' fontSize='1rem'>
                  Pix copia e cola
                </Text>
                <Text color='blueSlate' fontSize='1rem' style={{ overflowWrap: 'anywhere' }}>
                  {codigoPix}
                </Text>
              </Flex>
              <button type='button' onClick={() => copy('codigo', codigoPix)} style={copyButton}>
                {copied === 'codigo' ? 'Copiado!' : 'Copiar'}
              </button>
            </Flex>
          </Flex>

          <Text color='blueSlate' variant='caption' textAlign='center'>
            Depois de pagar, toque em &quot;Já fiz o Pix&quot;. A secretaria confere o pagamento e o
            saldo é liberado após a aprovação.
          </Text>

          {erro && (
            <Text color='systemDanger' textAlign='center' role='alert'>
              {erro}
            </Text>
          )}

          <button
            type='button'
            onClick={handleConfirmPayment}
            disabled={enviando}
            style={{ ...primaryButton, opacity: enviando ? 0.7 : 1 }}
          >
            <Image src={icone_carteira} alt='' width={16} height={16} />
            {enviando ? 'Enviando...' : 'Já fiz o Pix'}
          </button>
        </Flex>
      )}
    </Flex>
  )
}

export default DepositarPix

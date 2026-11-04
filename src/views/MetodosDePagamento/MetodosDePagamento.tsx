import { Flex, Text } from '@nexpy/design-system'
import Image from 'next/image'
import { useRouter } from 'next/router'

import { RECARGA_MINIMA, formatarMoeda } from '@/services/carteiraService'

import icone_carteira from '../../../icons/icone_carteira.svg'
import iconclock from '../../../icons/iconclock.svg'
import iconpin from '../../../icons/iconpin.svg'
import iconpix from '../../../icons/iconpix.svg'

// Regras do back (branch dev): tarifa padrão do trecho e limite de crédito da carteira.
const TARIFA_PADRAO = 2
const LIMITE_NEGATIVO = 20

const MetodosDePagamento = () => {
  const router = useRouter()

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
        <Text color='prussianBlue' fontSize='2rem' fontWeight='bold'>
          Formas de pagamento
        </Text>
      </Flex>

      <Flex direction='column' alignItems='center' p='1.2rem 2rem 2.4rem'>
        <Text color='blueSlate' variant='caption' textAlign='center'>
          Veja como colocar saldo na sua carteira
          <br />
          e como ele é usado nas viagens.
        </Text>
      </Flex>

      <Flex direction='column' gap='1.4rem' px='2rem'>
        <Flex
          direction='column'
          bg='systemWhite'
          border='1px solid #2874E8'
          borderRadius='1.6rem'
          boxShadow='0 4px 12px rgba(21, 28, 42, 0.06)'
          gap='1rem'
          p='1.6rem'
        >
          <Flex alignItems='center' gap='1.2rem'>
            <Flex
              alignItems='center'
              bg='royalAzure'
              borderRadius='50%'
              h='4rem'
              justifyContent='center'
              minWidth='4rem'
              w='4rem'
            >
              <Image src={iconpix} alt='' width={20} height={20} />
            </Flex>
            <Flex direction='column' gap='0.2rem'>
              <Text color='prussianBlue' fontWeight='bold'>
                Pix pelo aplicativo
              </Text>
              <Text color='blueSlate' variant='caption'>
                Valor mínimo de {formatarMoeda(RECARGA_MINIMA)}
              </Text>
            </Flex>
          </Flex>
          <Text color='blueSlate' variant='caption' lineHeight='1.4'>
            Escolha o valor, pague com o QR code ou o Pix copia e cola e toque em &quot;Já fiz o
            Pix&quot;. A secretaria confere o pagamento e libera o saldo após a aprovação.
          </Text>
          <button
            type='button'
            onClick={() => router.push('/depositar_pix')}
            style={{
              alignItems: 'center',
              background: '#2874E8',
              border: 'none',
              borderRadius: '1rem',
              color: '#FFFFFF',
              cursor: 'pointer',
              display: 'flex',
              fontSize: '1.3rem',
              fontWeight: 'bold',
              gap: '0.6rem',
              justifyContent: 'center',
              minHeight: '4.4rem',
            }}
          >
            <Image src={icone_carteira} alt='' width={16} height={16} />
            Depositar via Pix
          </button>
        </Flex>

        <Flex
          direction='column'
          bg='systemWhite'
          borderRadius='1.6rem'
          boxShadow='0 4px 12px rgba(21, 28, 42, 0.06)'
          gap='1rem'
          p='1.6rem'
        >
          <Flex direction='column' gap='0.2rem'>
            <Text color='prussianBlue' fontWeight='bold'>
              Dinheiro na secretaria
            </Text>
            <Text color='blueSlate' variant='caption'>
              Pagamento presencial, com saldo creditado na hora.
            </Text>
          </Flex>
          <Flex alignItems='center' gap='0.8rem'>
            <Image src={iconclock} alt='' width={16} height={16} />
            <Text color='blueSlate' variant='caption'>
              Segunda a sexta, das 08:00 às 17:00
            </Text>
          </Flex>
          <Flex alignItems='flex-start' gap='0.8rem'>
            <Image src={iconpin} alt='' width={16} height={16} />
            <Text color='blueSlate' variant='caption'>
              Secretaria de Educação - Rua Maximiano Tupinambá da Costa, s/nº
            </Text>
          </Flex>
        </Flex>

        <Flex bg='aliceBlue' borderRadius='1.6rem' direction='column' gap='0.6rem' p='1.6rem'>
          <Text color='royalAzure' fontWeight='bold'>
            Como o saldo é usado
          </Text>
          <Text color='blueSlate' variant='caption' lineHeight='1.4'>
            • A passagem (normalmente {formatarMoeda(TARIFA_PADRAO)} por trecho) é descontada quando
            você confirma presença.
          </Text>
          <Text color='blueSlate' variant='caption' lineHeight='1.4'>
            • Se cancelar dentro do prazo, o valor volta para a carteira.
          </Text>
          <Text color='blueSlate' variant='caption' lineHeight='1.4'>
            • Você pode ficar com saldo negativo de até {formatarMoeda(LIMITE_NEGATIVO)}.
          </Text>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default MetodosDePagamento

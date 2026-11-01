import { Flex, Text } from '@nexpy/design-system'
import Image from 'next/image'
import { useRouter } from 'next/router'

import icone_atencao from '../../../icons/icone_atencao.svg'
import icone_carteira from '../../../icons/icone_carteira.svg'
import iconpin from '../../../icons/iconpin.svg'
import iconpix from '../../../icons/iconpix.svg'
import wallet_wave from '../../../icons/wallet_wave.svg'

const DepositarDinheiro = () => {
  const router = useRouter()

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

      <Flex direction='column' gap='1.2rem' px='2rem' pt='2.2rem'>
        <Flex
          direction='column'
          bg='prussianBlue'
          borderRadius='2.4rem'
          boxShadow='0 10px 20px rgba(21, 42, 77, 0.20)'
          gap='1.2rem'
          h='15.7rem'
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
          <Flex direction='column' gap='0.4rem' position='relative' zIndex={1}>
            <Flex alignItems='center' gap='0.6rem'>
              <Image src={icone_carteira} alt='Ícone da carteira' width={16} height={16} />
              <Text color='paleSlate'>Saldo atual</Text>
            </Flex>
            <Text color='systemWhite' fontSize='3.4rem' fontWeight='bold'>
              R$ 125,50
            </Text>
          </Flex>
        </Flex>

        <button
          type='button'
          onClick={() => router.push('/depositar_pix')}
          style={{
            alignItems: 'center',
            background: '#FFFFFF',
            border: 'none',
            borderRadius: '1.8rem',
            boxShadow: '0 4px 12px rgba(21, 28, 42, 0.06)',
            cursor: 'pointer',
            display: 'flex',
            gap: '1.2rem',
            minHeight: '6.4rem',
            padding: '1.2rem',
            textAlign: 'left',
            width: '100%',
          }}
        >
          <Flex
            alignItems='center'
            bg='royalAzure'
            borderRadius='50%'
            h='3.6rem'
            justifyContent='center'
            minWidth='3.6rem'
            w='3.6rem'
          >
            <Image src={iconpix} alt='Ícone do Pix' width={20} height={20} />
          </Flex>
          <Text color='prussianBlue' fontWeight='bold'>
            Pix
          </Text>
        </button>

        <Flex
          bg='aliceBlue'
          borderRadius='1.8rem'
          direction='column'
          gap='0.8rem'
          mt='1rem'
          p='1.8rem'
        >
          <Image src={icone_atencao} alt='Ícone da carteira' width={16} height={16} />
          <Text color='blueSlate' lineHeight='1.25'>
            <Text as='span' color='prussianBlue' fontWeight='bold'>
              Atenção,
            </Text>
            <br />
            Depósitos em dinheiro somente presencialmente na secretaria.
          </Text>
          <Text color='blueSlate' lineHeight='1.25'>
            <Text as='span' color='prussianBlue' fontWeight='bold'>
              Horários de funcionamento:
            </Text>
            <br />
            Seg a Sex: 08:00 às 17:00
          </Text>
          <Text color='blueSlate' fontStyle='italic' lineHeight='1.25' variant='caption'>
            Lembre-se, Sábado, Domingo e feriados a secretaria não abre.
          </Text>
        </Flex>

        <Flex alignItems='flex-start' gap='1rem' mt='2.4rem' px='0.5rem'>
          <Image src={iconpin} alt='Localização' width={20} height={20} />
          <Text color='blueSlate' fontSize='1.1rem'>
            Secretaria de Educação - Rua Maximiano Tupinambá da Costa, s/nº
          </Text>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default DepositarDinheiro

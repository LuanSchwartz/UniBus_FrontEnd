import { Flex, Text } from '@nexpy/design-system'
import Image from 'next/image'
import { useRouter } from 'next/router'

import logo_sair from '../../../icons/logo_sair.svg'
import logo_sair_2 from '../../../icons/logo_sair_2.svg'

const SairConta = () => {
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
          Sair da conta
        </Text>
      </Flex>

      <Flex direction='column' alignItems='center' p='1.2rem 2rem 2.4rem'>
        <Text color='blueSlate' variant='caption' textAlign='center'>
          Encerre sua sessão
          <br />no aplicativo.
        </Text>
      </Flex>
      <Flex direction='column' alignItems='center' p='0 2rem 2.4rem'>
        <Flex
          alignItems='center'
          border='1px solid #E2E8F0'
          borderRadius='1.4rem'
          h='10.8rem'
          justifyContent='center'
          mt='8.5rem'
          w='10.8rem'
        >
          <Image src={logo_sair} alt='Logo Sair da Conta' width={60} height={60} />
        </Flex>

        <Text
          color='prussianBlue'
          fontSize='1.8rem'
          fontWeight='bold'
          mt='2rem'
          textAlign='center'
        >
          Tem certeza de que deseja
          <br />
          sair da sua conta?
        </Text>

        <Text color='blueSlate' fontSize='1.5rem' mt='3.2rem' textAlign='center'>
          Você precisará fazer login novamente
          <br />
          para acessar o aplicativo.
        </Text>

        <button
          type='button'
          onClick={() => router.push('/')}
          style={{
            background: '#E91546',
            border: 'none',
            borderRadius: '1.2rem',
            boxShadow: '0 4px 8px rgba(233, 21, 70, 0.35)',
            color: '#FFFFFF',
            cursor: 'pointer',
            fontSize: '1.6rem',
            fontWeight: 'semibold',
            marginTop: '2.2rem',
            minHeight: '4.8rem',
            width: '23.5rem',
          }}
        >
          <span
            style={{
              alignItems: 'center',
              display: 'flex',
              gap: '0.6rem',
              justifyContent: 'center',
            }}
          >
            <Image src={logo_sair_2} alt='' width={20} height={20} />
            <span>Sair da conta</span>
          </span>
        </button>
      </Flex>
    </Flex>
  )
}

export default SairConta

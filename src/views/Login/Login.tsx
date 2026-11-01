import { Flex, Text } from '@nexpy/design-system'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'

import logo from '../../../icons/logo.svg'

const Login = () => {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  return (
    <Flex
      alignItems='center'
      bg='systemWhite'
      direction='column'
      minHeight='100vh'
      px='1.8rem'
      pt='2.4rem'
    >
      <Flex alignItems='center' direction='column' gap='0.2rem'>
        <Image src={logo} alt='Ônibus UniBus'/>
      </Flex>

      <Flex alignItems='center' direction='column' gap='0.4rem' mt='2.4rem'>
        <Text color='prussianBlue' fontSize='2rem' fontWeight='bold'>
          Faça seu login
        </Text>
        <Text color='blueSlate' fontSize='1.6rem'>
          para continuar
        </Text>
      </Flex>

      <Flex as='form' direction='column' gap='1rem' mt='2.8rem' w='100%' maxWidth='38rem'>
        <Flex direction='column' gap='0.5rem'>
          <Text color='prussianBlue' fontSize='1.5rem' fontWeight='bold'>
            E-mail
          </Text>
          <input
            type='email'
            placeholder='seuemail@exemplo.com'
            style={{
              border: '1px solid #CBD5E1',
              borderRadius: '0.8rem',
              fontSize: '1.2rem',
              minHeight: '3.8rem',
              padding: '0 1.2rem',
              width: '100%',
            }}
          />
        </Flex>

        <Flex direction='column' gap='0.5rem'>
          <Text color='prussianBlue' fontSize='1.5rem' fontWeight='bold'>
            Senha
          </Text>
          <Flex alignItems='center' border='1px solid #CBD5E1' borderRadius='0.8rem' minHeight='3.8rem' px='1rem'>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder='Sua senha'
              style={{ border: 'none', flex: 1, fontSize: '1.2rem', outline: 'none' }}
            />
            <button
              type='button'
              onClick={() => setShowPassword(value => !value)}
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748B',
                cursor: 'pointer',
                fontSize: '1.3rem',
                padding: 0,
              }}
            >
              {showPassword ? '◉' : '◉'}
            </button>
          </Flex>
        </Flex>

        <button
          type='button'
          style={{
            alignSelf: 'flex-end',
            background: 'transparent',
            border: 'none',
            color: '#1769E0',
            cursor: 'pointer',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            padding: 0,
          }}
        >
          Esqueceu sua senha?
        </button>

        <button
          type='button'
          onClick={() => router.push('/inicio')}
          style={{
            background: '#2167E8',
            border: 'none',
            borderRadius: '0.8rem',
            color: '#FFFFFF',
            cursor: 'pointer',
            fontSize: '1.4rem',
            fontWeight: 'bold',
            minHeight: '3.8rem',
          }}
        >
          Entrar
        </button>

        <Flex alignItems='center' gap='0.8rem' mt='0.2rem'>
          <Flex bg='paleSlate' flex={1} h='1px' />
          <Text color='coolSteal' fontSize='1.3rem'>
            ou
          </Text>
          <Flex bg='paleSlate' flex={1} h='1px' />
        </Flex>

        <button
          type='button'
          style={{
            alignItems: 'center',
            background: 'transparent',
            border: '1px solid #E2E8F0',
            borderRadius: '0.8rem',
            color: '#132A4D',
            cursor: 'pointer',
            display: 'flex',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            gap: '0.9rem',
            justifyContent: 'center',
            minHeight: '3.8rem',
          }}
        >
          <Text color='#4285F4' fontSize='1.7rem' fontWeight='bold'>
            G
          </Text>
          Entrar com Google
        </button>

        {/* <Text color='blueSlate' fontSize='1.2rem' textAlign='center' mt='1rem'>
          Ainda não tem uma conta?{' '}
          <Text as='span' color='#1769E0' fontWeight='bold'>
            Cadastre-se
          </Text>
        </Text> */}
      </Flex>
    </Flex>
  )
}

export default Login

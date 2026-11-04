import { Flex, Text } from '@nexpy/design-system'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { type FormEvent, useState } from 'react'

import { login } from '@/services/api'

import logo from '../../../icons/logo.svg'

const Login = () => {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setErro('')
    setEnviando(true)
    try {
      await login(email.trim(), senha)
      await router.push('/inicio')
    } catch (error) {
      setErro((error as Error).message)
    } finally {
      setEnviando(false)
    }
  }

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

      <Flex as='form' onSubmit={handleSubmit} direction='column' gap='1rem' mt='2.8rem' w='100%' maxWidth='38rem'>
        <Flex direction='column' gap='0.5rem'>
          <Text color='prussianBlue' fontSize='1.5rem' fontWeight='bold'>
            E-mail
          </Text>
          <input
            type='email'
            required
            autoComplete='email'
            value={email}
            onChange={event => setEmail(event.target.value)}
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
              required
              autoComplete='current-password'
              value={senha}
              onChange={event => setSenha(event.target.value)}
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

        {erro && (
          <Text color='systemDanger' fontSize='1.3rem' role='alert'>
            {erro}
          </Text>
        )}

        <button
          type='submit'
          disabled={enviando}
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
          {enviando ? 'Entrando...' : 'Entrar'}
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

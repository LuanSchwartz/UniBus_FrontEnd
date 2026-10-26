import { Flex, Text } from '@nexpy/design-system'
import Image from 'next/image'
import { useRouter } from 'next/router'
import type { ReactNode } from 'react'

import iconArrowRight from '../../../icons/iconarrow.svg'
import iconPerson from '../../../icons/iconPerson.svg'
import iconeNotificacao from '../../../icons/iconeNotificacao.svg'
import iconeMInhasPreferencias from '../../../icons/iconeMInhasPreferencias.svg'
import iconeMetodosDePagamento from '../../../icons/iconeMetodosDePagamento.svg'
import iconeDuvida from '../../../icons/iconeDuvida.svg'
import iconeTermosDeUso from '../../../icons/iconeTermosDeUso.svg'
import iconePoliticaDePrivacidade from '../../../icons/iconePoliticaDePrivacidade.svg'
import iconeSair from '../../../icons/iconeSair.svg'
import imagemperfil from '../../../icons/imagemperfil.svg'

type ProfileOption = {
  title: string
  description: string
  icon: ReactNode
  iconBackground: string
  danger?: boolean
  href?: string
}

const profileOptions: ProfileOption[] = [
  {
    title: 'Meus dados',
    description: 'Visualize e edite suas informações pessoais',
    icon: <Image src={iconPerson} alt='Ícone de usuário' width={16} height={16} />,
    iconBackground: '#E7F0FF',
    href: '/meus_dados',
  },
  {
    title: 'Notificações',
    description: 'Configure seus alertas e lembretes',
    icon: (
      <Image src={iconeNotificacao} alt='Ícone de notificações' width={16} height={16} />
    ),
    iconBackground: '#DDF8EE',
  },
  {
    title: 'Minhas preferências',
    description: 'Defina cidades, horários e rotas favoritas',
    icon: (
      <Image
        src={iconeMInhasPreferencias}
        alt='Ícone de preferências'
        width={16}
        height={16}
      />
    ),
    iconBackground: '#FFF0DE',
  },
  {
    title: 'Métodos de pagamento',
    description: 'Gerencie seus métodos de pagamento',
    icon: (
      <Image
        src={iconeMetodosDePagamento}
        alt='Ícone de métodos de pagamento'
        width={16}
        height={16}
      />
    ),
    iconBackground: '#F1E8FF',
  },
  {
    title: 'Ajuda',
    description: 'Dúvidas frequentes e suporte',
    icon: <Image src={iconeDuvida} alt='Ícone de duvidas' width={16} height={16} />,
    iconBackground: '#E6F3FF',
  },
  {
    title: 'Termos de uso',
    description: 'Leia nossos termos e condições',
    icon: (
      <Image src={iconeTermosDeUso} alt='Ícone de termos de uso' width={16} height={16} />
    ),
    iconBackground: '#EEF2F7',
  },
  {
    title: 'Política de privacidade',
    description: 'Conheça como seus dados são protegidos',
    icon: (
      <Image
        src={iconePoliticaDePrivacidade}
        alt='Ícone de política de privacidade'
        width={16}
        height={16}
      />
    ),
    iconBackground: '#EEF2F7',
  },
  {
    title: 'Sair da conta',
    description: 'Encerre sua sessão no aplicativo',
    icon: <Image src={iconeSair} alt='Ícone de sair da conta' width={16} height={16} />,
    iconBackground: '#FEE2E2',
    danger: true,
  },
]

const Perfil = () => {
  const router = useRouter()

  return (
    <Flex direction='column' bg='grey200' minHeight='100vh' pb='8rem'>
      <Flex bg='systemWhite' direction='column' gap='1rem' p='3.5rem 3.5rem 0 3.5rem'>
        <Text fontSize='3.4rem' fontWeight='bold'>
          Perfil
        </Text>

        <Flex direction='column' alignItems='center' gap='0.6rem' mt='2.5rem'>
          <Flex
            w='8rem'
            h='8rem'
            minWidth='8rem'
            minHeight='8rem'
            borderRadius='50%'
            alignItems='center'
            justifyContent='center'
            bg='grey100'
            style={{ overflow: 'hidden' }}
          >
            <Image
              src={imagemperfil}
              alt='Imagem do perfil'
              width={80}
              height={80}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </Flex>
          <Text color='blueSlate'>Estudante</Text>
          <Text fontSize='2rem' fontWeight='bold' color='prussianBlue'>
            Ana Clara Silva
          </Text>
        </Flex>
      </Flex>

      <Flex direction='column' gap='1rem' p='2rem'>
        {profileOptions.map(option => (
          <button
            key={option.title}
            type='button'
            onClick={() => option.href && router.push(option.href)}
            style={{
              alignItems: 'center',
              background: option.danger ? '#FFF5F5' : '#FFFFFF',
              border: option.danger ? '1px solid #FECACA' : 'none',
              borderRadius: '1.4rem',
              boxShadow: option.danger ? 'none' : '0 3px 12px rgba(21, 28, 42, 0.05)',
              cursor: 'pointer',
              display: 'flex',
              gap: '1.2rem',
              padding: '1.2rem',
              textAlign: 'left',
              width: '100%',
            }}
          >
            <Flex
              w='3.6rem'
              h='3.6rem'
              minWidth='3.6rem'
              borderRadius='1rem'
              alignItems='center'
              justifyContent='center'
              style={{ backgroundColor: option.iconBackground }}
            >
              {option.icon}
            </Flex>

            <Flex direction='column' flex={1} gap='0.2rem'>
              <Text
                color={option.danger ? 'systemDanger' : 'prussianBlue'}
                fontWeight='bold'
              >
                {option.title}
              </Text>
              <Text color='blueSlate' variant='caption'>
                {option.description}
              </Text>
            </Flex>

            <Image
              src={iconArrowRight}
              alt=''
              width={18}
              height={18}
              style={
                option.danger
                  ? { filter: 'sepia(1) saturate(8) hue-rotate(315deg)' }
                  : undefined
              }
            />
          </button>
        ))}
      </Flex>
    </Flex>
  )
}

export default Perfil

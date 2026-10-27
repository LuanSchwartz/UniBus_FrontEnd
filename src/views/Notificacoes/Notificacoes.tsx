import { Flex, Text } from '@nexpy/design-system'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'
import type { ReactNode } from 'react'

import iconeNotificacao from '../../../icons/iconeNotificacao.svg'
import icone_alteracao_rota from '../../../icons/icone_alteracao_rota.svg'
import icone_cancelamento from '../../../icons/icone_cancelamento.svg'
import icone_lembrete from '../../../icons/icone_lembrete.svg'
import icone_avisos_operador from '../../../icons/icone_avisos_operador.svg'
import icone_promocoes from '../../../icons/icone_promocoes.svg'
import icone_silenciar from '../../../icons/icone_silenciar.svg'

type NotificationKey =
  | 'tripConfirmation'
  | 'routeChanges'
  | 'cancellations'
  | 'scheduleReminders'
  | 'operatorNotices'
  | 'promotions'

type NotificationOption = {
  id: NotificationKey
  title: string
  description: string
  icon: ReactNode
  iconBackground: string
  iconColor: string
}

const notificationOptions: NotificationOption[] = [
  {
    id: 'tripConfirmation',
    title: 'Confirmações de viagem',
    description: 'Receba lembretes para confirmar sua presença.',
    icon: <Image src={iconeNotificacao} alt='Ícone de notificações' width={16} height={16} />,
    iconBackground: '#DDF8EE',
    iconColor: '#10B981',
  },
  {
    id: 'routeChanges',
    title: 'Alterações de rota',
    description: 'Seja avisado sobre mudanças no itinerário.',
    icon: <Image src={icone_alteracao_rota} alt='Ícone de notificações' width={16} height={16} />,
    iconBackground: '#E7F0FF',
    iconColor: '#2563EB',
  },
  {
    id: 'cancellations',
    title: 'Cancelamentos',
    description: 'Receba alertas em caso de cancelamento da viagem.',
    icon: <Image src={icone_cancelamento} alt='Ícone de notificações' width={16} height={16} />,
    iconBackground: '#FFF0F0',
    iconColor: '#FB4A5A',
  },
  {
    id: 'scheduleReminders',
    title: 'Lembretes de horário',
    description: 'Notificações antes do embarque.',
    icon: <Image src={icone_lembrete} alt='Ícone de notificações' width={16} height={16} />,
    iconBackground: '#DDF8EE',
    iconColor: '#10B981',
  },
  {
    id: 'operatorNotices',
    title: 'Avisos do operador',
    description: 'Mensagens importantes da equipe.',
    icon: <Image src={icone_avisos_operador} alt='Ícone de notificações' width={16} height={16} />,
    iconBackground: '#FFF0F0',
    iconColor: '#FB4A5A',
  },
  {
    id: 'promotions',
    title: 'Promoções e novidades',
    description: 'Receba novidades sobre o serviço.',
    icon: <Image src={icone_promocoes} alt='Ícone de notificações' width={16} height={16} />,
    iconBackground: '#E7F0FF',
    iconColor: '#2563EB',
  },
]

const initialPreferences: Record<NotificationKey, boolean> = {
  tripConfirmation: true,
  routeChanges: true,
  cancellations: true,
  scheduleReminders: true,
  operatorNotices: true,
  promotions: false,
}

type ToggleProps = {
  checked: boolean
  disabled?: boolean
  label: string
  onClick: () => void
}

const Toggle = ({ checked, disabled = false, label, onClick }: ToggleProps) => (
  <button
    type='button'
    role='switch'
    aria-label={label}
    aria-checked={checked}
    disabled={disabled}
    onClick={onClick}
    style={{
      alignItems: 'center',
      backgroundColor: checked ? '#2563EB' : '#D7D9DD',
      border: 'none',
      borderRadius: '2rem',
      cursor: disabled ? 'not-allowed' : 'pointer',
      display: 'flex',
      height: '1.8rem',
      justifyContent: checked ? 'flex-end' : 'flex-start',
      opacity: disabled ? 0.65 : 1,
      padding: '0.2rem',
      transition: 'all 0.2s ease',
      width: '3.6rem',
    }}
  >
    <span
      style={{
        background: '#FFFFFF',
        borderRadius: '50%',
        display: 'block',
        height: '1.4rem',
        width: '1.4rem',
      }}
    />
  </button>
)

const Notificacoes = () => {
  const router = useRouter()
  const [preferences, setPreferences] = useState(initialPreferences)
  const [isMuted, setIsMuted] = useState(false)

  const togglePreference = (id: NotificationKey) => {
    setPreferences(currentPreferences => ({
      ...currentPreferences,
      [id]: !currentPreferences[id],
    }))
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
          Notificações
        </Text>
      </Flex>

      <Flex direction='column' alignItems='center' p='1.2rem 2rem 2.4rem'>
        <Text color='blueSlate' variant='caption' textAlign='center'>
          Configure seus alertas
          <br />e lembretes.
        </Text>
      </Flex>

      <Flex direction='column' gap='2.5rem' px='2rem'>
        {notificationOptions.map(option => {
          const isEnabled = !isMuted && preferences[option.id]

          return (
            <Flex key={option.id} alignItems='center' gap='1.2rem'>
              <Flex
                w='3.6rem'
                h='3.6rem'
                minWidth='3.6rem'
                alignItems='center'
                justifyContent='center'
                borderRadius='1rem'
                style={{ backgroundColor: option.iconBackground }}
              >
                <Text color={option.iconColor} fontSize='2rem' fontWeight='bold'>
                  {option.icon}
                </Text>
              </Flex>

              <Flex direction='column' flex={1} gap='0.2rem'>
                <Text color='prussianBlue' fontWeight='bold'>
                  {option.title}
                </Text>
                <Text color='blueSlate' variant='caption'>
                  {option.description}
                </Text>
              </Flex>

              <Toggle
                label={option.title}
                checked={isEnabled}
                disabled={isMuted}
                onClick={() => togglePreference(option.id)}
              />
            </Flex>
          )
        })}

        <Flex
          borderTopColor='grey100'
          borderTopStyle='solid'
          borderTopWidth='1px'
          pt='1.8rem'
        >
          <Flex alignItems='center' gap='1.2rem' flex={1}>
            <Flex
              w='3.6rem'
              h='3.6rem'
              minWidth='3.6rem'
              alignItems='center'
              justifyContent='center'
              borderRadius='1rem'
              bg='grey100'
            >
              <Image
                src={icone_silenciar}
                alt='Ícone de silenciar notificações'
                width={16}
                height={16}
              />
            </Flex>
            <Flex direction='column' gap='0.2rem'>
              <Text color='prussianBlue' fontWeight='bold'>
                Silenciar notificações
              </Text>
              <Text color='blueSlate' variant='caption'>
                Desative todas as notificações.
              </Text>
            </Flex>
          </Flex>
          <Toggle
            label='Silenciar notificações'
            checked={isMuted}
            onClick={() => setIsMuted(value => !value)}
          />
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Notificacoes

import { A, Flex, Text } from '@nexpy/design-system'
import Image from 'next/image'
import { useRouter } from 'next/router'

import iconHome from '../../../icons/iconhome.svg'
import iconHomeActive from '../../../icons/iconhome-active.svg'
import iconTicket from '../../../icons/iconticket.svg'
import iconTicketActive from '../../../icons/iconticket-active.svg'
import iconBell from '../../../icons/iconbellm.svg'
import iconBellActive from '../../../icons/iconbellm-active.svg'
import iconCard from '../../../icons/iconcard.svg'
import iconCardActive from '../../../icons/iconcard-active.svg'
import iconProfile from '../../../icons/iconprofile.svg'
import iconProfileActive from '../../../icons/iconprofile-active.svg'

const menuItems = [
  {
    label: 'Início',
    href: '/',
    icon: iconHome,
    activeIcon: iconHomeActive,
  },
  {
    label: 'Viagens',
    href: '/viagens',
    icon: iconTicket,
    activeIcon: iconTicketActive,
  },
  {
    label: 'Avisos',
    href: '/avisos',
    icon: iconBell,
    activeIcon: iconBellActive,
  },
  {
    label: 'Carteira',
    href: '/carteira',
    icon: iconCard,
    activeIcon: iconCardActive,
  },
  {
    label: 'Perfil',
    href: '/perfil',
    icon: iconProfile,
    activeIcon: iconProfileActive,
  },
]

const MenuCard = () => {
  const router = useRouter()

  return (
    <Flex
      as='nav'
      position='fixed'
      bottom={0}
      left={0}
      right={0}
      zIndex={10}
      bg='systemWhite'
      p='1.2rem 2rem'
      justifyContent='space-around'
      boxShadow='0 -4px 20px rgba(15, 23, 42, 0.1)'
    >
      {menuItems.map(item => {
        const isActive = router.pathname === item.href

        return (
          <A
            key={item.href}
            href={item.href}
            aria-current={isActive ? 'page' : undefined}
            style={{
              flex: 1,
              textDecoration: 'none',
            }}
          >
            <Flex direction='column' alignItems='center' gap='0.5rem'>
              <Image
                src={isActive ? item.activeIcon : item.icon}
                alt=''
                width={24}
                height={24}
              />

              <Text
                variant='caption'
                color={isActive ? 'royalAzure' : 'blueSlate'}
                fontWeight={isActive ? 'bold' : 'normal'}
              >
                {item.label}
              </Text>
            </Flex>
          </A>
        )
      })}
    </Flex>
  )
}

export default MenuCard

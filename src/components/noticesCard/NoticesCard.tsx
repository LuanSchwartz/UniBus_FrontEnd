import { Flex, Text } from '@nexpy/design-system'

import Image from 'next/image'
import iconNoticeSafe from '../../../icons/iconnoticesafe.svg'
import iconNoticeWarnig from '../../../icons/iconnoticewarning.svg'
import iconNoticeDanger from '../../../icons/iconnoticedanger.svg'
import iconArrowRight from '../../../icons/iconarrow.svg'

export type NoticesStatus = 'safe' | 'warning' | 'danger'

const statusConfiguration = {
  safe: {
    backgroundColor: 'aliceBlue',
    backgroundColorCicle: 'aliceBlue2',
    icon: iconNoticeSafe,
  },
  warning: {
    backgroundColor: 'ivoryMist',
    backgroundColorCicle: 'ochre',
    icon: iconNoticeWarnig,
  },
  danger: {
    backgroundColor: 'snow',
    backgroundColorCicle: 'snow2',
    icon: iconNoticeDanger,
  },
}

export type NoticesCardProps = {
  status: NoticesStatus
  mensageTitle?: string
  date: string
  hours: string
  mensageDescription?: string
}

const NoticesCard = ({
  status,
  mensageTitle,
  date,
  hours,
  mensageDescription,
}: NoticesCardProps) => {
  const visual = statusConfiguration[status]

  return (
    <Flex
      direction='row'
      bg={visual.backgroundColor}
      borderWidth='1px'
      borderStyle='solid'
      borderColor={visual.backgroundColorCicle}
      p='1.5rem'
      borderRadius='1rem'
      gap='1rem'
      alignItems='center'
    >
      <Flex
        bg={visual.backgroundColorCicle}
        w='4rem'
        minWidth='4rem'
        h='4rem'
        borderRadius='50%'
        alignItems='center'
        justifyContent='center'
      >
        <Image src={visual.icon} alt='' width={16} height={16} />
      </Flex>
      <Flex direction='column' gap='0.5rem'>
        <Flex direction='column'>
          <Text fontWeight='bold'>{mensageTitle}</Text>
          <Text color='coolSteal'>
            {date} • {hours}
          </Text>
        </Flex>
        <Text color='blueSlate'>{mensageDescription}</Text>
      </Flex>
      <Image src={iconArrowRight} alt='' width={24} height={24} />
    </Flex>
  )
}

export default NoticesCard

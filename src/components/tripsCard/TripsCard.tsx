import { Flex, Text } from '@nexpy/design-system'
import Image from 'next/image'

import iconPerson from '../../../icons/iconPerson.svg'

type AttendanceStatus = 'confirmed' | 'pending' | 'canceled'

const statusConfiguration = {
  confirmed: {
    backgroundColor: 'turfeGreen',
    textColor: 'systemSafe',
    text: 'Confirmada',
  },
  pending: {
    backgroundColor: 'ochre',
    textColor: 'systemWarning',
    text: 'Pendente',
  },
  canceled: {
    backgroundColor: 'snow',
    textColor: 'systemDanger',
    text: 'Cancelada',
  },
}

export type TripsCardProps = {
  status: AttendanceStatus
  destination1: string
  destination2: string
  date: string
  time: string
  valuePerson: string
}

const TripsCard = ({
  status,
  destination1,
  destination2,
  date,
  time,
  valuePerson,
}: TripsCardProps) => {
  const visual = statusConfiguration[status]

  return (
    <Flex
      direction='column'
      bg='systemWhite'
      p='1.5rem'
      borderRadius='1rem'
      boxShadow='0 10px 25px rgba(21, 28, 42, 0.15)'
      gap='1rem'
    >
      <Flex direction='row' justifyContent='space-between' alignItems='center'>
        <Flex
          bg={visual.backgroundColor}
          w='fit-content'
          p='0.4rem 1rem'
          borderRadius='5rem'
        >
          <Text variant='caption' color={visual.textColor} fontWeight='bold'>
            {visual.text}
          </Text>
        </Flex>
        <Text variant='caption' fontWeight='bold'>
          {destination1} - {destination2}
        </Text>
      </Flex>
      <Flex direction='row' justifyContent='space-between' alignItems='center'>
        <Text color='blueSlate' variant='caption'>
          {date} - {time}
        </Text>
        <Flex direction='row' alignItems='center' gap='0.5rem'>
          <Image src={iconPerson} alt='Pessoa' width={16} height={16} />
          <Text color='blueSlate' variant='caption'>
            {valuePerson}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  )
}
export default TripsCard

import { Flex, Text } from '@nexpy/design-system'
import Image from 'next/image'

import iconArrowRight from '../../../icons/iconarrow.svg'


type TripStatus = 'confirmed' | 'pending' | 'canceled'

type MyTripsCardProps = {
    status: TripStatus
    origin: string
    destination: string
    date: string
    time: string
    seats: string
    tag?: string
}

const statusConfig = {
    confirmed: {
        label: 'Confirmada',
        background: 'turfeGreen',
        color: 'systemSafe',
    },
    pending: {
        label: 'Pendente',
        background: 'ochre',
        color: 'systemWarning',
    },
    canceled: {
        label: 'Cancelada',
        background: 'snow',
        color: 'systemDanger',
    },
}

const MyTripsCard = ({
    status,
    origin,
    destination,
    date,
    time,
    seats,
    tag,
}: MyTripsCardProps) => {
    const visual = statusConfig[status]

    return (
        <Flex
            bg='systemWhite'
            p='1.5rem'
            borderRadius='1.6rem'
            gap='1.2rem'
            alignItems='flex-start'
            boxShadow='0 4px 12px rgba(21, 28, 42, 0.08)'
        >
            <Flex
                w='4rem'
                h='4rem'
                minWidth='4rem'
                bg={visual.background}
                borderRadius='1.2rem'
                alignItems='center'
                justifyContent='center'
            >
                <Text fontSize='2rem'>🚌</Text>
            </Flex>

            <Flex direction='column' flex={1} gap='0.4rem'>
                <Text color='blueSlate' variant='caption'>
                    {date} • {time}
                </Text>

                <Text fontWeight='bold'>
                    {origin} → {destination}
                </Text>

                <Flex gap='0.8rem' alignItems='center'>
                    <Flex bg={visual.background} px='1rem' py='0.4rem' borderRadius='0.6rem'>
                        <Text variant='caption' color={visual.color} fontWeight='bold'>
                            {visual.label}
                        </Text>
                    </Flex>

                    {tag && (
                        <Flex bg='snow' px='1rem' py='0.4rem' borderRadius='0.6rem'>
                            <Text variant='caption' color='systemDanger' fontWeight='bold'>
                                {tag}
                            </Text>
                        </Flex>
                    )}
                </Flex>

                <Text color='blueSlate' variant='caption'>
                    {seats}
                </Text>
            </Flex>

            <Flex alignSelf='center'>
                <Image src={iconArrowRight} alt='' width={24} height={24} />
            </Flex>
        </Flex>
    )
}

export default MyTripsCard
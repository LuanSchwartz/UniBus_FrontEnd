import { A, Box, Button, Flex, Text } from '@nexpy/design-system'

import { useState } from 'react'
import { useRouter } from 'next/router'

import Image from 'next/image'
import iconbell from '../../../icons/iconbell.svg'
import iconcalendar from '../../../icons/iconcalendar.svg'
import iconclock from '../../../icons/iconclock.svg'
import iconbank from '../../../icons/iconbank.svg'
import iconBusIlustration from '../../../icons/bus-illustration.svg'
import iconConfirmed from '../../../icons/iconconfirmed.svg'
import iconCancel from '../../../icons/iconcancel.svg'
import iconAlert from '../../../icons/iconalert.svg'
import iconAlertConfirmed from '../../../icons/iconalertconfirmed.svg'

import NoticesCard from '@/components/noticesCard/NoticesCard'
import TripsCard from '../../components/tripsCard/TripsCard'

const vagasOcupadas = 12
const totalVagas = 42

const porcentagem = totalVagas > 0 ? Math.min((vagasOcupadas / totalVagas) * 100, 100) : 0

const Home = () => {
  const [isConfirmed, setIsConfirmed] = useState(false)

  const router = useRouter()

  return (
    <Flex direction='column' bg='grey200' minHeight='100vh' pb='8rem'>
      <Flex direction='column' bg='prussianBlue' p='3.5rem' gap='1rem'>
        <Flex direction='row' w='100%' justifyContent='space-between' pt='2rem' pb='1rem'>
          <Flex direction='column' gap='0.4rem'>
            <Text fontSize='3.4rem' color='systemWhite' fontWeight='bold'>
              Olá, Ana!
            </Text>
            <Text fontSize='1.8rem' color='paleSlate'>
              Confira suas próximas viagens.
            </Text>
          </Flex>

          <Flex
            bg='whiteSmoke'
            w='4rem'
            h='4rem'
            alignItems='center'
            justifyContent='center'
            borderRadius='50%'
          >
            <Image src={iconbell} alt='Usuário' width={18} height={18} />
          </Flex>
        </Flex>
        <Text fontSize='1.4rem' color='systemWhite' fontWeight='bold' pb='2rem'>
          Próxima viagem
        </Text>
      </Flex>

      <Flex
        direction='column'
        bg='systemWhite'
        mx='2rem'
        mt='-4rem'
        p='3.5rem'
        borderRadius='2rem'
        boxShadow='0 10px 25px rgba(21, 28, 42, 0.15)'
        position='relative'
        zIndex={1}
      >
        <Flex direction='column' mb='2rem' gap='2rem'>
          <Flex
            bg={isConfirmed ? 'turfeGreen' : 'ochre'}
            w='fit-content'
            p='0.4rem 1rem'
            borderRadius='5rem'
          >
            <Text
              variant='body'
              color={isConfirmed ? 'systemSafe' : 'systemWarning'}
              fontWeight='bold'
            >
              {isConfirmed ? 'PRESENÇA CONFIRMADA' : 'PRESENÇA PENDENTE'}
            </Text>
          </Flex>

          <Text as='h1' fontWeight='bold'>
            Pedro Osório Pelotas
          </Text>
        </Flex>

        <Flex direction='row' justifyContent='space-between' alignItems='center'>
          <Flex direction='column' gap='1rem'>
            <Flex gap='0.5rem' alignItems='center'>
              <Image src={iconcalendar} alt='Calendário' width={18} height={18} />
              <Text color='blueSlate'>12/06/2024</Text>
            </Flex>

            <Flex gap='0.5rem' alignItems='center'>
              <Image src={iconclock} alt='Relógio' width={18} height={18} />
              <Text color='blueSlate'>07:00</Text>
            </Flex>

            <Flex gap='0.5rem' alignItems='center'>
              <Image src={iconbank} alt='Banco' width={18} height={18} />
              <Text color='blueSlate'>
                {vagasOcupadas} / {totalVagas} vagas ocupadas
              </Text>
            </Flex>
          </Flex>
          <Image src={iconBusIlustration} alt='Ilustração do ônibus' width={112} />
        </Flex>

        <Box
          w='100%'
          h='0.8rem'
          bg='grey100'
          borderRadius='1rem'
          overflow='hidden'
          role='progressbar'
          aria-valuenow={vagasOcupadas}
          aria-valuemin={0}
          aria-valuemax={totalVagas}
          mt='2rem'
        >
          <Box
            w={`${porcentagem}%`}
            h='100%'
            bg='royalAzure'
            borderRadius='1rem'
            transition='width 0.3s ease'
          />
        </Box>

        <Flex direction='column' mt='3rem' alignItems='center' gap='1.5rem'>
          <Button
            onClick={() => setIsConfirmed(value => !value)}
            size='auto'
            bg={isConfirmed ? 'systemDanger' : 'royalAzure'}
            minHeight='5.5rem'
            borderRadius='1.5rem'
            p='1.5rem 2rem'
            gap='1rem'
            color='systemWhite'
            fontSize='1.8rem'
            fontWeight='bold'
            textTransform='none'
          >
            <Image
              src={isConfirmed ? iconCancel : iconConfirmed}
              alt=''
              width={24}
              height={24}
            />
            {isConfirmed ? 'Cancelar confirmada' : 'Confirmar presença'}
          </Button>

          <Flex
            direction='row'
            w='100%'
            justifyContent='center'
            alignItems='flex-start'
            gap='1rem'
            px='1rem'
          >
            <Box flexShrink={0} mt='0.4rem'>
              <Image
                src={isConfirmed ? iconAlertConfirmed : iconAlert}
                alt=''
                width={16}
                height={16}
              />
            </Box>
            <Text color='blueSlate' fontSize='1.6rem' lineHeight='1.5' textAlign='center'>
              {isConfirmed ? (
                <>
                  Sua presença está confirmada.
                  <br />
                  Boa viagem!
                </>
              ) : (
                <>
                  Você ainda não confirmou sua
                  <br />
                  presença para a viagem
                </>
              )}
            </Text>
          </Flex>
        </Flex>
      </Flex>

      <Flex direction='column' p='3.5rem' gap='1rem'>
        <Flex direction='row' justifyContent='space-between' alignItems='center'>
          <Text variant='subheading' fontWeight='bold'>
            Próximas viagens
          </Text>
          <A
            href='/viagens'
            fontWeight='bold'
            color='royalAzure'
            onClick={event => {
              event.preventDefault()
              router.push('/avisos')
            }}
          >
            Ver todas
          </A>
        </Flex>
        <Flex direction='column' gap='0.8rem'>
          <TripsCard
            status='pending'
            destination1='Pedro Osório'
            destination2='Pelotas'
            date='28 de agosto (Qua)'
            time='10:00'
            valuePerson='10 / 42'
          />
          <TripsCard
            status='confirmed'
            destination1='Pedro Osório'
            destination2='Pelotas'
            date='28 de agosto (Qua)'
            time='10:00'
            valuePerson='10 / 42'
          />
          <TripsCard
            status='canceled'
            destination1='Pedro Osório'
            destination2='Pelotas'
            date='28 de agosto (Qua)'
            time='10:00'
            valuePerson='10 / 42'
          />
        </Flex>
      </Flex>

      <Flex direction='column' p='3.5rem' gap='1rem'>
        <Flex direction='row' justifyContent='space-between' alignItems='center'>
          <Text variant='subheading' fontWeight='bold'>
            Avisos Recentes
          </Text>
          <A
            href='/avisos'
            fontWeight='bold'
            color='royalAzure'
            onClick={event => {
              event.preventDefault()
              router.push('/avisos')
            }}
          >
            Ver todas
          </A>
        </Flex>

        <Flex direction='column' gap='0.8rem'>
          <NoticesCard
            status='safe'
            mensageTitle='Viagem Segura'
            date='20/08/2025'
            hours='09:15'
            mensageDescription='A viagem de hoje está ocorrendo normalmente.'
          />
          <NoticesCard
            status='warning'
            mensageTitle='Atenção'
            date='20/08/2025'
            hours='09:15'
            mensageDescription='A viagem de hoje pode sofrer atrasos devido a obras na estrada.'
          />
          <NoticesCard
            status='danger'
            mensageTitle='Viagem Cancelada'
            date='20/08/2025'
            hours='09:15'
            mensageDescription='A viagem de hoje foi cancelada devido a condições climáticas adversas.'
          />
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Home

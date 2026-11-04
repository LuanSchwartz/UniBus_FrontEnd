import { A, Box, Button, Flex, Text } from '@nexpy/design-system'

import { useEffect, useState } from 'react'
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
import { getUsuario } from '@/services/api'
import { type Aviso, listarAvisos } from '@/services/avisosService'
import { type Viagem, alternarPresenca, listarViagens } from '@/services/viagensService'
import TripsCard from '../../components/tripsCard/TripsCard'

const Home = () => {
  const [nome, setNome] = useState('')
  const [viagens, setViagens] = useState<Viagem[]>([])
  const [avisos, setAvisos] = useState<Aviso[]>([])
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const falhar = (error: Error) => setErro(error.message)
    getUsuario()
      .then(usuario => setNome(usuario.nome.split(' ')[0]))
      .catch(falhar)
    listarViagens()
      .then(lista => setViagens(lista.filter(viagem => viagem.proxima)))
      .catch(falhar)
    listarAvisos(3).then(setAvisos).catch(falhar)
  }, [])

  const proxima = viagens[0]
  const isConfirmed = proxima?.ativa ?? false
  const vagasOcupadas = proxima?.occupiedSeats ?? 0
  const totalVagas = proxima?.totalSeats ?? 0
  const porcentagem = totalVagas > 0 ? Math.min((vagasOcupadas / totalVagas) * 100, 100) : 0

  const handleAttendance = async () => {
    setErro('')
    setEnviando(true)
    try {
      const atualizada = await alternarPresenca(proxima)
      setViagens(lista => lista.map(viagem => (viagem.id === atualizada.id ? atualizada : viagem)))
    } catch (error) {
      setErro((error as Error).message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <Flex direction='column' bg='grey200' minHeight='100vh' pb='8rem'>
      <Flex direction='column' bg='prussianBlue' p='3.5rem' gap='1rem'>
        <Flex direction='row' w='100%' justifyContent='space-between' pt='2rem' pb='1rem'>
          <Flex direction='column' gap='0.4rem'>
            <Text fontSize='3.4rem' color='systemWhite' fontWeight='bold'>
              {nome ? `Olá, ${nome}!` : 'Olá!'}
            </Text>
            <Text fontSize='1.8rem' color='paleSlate'>
              Confira suas próximas viagens.
            </Text>
          </Flex>

          <A
            href='/avisos'
            onClick={event => {
              event.preventDefault()
              router.push('/avisos')
            }}
          >
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
          </A>
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
        {!proxima && (
          <Text color={erro ? 'systemDanger' : 'blueSlate'} textAlign='center'>
            {erro || 'Nenhuma viagem programada.'}
          </Text>
        )}
        {proxima && (
        <>
        <Flex direction='column' mb='2rem' gap='2rem'>
          <Flex
            bg={proxima.status === 'confirmed' ? 'turfeGreen' : 'ochre'}
            w='fit-content'
            p='0.4rem 1rem'
            borderRadius='5rem'
          >
            <Text
              variant='body'
              color={proxima.status === 'confirmed' ? 'systemSafe' : 'systemWarning'}
              fontWeight='bold'
            >
              {proxima.status === 'confirmed'
                ? 'PRESENÇA CONFIRMADA'
                : proxima.emEspera
                  ? 'NA FILA DE ESPERA'
                  : 'PRESENÇA PENDENTE'}
            </Text>
          </Flex>

          <Text as='h1' fontWeight='bold'>
            {proxima.origin} → {proxima.destination}
          </Text>
        </Flex>

        <Flex direction='row' justifyContent='space-between' alignItems='center'>
          <Flex direction='column' gap='1rem'>
            <Flex gap='0.5rem' alignItems='center'>
              <Image src={iconcalendar} alt='Calendário' width={18} height={18} />
              <Text color='blueSlate'>{proxima.date}</Text>
            </Flex>

            <Flex gap='0.5rem' alignItems='center'>
              <Image src={iconclock} alt='Relógio' width={18} height={18} />
              <Text color='blueSlate'>{proxima.time}</Text>
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
          {erro && (
            <Text color='systemDanger' textAlign='center' role='alert'>
              {erro}
            </Text>
          )}
          {(isConfirmed || proxima.podeConfirmar) && (
          <Button
            onClick={handleAttendance}
            disabled={enviando}
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
            {isConfirmed ? 'Cancelar presença' : 'Confirmar presença'}
          </Button>
          )}

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
              {proxima.emEspera ? (
                'Você está na fila de espera desta viagem.'
              ) : isConfirmed ? (
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
        </>
        )}
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
              router.push('/viagens')
            }}
          >
            Ver todas
          </A>
        </Flex>
        <Flex direction='column' gap='0.8rem'>
          {viagens.slice(1, 4).map(viagem => (
            <TripsCard
              key={viagem.id}
              status={viagem.status}
              destination1={viagem.origin}
              destination2={viagem.destination}
              date={viagem.date}
              time={viagem.time}
              valuePerson={`${viagem.occupiedSeats} / ${viagem.totalSeats}`}
            />
          ))}
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
          {avisos.map(aviso => (
            <NoticesCard
              key={aviso.id}
              status={aviso.status}
              mensageTitle={aviso.mensageTitle}
              date={aviso.date}
              hours={aviso.hours}
              mensageDescription={aviso.mensageDescription}
            />
          ))}
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Home

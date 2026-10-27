import { Flex, Text } from '@nexpy/design-system'
import { useRouter } from 'next/router'
import Image from 'next/image'

import icone_chat from '../../../icons/icone_chat.svg'
import icone_email from '../../../icons/icone_email.svg'
import icone_horario from '../../../icons/icone_horario.svg'

const Ajuda = () => {
  const router = useRouter()

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
          Ajuda
        </Text>
      </Flex>

      <Flex direction='column' alignItems='center' p='1.2rem 2rem 2.8rem'>
        <Text color='blueSlate' variant='caption' textAlign='center'>
          Escolha o melhor canal
          <br />
          para seu atendimento.
        </Text>
      </Flex>

      <Flex direction='column' gap='0.8rem' px='2rem'>
        <Flex
          bg='systemWhite'
          borderColor='paleSlate'
          borderRadius='1.2rem'
          borderStyle='solid'
          borderWidth='1px'
          alignItems='center'
          gap='1.2rem'
          p='1.2rem'
        >
          <Flex
            w='3.6rem'
            h='3.6rem'
            minWidth='3.6rem'
            alignItems='center'
            justifyContent='center'
            borderRadius='1rem'
            bg='turfeGreen'
          >
            <Image
              src={icone_chat}
              alt='Ícone de chat'
              width={16}
              height={16}
            />
          </Flex>
          <Flex direction='column' flex={1} gap='0.2rem'>
            <Text color='prussianBlue' fontWeight='bold'>
              Chat no aplicativo
            </Text>
            <Text color='blueSlate' variant='caption'>
              Converse com nossa equipe.
            </Text>
          </Flex>
          <Flex bg='turfeGreen' borderRadius='0.5rem' px='0.6rem' py='0.2rem'>
            <Text color='systemSafe' fontSize='0.9rem' fontWeight='bold'>
              Online
            </Text>
          </Flex>
        </Flex>

        <Flex
          bg='systemWhite'
          borderColor='paleSlate'
          borderRadius='1.2rem'
          borderStyle='solid'
          borderWidth='1px'
          alignItems='center'
          gap='1.2rem'
          p='1.2rem'
        >
          <Flex
            w='3.6rem'
            h='3.6rem'
            minWidth='3.6rem'
            alignItems='center'
            justifyContent='center'
            borderRadius='1rem'
            bg='aliceBlue'
          >
            <Image
              src={icone_email}
              alt='Ícone de e-mail'
              width={16}
              height={16}
            />
          </Flex>
          <Flex direction='column' gap='0.2rem'>
            <Text color='prussianBlue' fontWeight='bold'>
              E-mail
            </Text>
            <Text color='blueSlate' variant='caption'>
              suporte@unibus.com.br
            </Text>
          </Flex>
        </Flex>

        <Flex
          bg='aliceBlue'
          borderColor='aliceBlue2'
          borderRadius='1.2rem'
          borderStyle='solid'
          borderWidth='1px'
          direction='column'
          gap='0.6rem'
          p='1.2rem'
        >
          <Flex gap='0.8rem' alignItems='center'>
            <Image
              src={icone_horario}
              alt='Ícone de e-mail'
              width={16}
              height={16}
            />
            <Text color='royalAzure' fontWeight='bold'>
              Horário de atendimento
            </Text>
          </Flex>
          <Flex direction='column' gap='0.3rem' pl='2.6rem'>
            <Text color='blueSlate' variant='caption'>
              Segunda a sexta: 8h às 20h
            </Text>
            <Text color='blueSlate' variant='caption'>
              Sábados: 8h às 14h
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Ajuda

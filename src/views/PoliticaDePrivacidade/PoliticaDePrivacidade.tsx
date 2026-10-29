import { Flex, Text } from '@nexpy/design-system'
import { useRouter } from 'next/router'

const sections = [
  [
    '1. Coleta de Dados',
    'Coletamos apenas os dados necessários para o funcionamento do serviço, como nome, e-mail, telefone e informações de viagem.',
  ],
  [
    '2. Uso das Informações',
    'Seus dados são utilizados para gerenciar viagens, enviar notificações e melhorar sua experiência no aplicativo.',
  ],
  [
    '3. Compartilhamento',
    'Não compartilhamos seus dados pessoais com terceiros, exceto quando necessário para a prestação do serviço ou por exigência legal.',
  ],
  [
    '4. Segurança',
    'Adotamos medidas técnicas e organizacionais para proteger seus dados contra acessos não autorizados.',
  ],
  [
    '5. Seus Direitos',
    'Você pode solicitar a visualização, alteração ou exclusão dos seus dados a qualquer momento.',
  ],
]

const PoliticaDePrivacidade = () => {
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
          Política de Privacidade
        </Text>
      </Flex>

      <Flex direction='column' gap='1.8rem' p='2rem'>
        <Text color='blueSlate' variant='caption' textAlign='center'>
          Conheça como seus dados são protegidos
        </Text>
        <Flex direction='column' gap='0.4rem'>
          <Text color='prussianBlue' fontWeight='bold'>
            Política de Privacidade – UniBus
          </Text>
          <Text color='coolSteal' variant='caption'>
            Última atualização: 20 de agosto de 2025
          </Text>
        </Flex>
        {sections.map(([title, content]) => (
          <Flex key={title} direction='column' gap='0.8rem'>
            <Text color='prussianBlue' fontWeight='bold'>
              {title}
            </Text>
            <Text color='blueSlate' lineHeight='1.35'>
              {content}
            </Text>
          </Flex>
        ))}
      </Flex>
    </Flex>
  )
}

export default PoliticaDePrivacidade

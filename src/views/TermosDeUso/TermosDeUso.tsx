import { Flex, Text } from '@nexpy/design-system'
import { useRouter } from 'next/router'

const sections = [
  [
    '1. Aceitação dos Termos',
    'Ao utilizar o aplicativo UniBus, você concorda com estes Termos de Uso, que regem sua utilização dos nossos serviços.',
  ],
  [
    '2. Sobre o Serviço',
    'O UniBus é uma plataforma que conecta estudantes a viagens universitárias, facilitando o agendamento, confirmação e gestão de rotas.',
  ],
  [
    '3. Responsabilidades do Usuário',
    'O usuário se compromete a fornecer informações verdadeiras, manter seus dados atualizados e utilizar o serviço de forma ética e responsável.',
  ],
  [
    '4. Cancelamentos',
    'Cancelamentos devem ser feitos dentro do prazo estabelecido. O não comparecimento pode gerar restrições no uso do serviço.',
  ],
  [
    '5. Alterações nos Termos',
    'Podemos atualizar estes termos a qualquer momento. As alterações serão comunicadas pelo aplicativo.',
  ],
]

const TermosDeUso = () => {
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
          Termos de uso
        </Text>
      </Flex>

      <Flex direction='column' gap='1.8rem' p='2rem'>
        <Text color='blueSlate' variant='caption' textAlign='center'>
          Leia nossos termos de uso
        </Text>
        <Flex direction='column' gap='0.4rem'>
          <Text color='prussianBlue' fontWeight='bold'>
            Termos de Uso – UniBus
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

export default TermosDeUso

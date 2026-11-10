import { Flex, Text } from '@nexpy/design-system'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { type ReactNode, useEffect, useState } from 'react'

import {
  type OpcoesPreferencias,
  type Preferencias,
  type Turno,
  atualizarPreferencias,
  getOpcoesPreferencias,
  getPreferencias,
} from '@/services/preferenciasService'

import icone_horario from '../../../icons/icone_horario.svg'
import icone_pref from '../../../icons/icone_pref.svg'
import icone_seta from '../../../icons/icone_seta.svg'

const turnos: { valor: Turno; nome: string; horario: string }[] = [
  { valor: 'MANHA', nome: 'Manhã', horario: '05:45 - 14:00' },
  { valor: 'TARDE', nome: 'Tarde', horario: '11:50 - 20:00' },
  { valor: 'NOITE', nome: 'Noite', horario: '17:20 - 00:00' },
]

type CampoLista = 'turnos' | 'rotaIds' | 'cidadeIds'

const Marcador = ({ ativo }: { ativo: boolean }) => (
  <span
    aria-hidden
    style={{
      alignItems: 'center',
      background: ativo ? '#2563EB' : '#FFFFFF',
      border: `2px solid ${ativo ? '#2563EB' : '#CBD5E1'}`,
      borderRadius: '50%',
      color: '#FFFFFF',
      display: 'flex',
      flexShrink: 0,
      fontSize: '1.1rem',
      fontWeight: 'bold',
      height: '2rem',
      justifyContent: 'center',
      width: '2rem',
    }}
  >
    {ativo ? '✓' : ''}
  </span>
)

const opcaoStyle = (ativo: boolean) =>
  ({
    alignItems: 'center',
    background: ativo ? '#EFF6FF' : '#FFFFFF',
    border: `1.5px solid ${ativo ? '#2563EB' : '#E2E8F0'}`,
    borderRadius: '1.4rem',
    cursor: 'pointer',
    display: 'flex',
    gap: '1.2rem',
    padding: '1.4rem',
    textAlign: 'left',
    transition: 'all 0.15s ease',
    width: '100%',
  }) as const

type SecaoProps = {
  icone: string
  iconeFundo: string
  titulo: string
  descricao: string
  selecionadas: number
  children: ReactNode
}

const Secao = ({ icone, iconeFundo, titulo, descricao, selecionadas, children }: SecaoProps) => (
  <Flex
    bg='systemWhite'
    borderRadius='1.8rem'
    boxShadow='0 4px 12px rgba(21, 28, 42, 0.06)'
    direction='column'
    gap='1.4rem'
    p='1.8rem'
  >
    <Flex alignItems='center' gap='1.2rem'>
      <Flex
        alignItems='center'
        borderRadius='1rem'
        h='3.6rem'
        justifyContent='center'
        minWidth='3.6rem'
        style={{ backgroundColor: iconeFundo }}
        w='3.6rem'
      >
        <Image src={icone} alt='' width={18} height={18} />
      </Flex>
      <Flex direction='column' flex={1} gap='0.2rem'>
        <Text color='prussianBlue' fontWeight='bold'>
          {titulo}
        </Text>
        <Text color='blueSlate' variant='caption'>
          {descricao}
        </Text>
      </Flex>
      <Text
        color={selecionadas ? 'royalAzure' : 'blueSlate'}
        fontSize='1.1rem'
        fontWeight='bold'
        style={{
          background: selecionadas ? '#E7F0FF' : '#F1F5F9',
          borderRadius: '2rem',
          padding: '0.4rem 1rem',
          whiteSpace: 'nowrap',
        }}
      >
        {selecionadas ? `${selecionadas} ${selecionadas === 1 ? 'marcada' : 'marcadas'}` : 'Todas'}
      </Text>
    </Flex>
    {children}
  </Flex>
)

const MinhasPreferencias = () => {
  const router = useRouter()
  const [opcoes, setOpcoes] = useState<OpcoesPreferencias | null>(null)
  const [preferencias, setPreferencias] = useState<Preferencias | null>(null)
  const [erro, setErro] = useState('')
  const [situacao, setSituacao] = useState<'' | 'salvando' | 'salvo'>('')

  useEffect(() => {
    Promise.all([getOpcoesPreferencias(), getPreferencias()])
      .then(([opcoesBack, preferenciasBack]) => {
        setOpcoes(opcoesBack)
        setPreferencias(preferenciasBack)
      })
      .catch(error => setErro(error.message))
  }, [])

  // Salva a cada toque; se o back recusar, a lista volta ao valor anterior.
  const toggle = async (campo: CampoLista, valor: string) => {
    if (!preferencias) return
    const anterior = preferencias
    const lista: string[] = anterior[campo]
    const nova = lista.includes(valor) ? lista.filter(item => item !== valor) : [...lista, valor]
    setErro('')
    setSituacao('salvando')
    setPreferencias({ ...anterior, [campo]: nova })
    try {
      setPreferencias(await atualizarPreferencias({ [campo]: nova }))
      setSituacao('salvo')
    } catch (error) {
      setPreferencias(anterior)
      setErro((error as Error).message)
      setSituacao('')
    }
  }

  const marcado = (campo: CampoLista, valor: string) =>
    Boolean((preferencias?.[campo] as string[] | undefined)?.includes(valor))

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
          Minhas preferências
        </Text>
      </Flex>

      <Flex direction='column' gap='1.6rem' p='2rem'>
        <Flex bg='aliceBlue' borderRadius='1.6rem' direction='column' gap='0.4rem' p='1.6rem'>
          <Text color='royalAzure' fontWeight='bold'>
            Personalize suas viagens
          </Text>
          <Text color='blueSlate' variant='caption' lineHeight='1.4'>
            A tela de Viagens mostra só os horários e rotas que você marcar aqui. Se não marcar nada
            em uma seção, todas aparecem.
          </Text>
        </Flex>

        <Text
          aria-live='polite'
          color={erro ? 'systemDanger' : 'blueSlate'}
          textAlign='center'
          variant='caption'
          role={erro ? 'alert' : undefined}
        >
          {erro ||
            (!preferencias
              ? 'Carregando...'
              : situacao === 'salvando'
                ? 'Salvando...'
                : situacao === 'salvo'
                  ? '✓ Preferências salvas'
                  : '')}
        </Text>

        <Secao
          icone={icone_horario}
          iconeFundo='#FFF0DE'
          titulo='Horários preferidos'
          descricao='Os turnos em que você costuma viajar.'
          selecionadas={preferencias?.turnos.length ?? 0}
        >
          <Flex direction='column' gap='0.8rem'>
            {turnos.map(turno => {
              const ativo = marcado('turnos', turno.valor)
              return (
                <button
                  key={turno.valor}
                  type='button'
                  aria-pressed={ativo}
                  disabled={!preferencias}
                  onClick={() => toggle('turnos', turno.valor)}
                  style={opcaoStyle(ativo)}
                >
                  <Flex direction='column' flex={1} gap='0.2rem'>
                    <Text color='prussianBlue' fontWeight='bold'>
                      {turno.nome}
                    </Text>
                    <Text color='blueSlate' variant='caption'>
                      {turno.horario}
                    </Text>
                  </Flex>
                  <Marcador ativo={ativo} />
                </button>
              )
            })}
          </Flex>
        </Secao>

        <Secao
          icone={icone_seta}
          iconeFundo='#E7F0FF'
          titulo='Rotas favoritas'
          descricao='As rotas que você mais utiliza.'
          selecionadas={preferencias?.rotaIds.length ?? 0}
        >
          <Flex direction='column' gap='0.8rem'>
            {(opcoes?.rotas ?? []).map(rota => {
              const ativo = marcado('rotaIds', rota.id)
              return (
                <button
                  key={rota.id}
                  type='button'
                  aria-pressed={ativo}
                  disabled={!preferencias}
                  onClick={() => toggle('rotaIds', rota.id)}
                  style={opcaoStyle(ativo)}
                >
                  <Text color='prussianBlue' flex={1} fontWeight='bold'>
                    {rota.nome}
                  </Text>
                  <Marcador ativo={ativo} />
                </button>
              )
            })}
          </Flex>
        </Secao>

        <Secao
          icone={icone_pref}
          iconeFundo='#DDF8EE'
          titulo='Cidades favoritas'
          descricao='As cidades por onde você mais passa.'
          selecionadas={preferencias?.cidadeIds.length ?? 0}
        >
          <Flex gap='0.8rem' style={{ flexWrap: 'wrap' }}>
            {(opcoes?.cidades ?? []).map(cidade => {
              const ativo = marcado('cidadeIds', cidade.id)
              return (
                <button
                  key={cidade.id}
                  type='button'
                  aria-pressed={ativo}
                  disabled={!preferencias}
                  onClick={() => toggle('cidadeIds', cidade.id)}
                  style={{
                    background: ativo ? '#2563EB' : '#FFFFFF',
                    border: `1.5px solid ${ativo ? '#2563EB' : '#E2E8F0'}`,
                    borderRadius: '2rem',
                    color: ativo ? '#FFFFFF' : '#132A4D',
                    cursor: 'pointer',
                    fontSize: '1.3rem',
                    fontWeight: 'bold',
                    padding: '0.8rem 1.6rem',
                  }}
                >
                  {ativo ? '✓ ' : ''}
                  {cidade.nome}
                </button>
              )
            })}
          </Flex>
        </Secao>
      </Flex>
    </Flex>
  )
}

export default MinhasPreferencias

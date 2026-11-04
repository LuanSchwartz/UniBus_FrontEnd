import { Flex, Text } from '@nexpy/design-system'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { useEffect, useState } from 'react'

import {
  type OpcoesPreferencias,
  type Preferencias,
  type Turno,
  atualizarPreferencias,
  getOpcoesPreferencias,
  getPreferencias,
} from '@/services/preferenciasService'

import icone_pref from '../../../icons/icone_pref.svg'
import icone_seta from '../../../icons/icone_seta.svg'

const turnos: [Turno, string][] = [
  ['MANHA', 'Manhã (05:45 - 14:00)'],
  ['TARDE', 'Tarde (11:50 - 20:00)'],
  ['NOITE', 'Noite (17:20 - 23:00)'],
]

const cardStyle = {
  alignItems: 'center',
  background: '#fff',
  border: '1px solid #CBD5E1',
  borderRadius: '1.2rem',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'space-between',
  padding: '1.4rem',
} as const

const checkboxStyle = { accentColor: '#2563EB', height: '1.8rem', width: '1.8rem' }

const MinhasPreferencias = () => {
  const router = useRouter()
  const [opcoes, setOpcoes] = useState<OpcoesPreferencias | null>(null)
  const [preferencias, setPreferencias] = useState<Preferencias | null>(null)
  const [erro, setErro] = useState('')

  useEffect(() => {
    Promise.all([getOpcoesPreferencias(), getPreferencias()])
      .then(([opcoesBack, preferenciasBack]) => {
        setOpcoes(opcoesBack)
        setPreferencias(preferenciasBack)
      })
      .catch(error => setErro(error.message))
  }, [])

  // Salva a cada toque; se o back recusar, a lista volta ao valor anterior.
  const toggle = async <K extends keyof Preferencias>(campo: K, valor: Preferencias[K][number]) => {
    if (!preferencias) return
    const anterior = preferencias
    const lista = anterior[campo] as string[]
    const nova = lista.includes(valor) ? lista.filter(item => item !== valor) : [...lista, valor]
    setErro('')
    setPreferencias({ ...anterior, [campo]: nova })
    try {
      setPreferencias(await atualizarPreferencias({ [campo]: nova }))
    } catch (error) {
      setPreferencias(anterior)
      setErro((error as Error).message)
    }
  }

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
      <Flex direction='column' alignItems='center' p='1.2rem 2rem 2.4rem'>
        <Text color='blueSlate' variant='caption' textAlign='center'>
          Defina suas rotas,
          <br />
          horários e outras preferências.
        </Text>
      </Flex>
      <Flex direction='column' gap='2.4rem' px='2rem'>
        {(erro || !preferencias) && (
          <Text color={erro ? 'systemDanger' : 'blueSlate'} textAlign='center' role='alert'>
            {erro || 'Carregando...'}
          </Text>
        )}
        <Flex direction='column' gap='0.8rem'>
          <Flex direction='column'>
            <Text color='prussianBlue' fontWeight='bold'>
              Cidades favoritas
            </Text>
            <Text color='blueSlate' variant='caption'>
              Selecione as cidades que você mais utiliza.
            </Text>
          </Flex>
          {(opcoes?.cidades ?? []).map(cidade => (
            <label key={cidade.id} style={cardStyle}>
              <Image
                src={icone_pref}
                alt='Ícone de preferência'
                width={16}
                height={16}
              />
              <Text color='prussianBlue' flex={1} ml='1.2rem' fontWeight='bold'>
                {cidade.nome}
              </Text>
              <input
                type='checkbox'
                checked={Boolean(preferencias?.cidadeIds.includes(cidade.id))}
                disabled={!preferencias}
                onChange={() => toggle('cidadeIds', cidade.id)}
                style={checkboxStyle}
              />
            </label>
          ))}
        </Flex>
        <Flex direction='column' gap='0.8rem'>
          <Flex direction='column'>
            <Text color='prussianBlue' fontWeight='bold'>
              Horários preferidos
            </Text>
            <Text color='blueSlate' variant='caption'>
              Selecione os períodos que mais viaja.
            </Text>
          </Flex>
          {turnos.map(([key, label]) => (
            <label
              key={key}
              style={{
                alignItems: 'center',
                cursor: 'pointer',
                display: 'flex',
                gap: '1rem',
              }}
            >
              <input
                type='checkbox'
                checked={Boolean(preferencias?.turnos.includes(key))}
                disabled={!preferencias}
                onChange={() => toggle('turnos', key)}
                style={checkboxStyle}
              />
              <Text color='prussianBlue' fontWeight='bold' variant='caption'>
                {label}
              </Text>
            </label>
          ))}
        </Flex>
        <Flex direction='column' gap='0.8rem'>
          <Flex direction='column'>
            <Text color='prussianBlue' fontWeight='bold'>
              Rotas favoritas
            </Text>
            <Text color='blueSlate' variant='caption'>
              Selecione as rotas que você mais utiliza.
            </Text>
          </Flex>
          {(opcoes?.rotas ?? []).map(rota => (
            <label key={rota.id} style={cardStyle}>
              <Image src={icone_seta} alt='Ícone de preferência' width={16} height={16} />
              <Text color='prussianBlue' flex={1} ml='1.2rem' fontWeight='bold'>
                {rota.nome}
              </Text>
              <input
                type='checkbox'
                checked={Boolean(preferencias?.rotaIds.includes(rota.id))}
                disabled={!preferencias}
                onChange={() => toggle('rotaIds', rota.id)}
                style={checkboxStyle}
              />
            </label>
          ))}
        </Flex>
      </Flex>
    </Flex>
  )
}

export default MinhasPreferencias

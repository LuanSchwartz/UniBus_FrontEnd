import { Flex, Text } from '@nexpy/design-system'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { type Dispatch, type SetStateAction, useState } from 'react'

import icone_pref from '../../../icons/icone_pref.svg'
import icone_seta from '../../../icons/icone_seta.svg'

const MinhasPreferencias = () => {
  const router = useRouter()
  const [cities, setCities] = useState({ pelotas: true, pedroOsorio: true })
  const [times, setTimes] = useState({ morning: true, afternoon: false, night: true })

  const toggle = <T extends Record<string, boolean>>(
    setState: Dispatch<SetStateAction<T>>,
    key: keyof T
  ) => setState(current => ({ ...current, [key]: !current[key] }))

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
        <Flex direction='column' gap='0.8rem'>
          <Flex direction='column'>
            <Text color='prussianBlue' fontWeight='bold'>
              Cidades favoritas
            </Text>
            <Text color='blueSlate' variant='caption'>
              Selecione as cidades que você mais utiliza.
            </Text>
          </Flex>
          {(
            [
              ['pelotas', 'Pelotas - RS'],
              ['pedroOsorio', 'Pedro Osório'],
            ] as const
          ).map(([key, label]) => (
            <label
              key={key}
              style={{
                alignItems: 'center',
                background: '#fff',
                border: '1px solid #CBD5E1',
                borderRadius: '1.2rem',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                padding: '1.4rem',
              }}
            >
              <Image
                src={icone_pref}
                alt='Ícone de preferência'
                width={16}
                height={16}
              />
              <Text color='prussianBlue' flex={1} ml='1.2rem' fontWeight='bold'>
                {label}
              </Text>
              <input
                type='checkbox'
                checked={cities[key]}
                onChange={() => toggle(setCities, key)}
                style={{ accentColor: '#2563EB', height: '1.8rem', width: '1.8rem' }}
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
          {(
            [
              ['morning', 'Manhã (06:00 - 12:00)'],
              ['afternoon', 'Tarde (12:00 - 18:00)'],
              ['night', 'Noite (18:00 - 23:00)'],
            ] as const
          ).map(([key, label]) => (
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
                checked={times[key]}
                onChange={() => toggle(setTimes, key)}
                style={{ accentColor: '#2563EB', height: '1.8rem', width: '1.8rem' }}
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
              Suas rotas mais frequentes.
            </Text>
          </Flex>
          <Flex
            bg='systemWhite'
            borderColor='paleSlate'
            borderRadius='1.2rem'
            borderStyle='solid'
            borderWidth='1px'
            alignItems='center'
            gap='1.2rem'
            p='1.4rem'
          >
              <Image
                src={icone_seta}
                alt='Ícone de preferência'
                width={16}
                height={16}
              />
            <Text color='prussianBlue' fontWeight='bold'>
              Pedro Osório → Pelotas
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default MinhasPreferencias

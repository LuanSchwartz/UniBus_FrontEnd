import { Button, Flex, Text } from '@nexpy/design-system'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'

import iconCalendar from '../../../icons/iconcalendar.svg'
import iconPin from '../../../icons/iconpin.svg'
import profileImage from '../../../icons/imagemperfil.svg'

type PersonalField = {
  id: keyof PersonalData
  label: string
  icon?: typeof iconCalendar
  type?: 'date' | 'email' | 'tel' | 'text'
}

type PersonalData = {
  name: string
  email: string
  phone: string
  birthDate: string
  university: string
  course: string
  hometown: string
}

const personalFields: PersonalField[] = [
  { id: 'name', label: 'Nome completo' },
  { id: 'email', label: 'E-mail', type: 'email' },
  { id: 'phone', label: 'Telefone', type: 'tel' },
  {
    id: 'birthDate',
    label: 'Data de nascimento',
    icon: iconCalendar,
  },
  { id: 'university', label: 'Universidade' },
  { id: 'course', label: 'Curso' },
  {
    id: 'hometown',
    label: 'Cidade de origem',
    icon: iconPin,
  },
]

const initialPersonalData: PersonalData = {
  name: 'Ana Clara Silva',
  email: 'ana.clara@senacrs.edu.br',
  phone: '(53) 9 9123-4567',
  birthDate: '14/03/2003',
  university: 'Centro Universitário Senac-RS',
  course: 'Análise e Desenvolvimento de Sistemas',
  hometown: 'Pedro Osório - RS',
}

const MeusDados = () => {
  const router = useRouter()
  const [personalData, setPersonalData] = useState<PersonalData>(initialPersonalData)
  const [savedData, setSavedData] = useState<PersonalData>(initialPersonalData)
  const [errors, setErrors] = useState<Partial<Record<keyof PersonalData, string>>>({})
  const isDirty = Object.keys(personalData).some(
    key =>
      personalData[key as keyof PersonalData] !== savedData[key as keyof PersonalData]
  )

  const handleSave = () => {
    const nextErrors: Partial<Record<keyof PersonalData, string>> = {}

    if (personalData.name.trim().length < 3) {
      nextErrors.name = 'Informe seu nome completo.'
    }

    if (!/^\S+@\S+\.\S+$/.test(personalData.email)) {
      nextErrors.email = 'Informe um e-mail válido.'
    }

    if (!/^\(\d{2}\)\s\d\s\d{4}-\d{4}$/.test(personalData.phone)) {
      nextErrors.phone = 'Use o formato (00) 0 0000-0000.'
    }

    const [day, month, year] = personalData.birthDate.split('/').map(Number)
    const birthDate = new Date(year, month - 1, day)
    const isValidBirthDate =
      birthDate.getFullYear() === year &&
      birthDate.getMonth() === month - 1 &&
      birthDate.getDate() === day &&
      birthDate <= new Date()

    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(personalData.birthDate) || !isValidBirthDate) {
      nextErrors.birthDate = 'Informe uma data de nascimento válida.'
    }

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length === 0) {
      setSavedData(personalData)
    }
  }

  return (
    <Flex
      direction='column'
      bg='grey200'
      minHeight='100vh'
      pb={isDirty ? '18rem' : '10rem'}
    >
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
          Meus dados
        </Text>
      </Flex>

      <Flex direction='column' alignItems='center' gap='0.6rem' p='1.8rem 2rem 1.4rem'>
        <Text color='blueSlate' variant='caption' textAlign='center'>
          Visualize e edite suas
          <br />
          informações pessoais.
        </Text>
        <Flex
          w='8rem'
          h='8rem'
          minWidth='8rem'
          minHeight='8rem'
          mt='0.6rem'
          borderRadius='50%'
          alignItems='center'
          justifyContent='center'
          bg='grey100'
          style={{ overflow: 'hidden' }}
        >
          <Image
            src={profileImage}
            alt='Imagem de perfil de Ana Clara Silva'
            width={80}
            height={80}
            style={{ height: '100%', objectFit: 'cover', width: '100%' }}
          />
        </Flex>
        <Text color='blueSlate'>Estudante</Text>
        <Text fontSize='2rem' fontWeight='bold' color='prussianBlue'>
          Ana Clara Silva
        </Text>
      </Flex>

      <Flex direction='column' gap='1rem' px='2rem'>
        {personalFields.map(field => (
          <Flex
            key={field.label}
            as='label'
            direction='column'
            bg='systemWhite'
            borderColor={errors[field.id] ? 'systemDanger' : 'paleSlate'}
            borderRadius='1.2rem'
            borderStyle='solid'
            borderWidth='1px'
            gap='0.5rem'
            minHeight='5.6rem'
            justifyContent='center'
            p='1rem 1.2rem'
            position='relative'
          >
            <Text color='coolSteal' variant='caption'>
              {field.label}
            </Text>
            <input
              aria-label={field.label}
              type={field.type ?? 'text'}
              value={personalData[field.id]}
              onChange={event => {
                setPersonalData(currentData => ({
                  ...currentData,
                  [field.id]: event.target.value,
                }))
                setErrors(currentErrors => ({ ...currentErrors, [field.id]: undefined }))
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#132A4D',
                fontSize: '1.2rem',
                fontWeight: 700,
                outline: 'none',
                padding: 0,
                paddingRight: field.icon ? '3rem' : 0,
                width: '100%',
              }}
            />
            {field.icon && (
              <Flex
                alignSelf='flex-end'
                position='absolute'
                right='1.2rem'
                top='50%'
                style={{ pointerEvents: 'none', transform: 'translateY(-50%)' }}
              >
                <Image src={field.icon} alt='' width={20} height={20} />
              </Flex>
            )}
            {errors[field.id] && (
              <Text color='systemDanger' variant='caption'>
                {errors[field.id]}
              </Text>
            )}
          </Flex>
        ))}

      </Flex>

      {isDirty && (
        <Flex
          bg='systemWhite'
          bottom='8rem'
          left={0}
          p='1.6rem 2rem'
          position='fixed'
          right={0}
        >
          <Button
            onClick={handleSave}
            size='auto'
            bg='royalAzure'
            borderRadius='1.5rem'
            color='systemWhite'
            flex={1}
            fontSize='1.8rem'
            fontWeight='bold'
            minHeight='5.2rem'
            textTransform='none'
          >
            Salvar alterações
          </Button>
        </Flex>
      )}
    </Flex>
  )
}

export default MeusDados

import { Button, Flex, Text } from '@nexpy/design-system'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { type Usuario, atualizarUsuario, getUsuario, perfilLabel } from '@/services/api'

import iconCalendar from '../../../icons/iconcalendar.svg'
import iconPin from '../../../icons/iconpin.svg'
import foto_perfil from '../../../icons/foto_perfil.png'

type PersonalField = {
  id: keyof PersonalData
  label: string
  icon?: typeof iconCalendar
  type?: 'date' | 'email' | 'tel' | 'text'
  editable?: boolean
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
  { id: 'name', label: 'Nome completo', editable: true },
  { id: 'email', label: 'E-mail', type: 'email' },
  { id: 'phone', label: 'Telefone', type: 'tel', editable: true },
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

const emptyPersonalData: PersonalData = {
  name: '',
  email: '',
  phone: '',
  birthDate: '',
  university: '',
  course: '',
  hometown: '',
}

// O back guarda o telefone só com dígitos: DDD + 8 ou 9 dígitos, com 55 opcional.
const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, '').replace(/^55(?=\d{10,11}$)/, '')
  if (digits.length === 11) return digits.replace(/^(\d{2})(\d)(\d{4})(\d{4})$/, '($1) $2 $3-$4')
  if (digits.length === 10) return digits.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3')
  return value
}

const toPersonalData = (usuario: Usuario): PersonalData => ({
  name: usuario.nome,
  email: usuario.email,
  phone: formatPhone(usuario.telefone),
  birthDate: usuario.dataNascimento?.split('-').reverse().join('/') ?? '',
  university: usuario.estudante
    ? `${usuario.estudante.unidadeEnsino.instituicaoEnsino.nome} - ${usuario.estudante.unidadeEnsino.nome}`
    : '',
  course: usuario.estudante?.curso ?? '',
  hometown: usuario.estudante?.cidadeOrigem?.nome ?? '',
})

// Mesmas regras do back (usuarios.schemas.ts), para o erro aparecer antes de enviar.
const validate = (data: PersonalData) => {
  const nextErrors: Partial<Record<keyof PersonalData, string>> = {}
  const name = data.name.trim()

  if (name.length < 2) nextErrors.name = 'Informe seu nome completo.'
  else if (name.length > 150) nextErrors.name = 'O nome pode ter no máximo 150 caracteres.'

  if (!/^[\d\s()+-]+$/.test(data.phone.trim())) {
    nextErrors.phone = 'Use apenas números, espaços, parênteses, + e -.'
  } else if (!/^(?:55)?[1-9]{2}\d{8,9}$/.test(data.phone.replace(/\D/g, ''))) {
    nextErrors.phone = 'Informe DDD e telefone, ex.: (53) 9 9123-4567.'
  }

  return nextErrors
}

const MeusDados = () => {
  const router = useRouter()
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [personalData, setPersonalData] = useState<PersonalData>(emptyPersonalData)
  const [savedData, setSavedData] = useState<PersonalData>(emptyPersonalData)
  const [errors, setErrors] = useState<Partial<Record<keyof PersonalData, string>>>({})
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; text: string } | null>(null)
  const [saving, setSaving] = useState(false)
  const isDirty = Object.keys(personalData).some(
    key =>
      personalData[key as keyof PersonalData] !== savedData[key as keyof PersonalData]
  )

  const applyUsuario = (data: Usuario) => {
    setUsuario(data)
    setPersonalData(toPersonalData(data))
    setSavedData(toPersonalData(data))
  }

  useEffect(() => {
    getUsuario()
      .then(applyUsuario)
      .catch(error => setFeedback({ type: 'error', text: error.message }))
  }, [])

  const handleSave = async () => {
    const nextErrors = validate(personalData)
    setErrors(nextErrors)
    setFeedback(null)

    if (Object.keys(nextErrors).length > 0) return

    const changes: { nome?: string; telefone?: string } = {}
    if (personalData.name !== savedData.name) changes.nome = personalData.name.trim()
    if (personalData.phone !== savedData.phone) changes.telefone = personalData.phone.replace(/\D/g, '')

    setSaving(true)
    try {
      applyUsuario(await atualizarUsuario(changes))
      setFeedback({ type: 'success', text: 'Dados atualizados com sucesso.' })
    } catch (error) {
      setFeedback({ type: 'error', text: (error as Error).message })
    } finally {
      setSaving(false)
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
            src={foto_perfil}
            alt={`Imagem de perfil de ${usuario?.nome ?? ''}`}
            width={80}
            height={80}
            style={{ height: '100%', objectFit: 'cover', width: '100%' }}
          />
        </Flex>
        <Text color='blueSlate'>{usuario ? perfilLabel[usuario.perfil] : ''}</Text>
        <Text fontSize='2rem' fontWeight='bold' color='prussianBlue'>
          {usuario?.nome}
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
              readOnly={!field.editable}
              maxLength={field.id === 'name' ? 150 : undefined}
              onChange={event => {
                setPersonalData(currentData => ({
                  ...currentData,
                  [field.id]: event.target.value,
                }))
                setErrors(currentErrors => ({ ...currentErrors, [field.id]: undefined }))
                setFeedback(null)
              }}
              onBlur={() => {
                if (field.id === 'phone') {
                  setPersonalData(currentData => ({ ...currentData, phone: formatPhone(currentData.phone) }))
                }
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: field.editable ? '#132A4D' : '#64748B',
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

        <Text color='coolSteal' variant='caption' textAlign='center'>
          E-mail, data de nascimento e dados acadêmicos só podem ser alterados pela secretaria.
        </Text>

        {feedback && (
          <Text
            color={feedback.type === 'error' ? 'systemDanger' : 'systemSafe'}
            textAlign='center'
            role={feedback.type === 'error' ? 'alert' : 'status'}
          >
            {feedback.text}
          </Text>
        )}
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
            disabled={saving}
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
            {saving ? 'Salvando...' : 'Salvar alterações'}
          </Button>
        </Flex>
      )}
    </Flex>
  )
}

export default MeusDados

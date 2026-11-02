import { Flex, Text } from '@nexpy/design-system'
import type { FormEvent } from 'react'

import type { AdminRecords, AdminSection } from '@/types/admin'
import { fields, type AdminField, sectionLabels } from '../config/adminConfig'

type Props = {
  section: AdminSection
  records: AdminRecords
  form: Record<string, string>
  isSubmitting: boolean
  error: string
  onChange: (field: string, value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

const inputStyle = {
  border: '1px solid #CBD5E1',
  borderRadius: '0.8rem',
  flex: '1 1 24rem',
  minWidth: 0,
  fontSize: '1.1rem',
  minHeight: '4.2rem',
  padding: '0 1.2rem',
  background: '#FFFFFF',
  color: '#132A4D',
  width: '100%',
  boxSizing: 'border-box' as const,
}

const SelectField = ({ field, value, options, onChange, multiple = false }: {
  field: AdminField
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
  multiple?: boolean
}) => (
  <select
    key={field.name}
    required={!(!multiple && field.name === 'publicoPerfil')}
    multiple={multiple}
    value={multiple ? value.split(',').filter(Boolean) : value}
    onChange={event => onChange(multiple
      ? Array.from(event.target.selectedOptions, option => option.value).join(',')
      : event.target.value)}
    style={multiple ? { ...inputStyle, minHeight: '9rem', padding: '1rem 1.2rem' } : inputStyle}
  >
    {!multiple && <option value=''>{field.name === 'unidadeEnsinoId' ? 'Selecione a faculdade/unidade de ensino' : `Selecione ${field.label.toLowerCase()}`}</option>}
    {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
  </select>
)

const AdminForm = ({ section, records, form, isSubmitting, error, onChange, onSubmit }: Props) => {
  const renderField = (field: AdminField) => {
    if (field.name === 'unidadeEnsinoId') {
      return <SelectField field={field} value={form[field.name] ?? ''} options={records.faculdades.map(record => ({ value: String(record.id), label: record.name }))} onChange={value => onChange(field.name, value)} />
    }
    if (field.name === 'pontosParada') {
      return <SelectField field={field} value={form[field.name] ?? ''} multiple options={records.pontosParada.map(record => ({ value: String(record.id), label: record.name }))} onChange={value => onChange(field.name, value)} />
    }
    if (field.name === 'rotaId' && section === 'escalas') {
      return <SelectField field={field} value={form[field.name] ?? ''} options={records.rotas.map(record => ({ value: String(record.id), label: record.name }))} onChange={value => onChange(field.name, value)} />
    }
    if (field.name === 'motoristaId') {
      return <SelectField field={field} value={form[field.name] ?? ''} options={records.motoristas.map(record => ({ value: String(record.id), label: record.name }))} onChange={value => onChange(field.name, value)} />
    }
    if (field.name === 'veiculoId') {
      return <SelectField field={field} value={form[field.name] ?? ''} options={records.veiculos.map(record => ({ value: String(record.id), label: record.name }))} onChange={value => onChange(field.name, value)} />
    }
    if (field.type === 'textarea') {
      return <textarea key={field.name} required value={form[field.name] ?? ''} onChange={event => onChange(field.name, event.target.value)} placeholder={field.label} style={{ ...inputStyle, minHeight: '9rem', paddingTop: '1rem' }} />
    }
    if (field.type === 'select') {
      return <SelectField field={field} value={form[field.name] ?? ''} options={field.options ?? []} onChange={value => onChange(field.name, value)} />
    }
    return <input key={field.name} required type={field.type ?? 'text'} value={form[field.name] ?? ''} onChange={event => onChange(field.name, event.target.value)} placeholder={field.label} style={inputStyle} />
  }

  return (
    <Flex className='admin-panel' bg='#FFFFFF' border='1px solid #E8EEF5' borderRadius='1.2rem' boxShadow='0 10px 30px rgba(15, 23, 42, 0.05)' direction='column' gap='1.2rem' mb='2rem' p='2rem'>
      <Flex alignItems='center' gap='0.8rem'>
        <Flex alignItems='center' bg='#EAF0FF' borderRadius='0.6rem' color='#2F5FD8' fontSize='1.1rem' fontWeight='bold' h='2.4rem' justifyContent='center' w='2.4rem'>+</Flex>
        <Text color='#132A4D' fontSize='1.35rem' fontWeight='bold'>Cadastrar {sectionLabels[section].slice(0, -1).toLowerCase()}</Text>
      </Flex>
      <form className='admin-form' onSubmit={onSubmit}>
        {fields[section].map(renderField)}
        <button className='submit-button' type='submit' disabled={isSubmitting} style={{ background: '#2F5FD8', border: 'none', borderRadius: '0.8rem', color: '#FFFFFF', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold', minHeight: '4.2rem', padding: '0 2rem' }}>
          {isSubmitting ? 'Salvando...' : 'Cadastrar'}
        </button>
      </form>
      {error && <Text color='#DC2626' fontSize='1rem'>{error}</Text>}
    </Flex>
  )
}

export default AdminForm

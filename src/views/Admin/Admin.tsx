import { Flex, Text } from '@nexpy/design-system'
import { type FormEvent, useEffect, useState } from 'react'

import { adminService } from '@/services/adminService'
import type { AdminRecords, AdminSection } from '@/types/admin'
import AdminForm from './components/AdminForm'
import AdminRecordList from './components/AdminRecordList'
import AdminSidebar from './components/AdminSidebar'
import { sectionLabels } from './config/adminConfig'

const emptyRecords: AdminRecords = {
  alunos: [],
  motoristas: [],
  faculdades: [],
  avisos: [],
  viagens: [],
  veiculos: [],
  pontosParada: [],
  rotas: [],
  escalas: [],
}

const Admin = () => {
  const [section, setSection] = useState<AdminSection>('alunos')
  const [records, setRecords] = useState<AdminRecords>(emptyRecords)
  const [form, setForm] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    void adminService.list(section).then(items => {
      if (active) setRecords(current => ({ ...current, [section]: items }))
    }).catch(() => {
      if (active) setError('Não foi possível carregar os registros.')
    }).finally(() => {
      if (active) setIsLoading(false)
    })
    return () => { active = false }
  }, [section])

  const changeSection = (nextSection: AdminSection) => {
    setSection(nextSection)
    setForm({})
    setError('')
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')
    try {
      const values = Object.entries(form).map(([name, value]) => `${name}: ${value}`)
      const record = await adminService.create(section, {
        name: form.nome ?? form.titulo ?? form.identificacao ?? form.nomeRota ?? sectionLabels[section],
        detail: values.join(' | '),
      })
      setRecords(current => ({ ...current, [section]: [...current[section], record] }))
      setForm({})
    } catch {
      setError('Não foi possível cadastrar este registro.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Flex className='admin-shell' bg='#F6F8FC' minHeight='100vh'>
      <AdminSidebar section={section} onChangeSection={changeSection} />
      <Flex className='admin-content' direction='column' flex={1} p='3rem' maxWidth='100rem'>
        <Flex alignItems='flex-start' justifyContent='space-between' mb='2.4rem'>
          <Flex direction='column' gap='0.5rem'>
            <Text color='#132A4D' fontSize='2.6rem' fontWeight='bold'>{sectionLabels[section]}</Text>
            <Text color='#64748B' fontSize='1.1rem'>Gerencie os registros do sistema com praticidade.</Text>
          </Flex>
          <Text className='section-badge' color='#2F5FD8' fontSize='0.9rem' fontWeight='bold'>PAINEL ADMIN</Text>
        </Flex>

        <AdminForm
          section={section}
          records={records}
          form={form}
          isSubmitting={isSubmitting}
          error={error}
          onChange={(field, value) => setForm(current => ({ ...current, [field]: value }))}
          onSubmit={submit}
        />
        <AdminRecordList records={records[section]} isLoading={isLoading} />
      </Flex>
      <style jsx>{`
        :global(.admin-sidebar) {
          flex: 0 0 20rem;
          box-sizing: border-box;
          box-shadow: 8px 0 24px rgba(15, 23, 42, 0.08);
        }

        :global(.admin-nav) {
          transition: background 160ms ease, transform 160ms ease;
        }

        :global(.admin-nav:hover) {
          background: rgba(255, 255, 255, 0.1) !important;
          transform: translateX(3px);
        }

        :global(.admin-nav-active:hover) {
          background: #2F5FD8 !important;
        }

        .admin-content {
          width: 100%;
          box-sizing: border-box;
          margin: 0 auto;
        }

        .section-badge {
          background: #EAF0FF;
          border-radius: 999px;
          letter-spacing: 0.08em;
          padding: 0.65rem 0.9rem;
        }

        :global(.admin-form) {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1rem;
          min-width: 0;
        }

        :global(.admin-form > *) {
          box-sizing: border-box;
          min-width: 0;
          max-width: 100%;
        }

        :global(.admin-form input),
        :global(.admin-form select),
        :global(.admin-form textarea) {
          transition: border-color 160ms ease, box-shadow 160ms ease;
        }

        :global(.admin-form input:focus),
        :global(.admin-form select:focus),
        :global(.admin-form textarea:focus) {
          border-color: #2F5FD8 !important;
          box-shadow: 0 0 0 3px rgba(47, 95, 216, 0.12);
          outline: none;
        }

        :global(.submit-button) {
          transition: background 160ms ease, transform 160ms ease, box-shadow 160ms ease;
        }

        :global(.submit-button:hover:not(:disabled)) {
          background: #244DB5 !important;
          box-shadow: 0 8px 18px rgba(47, 95, 216, 0.25);
          transform: translateY(-1px);
        }

        :global(.record-row) {
          transition: border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease;
        }

        :global(.record-row:hover) {
          border-color: #B9C9F5 !important;
          box-shadow: 0 6px 16px rgba(15, 23, 42, 0.05);
          transform: translateY(-1px);
        }

        @media (min-width: 1100px) {
          .admin-content {
            max-width: 88rem;
            padding-left: 4rem;
            padding-right: 4rem;
          }
        }

        @media (max-width: 760px) {
          .admin-shell {
            display: block;
          }

          :global(.admin-sidebar) {
            min-height: 0;
            width: 100%;
          }

          :global(.admin-nav) {
            display: inline-block;
            margin: 0.2rem;
            padding: 0.75rem;
          }

          .admin-content {
            padding: 1.25rem;
          }

          .section-badge {
            display: none;
          }

          :global(.admin-form) {
            grid-template-columns: minmax(0, 1fr);
          }

          :global(.admin-form > *) {
            width: 100%;
          }

          :global(.submit-button) {
            width: 100%;
          }
        }
      `}</style>
    </Flex>
  )
}

export default Admin

import type {
  AdminRecord,
  AdminRecords,
  AdminSection,
  CreateAdminRecordInput,
} from '@/types/admin'

const initialRecords: AdminRecords = {
  alunos: [
    { id: 1, name: 'Ana Clara Silva', detail: 'ana.clara@email.com' },
    { id: 2, name: 'João Pedro Souza', detail: 'joao.pedro@email.com' },
  ],
  motoristas: [{ id: 1, name: 'Carlos Eduardo', detail: 'CNH 01234567890' }],
  faculdades: [
    {
      id: 1,
      name: 'Instituto Federal Sul-rio-grandense',
      detail: 'Pelotas - RS',
    },
  ],
  avisos: [],
  viagens: [],
  veiculos: [],
  pontosParada: [],
  rotas: [],
  escalas: [],
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL

const request = async <Response>(path: string, options?: RequestInit): Promise<Response> => {
  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`Não foi possível concluir a operação (${response.status}).`)
  }

  return response.json() as Promise<Response>
}

const apiService = {
  async list(section: AdminSection) {
    return request<AdminRecord[]>(`/admin/${section}`)
  },

  async create(section: AdminSection, input: CreateAdminRecordInput) {
    return request<AdminRecord>(`/admin/${section}`, {
      method: 'POST',
      body: JSON.stringify(input),
    })
  },
}

const localService = {
  records: structuredClone(initialRecords),

  async list(section: AdminSection) {
    return this.records[section]
  },

  async create(section: AdminSection, input: CreateAdminRecordInput) {
    const record = {
      id: `local-${Date.now()}`,
      ...input,
    }
    this.records[section] = [...this.records[section], record]
    return record
  },
}

export const adminService = apiUrl ? apiService : localService

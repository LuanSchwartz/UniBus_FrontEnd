export type AdminSection =
  | 'alunos'
  | 'motoristas'
  | 'faculdades'
  | 'avisos'
  | 'viagens'
  | 'veiculos'
  | 'pontosParada'
  | 'rotas'
  | 'escalas'

export type AdminRecord = {
  id: number | string
  name: string
  detail: string
}

export type CreateAdminRecordInput = {
  name: string
  detail: string
}

export type AdminRecords = Record<AdminSection, AdminRecord[]>

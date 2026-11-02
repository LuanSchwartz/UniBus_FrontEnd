import type { AdminSection } from '@/types/admin'

export type AdminField = {
  name: string
  label: string
  type?: 'date' | 'datetime-local' | 'email' | 'number' | 'password' | 'select' | 'textarea' | 'time'
  options?: { value: string; label: string }[]
}

export const sectionLabels: Record<AdminSection, string> = {
  alunos: 'Alunos',
  motoristas: 'Motoristas',
  faculdades: 'Faculdades',
  avisos: 'Avisos',
  viagens: 'Viagens',
  veiculos: 'Veículos',
  pontosParada: 'Pontos de parada',
  rotas: 'Rotas',
  escalas: 'Escalas semanais',
}

export const fields: Record<AdminSection, AdminField[]> = {
  alunos: [
    { name: 'nome', label: 'Nome completo' },
    { name: 'cpf', label: 'CPF (11 dígitos)' },
    { name: 'email', label: 'E-mail', type: 'email' },
    { name: 'telefone', label: 'Telefone' },
    { name: 'senha', label: 'Senha', type: 'password' },
    { name: 'matricula', label: 'Matrícula' },
    { name: 'previsaoConclusao', label: 'Previsão de conclusão', type: 'date' },
    { name: 'unidadeEnsinoId', label: 'Unidade de ensino' },
  ],
  motoristas: [
    { name: 'nome', label: 'Nome completo' },
    { name: 'cpf', label: 'CPF (11 dígitos)' },
    { name: 'email', label: 'E-mail', type: 'email' },
    { name: 'telefone', label: 'Telefone' },
    { name: 'senha', label: 'Senha', type: 'password' },
    { name: 'numeroCnh', label: 'Número da CNH' },
    { name: 'categoriaCnh', label: 'Categoria da CNH' },
    { name: 'validadeCnh', label: 'Validade da CNH', type: 'date' },
  ],
  faculdades: [
    { name: 'nomeInstituicao', label: 'Nome da instituição' },
    { name: 'tipoInstituicao', label: 'Tipo da instituição', type: 'select', options: [
      { value: 'FACULDADE', label: 'Faculdade' },
      { value: 'TECNICA', label: 'Técnica' },
      { value: 'PREPARATORIA', label: 'Preparatória' },
    ] },
    { name: 'nomeUnidade', label: 'Nome da unidade de ensino' },
    { name: 'endereco', label: 'Endereço da unidade' },
    { name: 'pontoParadaId', label: 'ID do ponto de parada' },
  ],
  avisos: [
    { name: 'titulo', label: 'Título' },
    { name: 'mensagem', label: 'Mensagem', type: 'textarea' },
    { name: 'publicoPerfil', label: 'Público', type: 'select', options: [
      { value: '', label: 'Todos os perfis' },
      { value: 'ESTUDANTE', label: 'Estudantes' },
      { value: 'MOTORISTA', label: 'Motoristas' },
      { value: 'OPERADOR', label: 'Operadores' },
    ] },
    { name: 'expiraEm', label: 'Expira em', type: 'datetime-local' },
  ],
  viagens: [
    { name: 'data', label: 'Data', type: 'date' },
    { name: 'turno', label: 'Turno', type: 'select', options: [
      { value: 'MANHA', label: 'Manhã' },
      { value: 'TARDE', label: 'Tarde' },
      { value: 'NOITE', label: 'Noite' },
    ] },
    { name: 'nomeRota', label: 'Nome da rota' },
    { name: 'rotaId', label: 'ID da rota' },
  ],
  veiculos: [
    { name: 'identificacao', label: 'Identificação' },
    { name: 'placa', label: 'Placa' },
    { name: 'tipo', label: 'Tipo', type: 'select', options: [
      { value: 'ONIBUS', label: 'Ônibus' },
      { value: 'VAN', label: 'Van' },
    ] },
    { name: 'capacidade', label: 'Capacidade', type: 'number' },
  ],
  pontosParada: [
    { name: 'nome', label: 'Nome do ponto' },
    { name: 'cidade', label: 'Cidade' },
    { name: 'endereco', label: 'Endereço' },
    { name: 'referencia', label: 'Referência' },
  ],
  rotas: [
    { name: 'nome', label: 'Nome da rota' },
    { name: 'descricao', label: 'Descrição' },
    { name: 'pontosParada', label: 'Pontos de parada', type: 'select' },
  ],
  escalas: [
    { name: 'diaSemana', label: 'Dia da semana', type: 'select', options: [
      { value: 'SEGUNDA', label: 'Segunda-feira' },
      { value: 'TERCA', label: 'Terça-feira' },
      { value: 'QUARTA', label: 'Quarta-feira' },
      { value: 'QUINTA', label: 'Quinta-feira' },
      { value: 'SEXTA', label: 'Sexta-feira' },
    ] },
    { name: 'turno', label: 'Turno', type: 'select', options: [
      { value: 'MANHA', label: 'Manhã' },
      { value: 'TARDE', label: 'Tarde' },
      { value: 'NOITE', label: 'Noite' },
    ] },
    { name: 'rotaId', label: 'Rota', type: 'select' },
    { name: 'motoristaId', label: 'Motorista', type: 'select' },
    { name: 'veiculoId', label: 'Veículo', type: 'select' },
    { name: 'saidaIda', label: 'Horário de saída (ida)', type: 'time' },
    { name: 'saidaVolta', label: 'Horário de saída (volta)', type: 'time' },
  ],
}

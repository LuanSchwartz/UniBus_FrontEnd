import { Flex, Text } from '@nexpy/design-system'

import type { AdminRecord } from '@/types/admin'

type Props = {
  records: AdminRecord[]
  isLoading: boolean
}

const AdminRecordList = ({ records, isLoading }: Props) => (
  <Flex className='admin-panel' bg='#FFFFFF' border='1px solid #E8EEF5' borderRadius='1.2rem' boxShadow='0 10px 30px rgba(15, 23, 42, 0.05)' direction='column' gap='0.8rem' p='2rem'>
    <Flex alignItems='center' justifyContent='space-between' mb='0.6rem'>
      <Text color='#132A4D' fontSize='1.35rem' fontWeight='bold'>Registros cadastrados</Text>
      <Text color='#94A3B8' fontSize='0.9rem'>{records.length} registro{records.length === 1 ? '' : 's'}</Text>
    </Flex>
    {isLoading ? <Text color='#64748B'>Carregando registros...</Text> : records.map(record => (
      <Flex className='record-row' key={record.id} alignItems='center' border='1px solid #E8EEF5' borderRadius='0.8rem' justifyContent='space-between' p='1.2rem'>
        <Flex direction='column' gap='0.2rem'>
          <Text color='#132A4D' fontWeight='bold'>{record.name}</Text>
          <Text color='#64748B' variant='caption'>{record.detail}</Text>
        </Flex>
        <Text color='#16A34A' fontSize='1rem' fontWeight='bold'>Ativo</Text>
      </Flex>
    ))}
  </Flex>
)

export default AdminRecordList

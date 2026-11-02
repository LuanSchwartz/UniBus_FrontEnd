import { Flex, Text } from '@nexpy/design-system'

import type { AdminSection } from '@/types/admin'
import { sectionLabels } from '../config/adminConfig'

type Props = {
  section: AdminSection
  onChangeSection: (section: AdminSection) => void
}

const AdminSidebar = ({ section, onChangeSection }: Props) => (
  <Flex className='admin-sidebar' as='aside' bg='#132A4D' direction='column' minHeight='100vh' p='2rem 1.4rem' w='24rem'>
    <Flex alignItems='center' gap='0.8rem' mb='0.5rem'>
      <Flex alignItems='center' bg='#2F5FD8' borderRadius='0.8rem' color='#FFFFFF' fontSize='1.4rem' fontWeight='bold' h='3rem' justifyContent='center' w='3rem'>U</Flex>
      <Text color='systemWhite' fontSize='2rem' fontWeight='bold'>UniBus</Text>
    </Flex>
    <Text color='paleSlate' fontSize='1rem' mb='3rem' pl='3.8rem'>Painel administrativo</Text>
    <Text color='paleSlate' fontSize='0.75rem' fontWeight='bold' mb='1rem'>GERENCIAMENTO</Text>
    {(Object.keys(sectionLabels) as AdminSection[]).map(item => (
      <button className={`admin-nav ${section === item ? 'admin-nav-active' : ''}`} key={item} type='button' onClick={() => onChangeSection(item)} style={{
        background: section === item ? '#2F5FD8' : 'transparent', border: 'none',
        borderRadius: '0.8rem', color: '#FFFFFF', cursor: 'pointer', fontSize: '1.2rem',
        marginBottom: '0.6rem', padding: '1rem', textAlign: 'left',
      }}>{sectionLabels[item]}</button>
    ))}
  </Flex>
)

export default AdminSidebar

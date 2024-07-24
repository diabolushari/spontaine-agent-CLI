import { SidebarSection, UserRole } from './DashboardSidebarLinks'
import { Link } from '@inertiajs/react'
import { useMemo } from 'react'
import AccordionItem from '@/ui/Accordian/AccordianItem'

interface SidebarItemProps {
  role: UserRole | null
  sidebar: SidebarSection
}

const SidebarItem = ({ role, sidebar }: SidebarItemProps) => {
  //modify sidebar links to include only those that the user has permission to view
  const filteredLinks = useMemo(() => {
    return sidebar.links
    // if (role) {
    //   return sidebar.links.filter((item) => {
    //     if (role.superUser) return true
    //     return role.permissions.find((perm) => perm.permission === item.permission)
    //   })
    // }
    // return []
  }, [role, sidebar])

  return (
    <>
      {filteredLinks.length > 0 && (
        <AccordionItem title={sidebar.title}>
          {filteredLinks.map((item) => {
            return (
              <div
                className='flex w-full items-center justify-between'
                key={item.title}
              >
                <Link
                  as='a'
                  className='flex w-full cursor-pointer items-center p-2 py-1 text-white hover:bg-gray-50 hover:text-gray-700'
                  href={item.link}
                >
                  <span className='ml-2 text-sm'>{item.title}</span>
                </Link>
              </div>
            )
          })}
        </AccordionItem>
      )}
    </>
  )
}

export default SidebarItem

import AddUserForm from '@/Components/UserGroup/AddUserForm'
import useCustomForm from '@/hooks/useCustomForm'
import { UserGroup } from '@/interfaces/data_interfaces'
import AnalyticsDashboardLayout from '@/Layouts/AnalyticsDashboardLayout'
import DashboardLayout from '@/Layouts/DashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import { getDisplayDate } from '@/libs/dates'
import Button from '@/ui/button/Button'
import Card from '@/ui/Card/Card'
import CardHeader from '@/ui/Card/CardHeader'
import Input from '@/ui/form/Input'
import Modal from '@/ui/Modal/Modal'
import JobsTable from '@/ui/Table/JobsTable'
import Tab from '@/ui/Tabs/Tab'
import { router } from '@inertiajs/react'
import { tr } from 'framer-motion/client'
import { FormEvent, useState } from 'react'

interface Properties {
  userGroup: UserGroup
}

const UserGroupShowPage = ({ userGroup }: Properties) => {
  const [addUserModal, setAddUserModal] = useState(false)
  const tabItems = [{ name: 'Users', value: 'users' }]
  const [activeTab, setActiveTab] = useState('users')
  const { formData, setFormValue } = useCustomForm({
    search: '',
  })

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    router.get(route('manage-user-group.show', userGroup.id), {
      ...formData,
    })
  }
  return (
    <AnalyticsDashboardLayout
      type='data'
      subtype='data-tables'
    >
      <DashboardPadding>
        <div className='flex flex-col gap-8'>
          {/* Header */}
          <CardHeader title={`User Group: ${userGroup.group_name}`} />

          {/* Basic Information Section */}
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <div className='rounded-xl border border-gray-100 bg-white p-6 shadow-sm'>
              <h3 className='mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500'>
                Basic Information
              </h3>

              <div className='space-y-4'>
                <div>
                  <p className='text-xs font-medium text-gray-400'>Group Name</p>
                  <p className='text-lg font-semibold text-gray-900'>{userGroup.group_name}</p>
                </div>

                <div>
                  <p className='text-xs font-medium text-gray-400'>Description</p>
                  <p className='whitespace-pre-wrap text-base text-gray-700'>
                    {userGroup.description || '—'}
                  </p>
                </div>

                <div>
                  <p className='text-xs font-medium text-gray-400'>Created At</p>
                  <p className='text-sm text-gray-700'>{getDisplayDate(userGroup.created_at)}</p>
                </div>
              </div>
            </div>

            {/* Permissions Section */}
            <div className='rounded-xl border border-indigo-100 bg-indigo-50/40 p-6 shadow-sm'>
              <h3 className='mb-4 text-sm font-semibold uppercase tracking-wider text-indigo-600'>
                Permissions
              </h3>

              {userGroup.permissions?.length > 0 ? (
                <div className='flex flex-wrap gap-3'>
                  {userGroup.permissions.map((perm, index) => (
                    <div
                      key={index}
                      className='rounded-xl border border-indigo-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm'
                    >
                      {perm.role}
                    </div>
                  ))}
                </div>
              ) : (
                <p className='text-sm text-gray-500'>No permissions assigned.</p>
              )}
            </div>
          </div>

          {/* Users Section */}
          <div className='flex flex-col gap-6'>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='text-lg font-semibold text-gray-900'>Users</h3>
                <p className='text-xs text-gray-500'>Users assigned to this group.</p>
              </div>

              <button
                onClick={() => setAddUserModal(true)}
                className='flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 transition-colors hover:bg-indigo-100'
              >
                Add User
              </button>
            </div>

            {/* Search */}
            <div className='rounded-xl border border-gray-100 bg-white p-4 shadow-sm'>
              <form
                onSubmit={handleFormSubmit}
                className='flex flex-col gap-4 md:flex-row md:items-end'
              >
                <div className='flex w-full flex-col md:max-w-sm'>
                  <Input
                    value={formData.search}
                    setValue={setFormValue('search')}
                    placeholder='Search users...'
                  />
                </div>

                <Button
                  label='Search'
                  type='submit'
                />
              </form>
            </div>

            {/* Users Table */}
            <div className='rounded-xl border border-gray-100 bg-white shadow-sm'>
              {userGroup.users?.length > 0 ? (
                <JobsTable heads={['Name', 'Email', 'Role', 'Office Code']}>
                  <tbody>
                    {userGroup.users.map((user) => (
                      <tr key={user.id}>
                        <td className='standard-td'>{user.name}</td>
                        <td className='standard-td'>{user.email}</td>
                        <td className='standard-td'>{user.role}</td>
                        <td className='standard-td'>{user.office_code}</td>
                      </tr>
                    ))}
                  </tbody>
                </JobsTable>
              ) : (
                <div className='py-12 text-center'>
                  <p className='text-sm text-gray-500'>No users assigned to this group.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Add User Modal */}
        {addUserModal && (
          <Modal
            setShowModal={setAddUserModal}
            large
          >
            <AddUserForm
              userGroup={userGroup}
              setAddUserModal={setAddUserModal}
            />
          </Modal>
        )}
      </DashboardPadding>
    </AnalyticsDashboardLayout>
  )
}

export default UserGroupShowPage

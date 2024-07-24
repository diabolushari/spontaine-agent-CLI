import Authenticated from '@/Layouts/AuthenticatedLayout'
import Table from '@/ui/Table/Table'
import Card from '@/ui/Card/Card'
import Heading from '@/typograpy/Heading'
import DashboardPadding from '@/Layouts/DashboardPadding'
import { Paginator } from '@/ui/ui_interfaces'
import Pagination from '@/ui/Pagination/Pagination'
import FormBuilder, { FormItem } from '@/FormBuilder/FormBuilder'
import { Link, router } from '@inertiajs/react'
import React from 'react'
import AddButton from '@/ui/button/AddButton'

interface Props<
  U extends keyof T,
  V extends keyof T,
  T extends Record<U, string> &
    Record<V, string | number | null | undefined> &
    Record<'actions', { url: string; title: string }[]>,
  Q,
  P extends keyof Q,
  R extends keyof L,
  S extends keyof L,
  L extends Record<R, string | number> & Record<S, string | number | null>,
> {
  cols: string[]
  keys: V[]
  primaryKey: keyof T
  rows: T[]
  formData: Q
  formItems: Record<P, FormItem<Q[P], R, S, L>>
  paginator?: Paginator<{}>
  title?: string
  searchUrl?: string
  addButtonUrl?: string
}

export default function ListingPage<
  U extends keyof T,
  V extends keyof T,
  T extends Record<U, string> &
    Record<V, string | number | null | undefined> &
    Record<'actions', { url: string; title: string }[]>,
  Q,
  P extends keyof Q,
  R extends keyof L,
  S extends keyof L,
  L extends Record<R, string | number> & Record<S, string | number | null>,
>({
  cols,
  rows,
  primaryKey,
  keys,
  paginator,
  title = 'List',
  formItems,
  formData,
  searchUrl,
  addButtonUrl,
}: Props<U, V, T, Q, P, R, S, L>) {
  const onSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (searchUrl == null) {
      return
    }

    router.get(searchUrl, {
      ...formData,
    } as Record<string, string | number>)
  }

  return (
    <Authenticated>
      <DashboardPadding>
        <Card>
          <div className='flex flex-col gap-5'>
            <div className='flex justify-between gap-5 py-4 bg-gray-200 px-2'>
              <Heading>{title}</Heading>
              {addButtonUrl != null && <AddButton link={addButtonUrl} />}
            </div>
            <div className='flex flex-col gap-10 px-5 py-5'>
              <div className='flex flex-col gap-5'>
                <FormBuilder
                  formData={formData}
                  onFormSubmit={onSearchSubmit}
                  formItems={formItems}
                  loading={false}
                  buttonText='Search'
                  formStyles={'md:grid-cols-3 lg:grid-cols-4'}
                />
              </div>
              <Table
                heads={cols}
                editColumn={true}
              >
                <tbody>
                  {rows.map((row) => {
                    return (
                      <tr
                        key={row[primaryKey] as string}
                        className='standard-tr'
                      >
                        {keys.map((rowKey) => {
                          return (
                            <td
                              key={rowKey as string}
                              className='standard-td'
                            >
                              {row[rowKey as keyof typeof row]}
                            </td>
                          )
                        })}
                        {row.actions != null && (
                          <td>
                            {row.actions.map((action) => {
                              return (
                                <Link
                                  key={action.title}
                                  href={action.url}
                                  className='text-blue-500 underline hover:text-blue-400'
                                >
                                  {action.title}
                                </Link>
                              )
                            })}
                          </td>
                        )}
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
              {paginator != null && <Pagination pagination={paginator} />}
            </div>
          </div>
        </Card>
      </DashboardPadding>
    </Authenticated>
  )
}

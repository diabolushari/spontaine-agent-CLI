import React from 'react'

export default function Table({
  children,
  heads,
  editColumn,
}: {
  children?: JSX.Element
  heads: string[]
  editColumn?: boolean
}) {
  return (
    <div className='overflow-auto'>
      <table className='w-full'>
        <thead className=''>
          <tr className='focus:outline-none leading-none text-gray-700 border-b-2 border-textbox-field'>
            {heads.map((head) => {
              return (
                <th
                  scope='col'
                  className='px-3 py-3 text-sm text-left text-gray-600'
                  key={head}
                >
                  {head}
                </th>
              )
            })}
            {editColumn && (
              <th
                scope='col'
                className='px-3 py-3 text-left text-base font-semibold text-gray-500'
              ></th>
            )}
          </tr>
        </thead>
        {children}
      </table>
    </div>
  )
}

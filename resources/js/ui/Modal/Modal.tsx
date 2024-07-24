import React from 'react'
import { motion } from 'framer-motion'
import styles from './Modal.module.css'

interface Properties {
  children?: JSX.Element
  setShowModal: (value: boolean) => unknown
  title?: string
  large?: boolean
  showClosButton?: boolean
}

export default function Modal({
  children,
  setShowModal,
  title,
  large = false,
  showClosButton = true,
}: Properties) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={styles.modal}
    >
      <div className='modal-content mt-20 py-8'>
        <div
          role='alert'
          className={
            'container mx-auto flex w-11/12 justify-center md:w-2/3 ' + (large ? '' : 'max-w-lg')
          }
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className='relative w-full rounded bg-white pb-8 shadow-lg'
          >
            <div className='flex w-full items-start justify-between p-2'>
              <span className='text-lg font-semibold'>{title}</span>
              <div
                onClick={() => setShowModal(false)}
                className='cursor-pointer transition ease-in-out hover:bg-gray-200'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  aria-label='Close'
                  className='icon icon-tabler icon-tabler-x'
                  width={20}
                  height={20}
                  viewBox='0 0 24 24'
                  strokeWidth='2.5'
                  stroke='currentColor'
                  fill='none'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path
                    stroke='none'
                    d='M0 0h24v24H0z'
                  />
                  <line
                    x1={18}
                    y1={6}
                    x2={6}
                    y2={18}
                  />
                  <line
                    x1={6}
                    y1={6}
                    x2={18}
                    y2={18}
                  />
                </svg>
              </div>
            </div>
            {children}
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

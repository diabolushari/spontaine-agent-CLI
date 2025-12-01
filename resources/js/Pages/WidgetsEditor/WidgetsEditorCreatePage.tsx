import AnalyticsDashboardLayout from '@/Layouts/AnalyticsDashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import React, { useEffect, useState } from 'react'
import OverviewWidgetEditor from '@/Components/WidgetsEditor/OverviewWidgetEditor'
import { Widget } from '@/interfaces/data_interfaces'
import { MetaHierarchy } from '@/interfaces/meta_interfaces'
import { useWebSocket } from '@/Pages/WidgetsEditor/hook/useWebsocket'

interface Props {
  widget?: Widget
  collection_id: number
  type: string
  meta_hierarchy: MetaHierarchy[]
}

export default function WidgetsEditorCreatePage({
  widget,
  collection_id,
  type,
  meta_hierarchy,
}: Readonly<Props>) {
  const [currentWidget, setCurrentWidget] = useState<Widget | undefined>(widget)
  const { messages, sendMessage } = useWebSocket(
    'ws://localhost:8080/widget-agent/ws/generate-widget'
  )
  const [input, setInput] = React.useState('')

  const handleSend = () => {
    if (!input.trim()) return
    sendMessage({ message: input })
    setInput('')
  }

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      setCurrentWidget(lastMessage.widget)
      console.log(lastMessage.widget)
    }
  }, [messages])

  return (
    <AnalyticsDashboardLayout>
      <DashboardPadding>
        {type == 'overview' && (
          <OverviewWidgetEditor
            widget={currentWidget}
            collectionId={collection_id}
            type={type}
            metaHierarchy={meta_hierarchy}
          />
        )}
      </DashboardPadding>

      <div className='mb-6 rounded-lg border border-slate-200 bg-white p-4 shadow-sm'>
        <h2 className='mb-4 text-lg font-semibold text-slate-800'>Widget Assistant</h2>

        <div className='mb-4 max-h-60 overflow-y-auto rounded-md border border-slate-100 bg-slate-50 p-4'>
          {messages.length === 0 ? (
            <p className='text-sm italic text-slate-400'>No messages yet. Ask something...</p>
          ) : (
            <div className='space-y-2'>
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className='text-sm'
                >
                  <span className='font-medium text-slate-700'>Response: </span>
                  <span className='text-slate-600'>{JSON.stringify(msg)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className='flex gap-2'>
          <input
            type='text'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder='Describe the widget you want to create...'
            className='flex-1 rounded-md border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
          />
          <button
            onClick={handleSend}
            className='rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          >
            Send
          </button>
        </div>
      </div>
    </AnalyticsDashboardLayout>
  )
}

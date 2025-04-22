import AIInsights from './components/AiInsights'
import MainArea from './components/MainArea'
import Sidebar from './components/Sidebar'

export default function Chat() {
  return (
    <div className='flex h-screen bg-gray-50'>
      <Sidebar />
      <MainArea />
      <AIInsights />
    </div>
  )
}

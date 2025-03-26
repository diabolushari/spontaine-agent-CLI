import AIInsights from './components/AiInsights'
import MainArea from './components/MainArea'
import Sidebar from './components/Sidebar'

export default function Chat() {
  return (
    <div className='flex h-screen bg-gradient-to-r from-purple-300 to-blue-200'>
      <Sidebar />
      <MainArea />
      <AIInsights />
    </div>
  )
}

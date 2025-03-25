import Sidebar from './components/Sidebar'
import MainArea from './components/MainArea'
import AIInsights from './components/AiInsights'
import style from './Chat.module.css'

export default function Chat() {
    return (
        <div className='flex h-screen bg-gradient-to-r from-purple-300 to-blue-200'>
            <Sidebar />
            <MainArea />
            <AIInsights />
        </div>
    )
}

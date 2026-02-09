import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export default function CommunitySection() {
    return (
        <motion.div
            key='community'
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className='flex flex-col items-center justify-center py-32 text-center'
        >
            <div className='relative mb-6'>
                <div className='absolute -inset-4 rounded-full bg-blue-100 opacity-50 blur-xl'></div>
                <div className='relative flex h-24 w-24 items-center justify-center rounded-3xl bg-white shadow-lg ring-1 ring-black/5'>
                    <Sparkles className='h-12 w-12 text-blue-500' />
                </div>
            </div>
            <h2 className='text-3xl font-bold tracking-tight text-gray-900'>Community Hub</h2>
            <p className='mt-4 max-w-lg text-lg text-gray-500'>
                Explore widgets and pages created by the community. Share your own creations and find inspiration.
            </p>
            <div className='mt-8 inline-flex items-center rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10'>
                Coming Soon
            </div>
        </motion.div>
    )
}

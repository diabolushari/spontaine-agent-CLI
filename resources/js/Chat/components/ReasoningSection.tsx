import { ChatMessage } from '@/Chat/components/MainArea'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'

interface ReasoningSectionProps {
    messages: ChatMessage[]
    isComplete: boolean
    isLoading: boolean
    status: string
}

// Thinking icon with gradient (matches the design)
const ThinkingIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="thinkingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
        </defs>
        <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
            fill="url(#thinkingGradient)"
        />
        <circle cx="12" cy="12" r="8" stroke="url(#thinkingGradient)" strokeWidth="1.5" fill="none" opacity="0.3">
            <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 12 12"
                to="360 12 12"
                dur="2s"
                repeatCount="indefinite"
            />
        </circle>
    </svg>
)

// Sparkle/Reasoning icon for completed state
const ReasoningIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="reasoningGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#EC4899" />
                <stop offset="100%" stopColor="#F472B6" />
            </linearGradient>
        </defs>
        <path
            d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
            fill="url(#reasoningGradient)"
        />
    </svg>
)

function formatJsonDescription(description: string): string {
    try {
        const parsed = JSON.parse(description)
        return JSON.stringify(parsed, null, 2)
    } catch {
        return description
    }
}

function stripCodeFencesAndIndent(content: string): string {
    if (!content) return ''
    let cleaned = content.replace(/^```[\w]*\n?/, '').replace(/```$/, '')
    cleaned = cleaned
        .split('\n')
        .map((line) => line.trimStart())
        .join('\n')
    return cleaned
}

export default function ReasoningSection({
    messages,
    isComplete,
    isLoading,
    status,
}: Readonly<ReasoningSectionProps>) {
    const [isExpanded, setIsExpanded] = useState(true)
    const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())

    // Auto-collapse when complete
    useEffect(() => {
        if (isComplete) {
            setIsExpanded(false)
        } else {
            setIsExpanded(true)
        }
    }, [isComplete])

    // Expand the latest item automatically
    useEffect(() => {
        if (messages.length > 0 && !isComplete) {
            const lastMessage = messages[messages.length - 1]
            setExpandedItems(new Set([lastMessage.id]))
        }
    }, [messages, isComplete])

    const toggleItem = (id: number) => {
        setExpandedItems((prev) => {
            const newSet = new Set(prev)
            if (newSet.has(id)) {
                newSet.delete(id)
            } else {
                newSet.add(id)
            }
            return newSet
        })
    }

    if (messages.length === 0 && !isLoading) {
        return null
    }

    return (
        <div className="w-full mb-3">
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`
          flex items-center justify-between w-full px-3 py-2 rounded-xl transition-all duration-300
          ${isComplete
                        ? 'bg-gradient-to-r from-pink-50 to-rose-50 hover:from-pink-100 hover:to-rose-100'
                        : 'bg-gradient-to-r from-purple-50 to-violet-50 hover:from-purple-100 hover:to-violet-100'
                    }
        `}
            >
                <div className="flex items-center gap-3">
                    {isComplete ? <ReasoningIcon /> : <ThinkingIcon />}
                    <span
                        className={`
              font-medium text-sm
              ${isComplete ? 'text-pink-600' : 'text-purple-600'}
            `}
                    >
                        {isComplete ? 'Reasoning' : (status || 'Thinking..')}
                    </span>
                    {isComplete && (
                        <span className="text-pink-500 text-sm font-normal">
                            Process Completed
                        </span>
                    )}
                </div>
                <div className={`transition-transform duration-300 ${isComplete ? 'text-pink-400' : 'text-purple-400'}`}>
                    {isExpanded ? (
                        <ChevronDown className="w-5 h-5" />
                    ) : (
                        <ChevronRight className="w-5 h-5" />
                    )}
                </div>
            </button>

            {/* Content */}
            <div
                className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${isExpanded ? 'max-h-[2000px] opacity-100 mt-2' : 'max-h-0 opacity-0'}
        `}
            >
                <div className="space-y-2 pl-2">
                    {messages.map((message, index) => {
                        const stepNumber = index + 1
                        const isItemExpanded = expandedItems.has(message.id)
                        const isAction = message.role === 'action'

                        // Preview text logic
                        let previewText = ''
                        if (isAction) {
                            previewText = message.content // Tool name
                        } else {
                            // Get first meaningful line
                            const lines = message.content.split('\n')
                            const firstLine = lines.find(l => l.trim().length > 0) || ''
                            previewText = firstLine
                        }
                        if (!previewText) previewText = '...'

                        return (
                            <div key={message.id}
                                className={`
                                    relative transition-all duration-300 ease-in-out rounded-xl border mb-2 last:mb-0
                                    ${isItemExpanded
                                        ? 'bg-white border-pink-200 shadow-md'
                                        : 'bg-white border-gray-100 hover:border-purple-200 hover:shadow-sm'
                                    }
                                `}
                            >
                                <div
                                    onClick={() => toggleItem(message.id)}
                                    className="flex gap-3 px-3 py-2 cursor-pointer"
                                >
                                    {/* Number Badge */}
                                    <div className={`flex-shrink-0 transition-all duration-300 ${isItemExpanded ? 'pt-0.5' : ''}`}>
                                        <div
                                            className={`
                                                w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold
                                                ${isItemExpanded
                                                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white'
                                                    : 'bg-gradient-to-r from-purple-500 to-violet-500 text-white'
                                                }
                                            `}
                                        >
                                            {stepNumber}
                                        </div>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        {/* Collapsed State: Preview */}
                                        {!isItemExpanded && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-gray-700 truncate pr-4">
                                                    {previewText}
                                                </span>
                                                <div className="text-gray-400">
                                                    <ChevronDown className="w-4 h-4" />
                                                </div>
                                            </div>
                                        )}

                                        {/* Expanded State: Full Content */}
                                        {isItemExpanded && (
                                            <div className="animate-in fade-in zoom-in-95 duration-200">
                                                {isAction && (
                                                    <div className="text-sm font-semibold text-pink-600 mb-2">
                                                        {message.content}
                                                    </div>
                                                )}
                                                <div className="text-sm text-gray-700 prose prose-p:my-1 prose-pre:my-1 prose-sm max-w-none">
                                                    {isAction ? (
                                                        message.description && (
                                                            <pre className="text-xs text-gray-600 bg-gray-50 rounded-lg p-2 overflow-auto max-h-60 whitespace-pre-wrap font-mono border border-gray-100">
                                                                {formatJsonDescription(message.description)}
                                                            </pre>
                                                        )
                                                    ) : (
                                                        <ReactMarkdown
                                                            rehypePlugins={[rehypeRaw]}
                                                            remarkPlugins={[remarkGfm]}
                                                            components={{
                                                                p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />
                                                            }}
                                                        >
                                                            {stripCodeFencesAndIndent(message.content)}
                                                        </ReactMarkdown>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                    {/* Loading indicator for current step */}
                    {isLoading && !isComplete && (
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-100">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-400 to-violet-400 flex items-center justify-center">
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            </div>
                            <span className="text-sm text-purple-600 font-medium">
                                {status || 'Processing...'}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

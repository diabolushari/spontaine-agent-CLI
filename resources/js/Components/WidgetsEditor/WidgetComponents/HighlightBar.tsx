import HighlightCard from '@/Components/WidgetsEditor/WidgetComponents/HighlightCard'

export default function HighlightBar({ hlCards, selectedMonth }) {
  return (
    <div className='flex gap-4 overflow-x-auto pb-2'>
      {hlCards.map((card, index) => (
        <HighlightCard
          key={index}
          card={card}
          selectedMonth={selectedMonth}
        />
      ))}
    </div>
  )
}

import OverviewWidgetContent from '@/Components/WidgetsEditor/WidgetComponents/OverviewWidgetContent'
import RankingWidget from '@/Components/WidgetsEditor/WidgetComponents/RankingWidget'
import TrendWidget from '@/Components/WidgetsEditor/WidgetComponents/TrendWidget'
import WidgetLayout from '@/Components/WidgetsEditor/WidgetComponents/WidgetLayout'
import useFetchRecord from '@/hooks/useFetchRecord'
import { Widget } from '@/interfaces/data_interfaces'
import { useEffect, useMemo, useState } from 'react'

interface OverviewWidgetProps {
  widget: Widget
  initialMonth?: Date | null
  initialView?: 'overview' | 'trend' | 'ranking'
}

interface SubsetMaxValueResponse {
  field: string
  max_value: string | null
}

export default function OverviewWidget({ widget }: Readonly<OverviewWidgetProps>) {
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null)

  const { hasOverview, hasRanking, hasTrend, hasHighlightCards } = useMemo(() => {
    const hasOverview =
      widget.data.overview?.subset_id != null &&
      widget.data.overview?.measures != null &&
      widget.data.overview?.dimension != null &&
      widget.data.overview?.measures?.length > 0

    const hasRanking =
      widget.data.rank?.subset_id != null &&
      widget.data.rank?.order_by?.subset_column != null &&
      widget.data.rank?.order_by?.subset_field_name != null

    const hasTrend =
      widget.data.trend?.subset_id != null &&
      widget.data.trend?.measure?.subset_column != null &&
      widget.data.trend?.measure?.subset_field_name != null

    const hasHighlightCards =
      widget.data.highlight_cards != null && widget.data.highlight_cards.length > 0

    return {
      hasOverview,
      hasRanking,
      hasTrend,
      hasHighlightCards,
    }
  }, [widget.data])

  const [selectedView, setSelectedView] = useState<string>(() => {
    if (hasOverview || hasHighlightCards) return 'overview'
    if (hasTrend) return 'trend'
    if (hasRanking) return 'ranking'
    return ''
  })

  useEffect(() => {
    if (selectedView != '') {
      return
    }
    if (hasOverview || hasHighlightCards) {
      setSelectedView('overview')
    } else if (hasTrend) {
      setSelectedView('trend')
    } else if (hasRanking) {
      setSelectedView('ranking')
    }
  }, [selectedView, hasOverview, hasRanking, hasTrend, hasHighlightCards])

  const subsetId = useMemo(() => {
    if (widget.data.overview?.subset_id != null) {
      return widget.data.overview.subset_id
    }
    if (widget.data.trend?.subset_id != null) {
      return widget.data.trend.subset_id
    }
    if (widget.data.rank?.subset_id != null) {
      return widget.data.rank.subset_id
    }
    if (widget.data.highlight_cards != null) {
      for (const card of widget.data.highlight_cards) {
        if (card.subset_id != null) {
          return card.subset_id
        }
      }
    }
    return null
  }, [widget.data])

  const url = subsetId
    ? route('subset-field-max-value', { subsetDetail: subsetId, field: 'month' })
    : null

  const [maxValueData, loading] = useFetchRecord<SubsetMaxValueResponse>(url)

  useEffect(() => {
    if (!loading && maxValueData != null) {
      const maxValue = maxValueData.max_value
      if (maxValue != null && /^\d{6}$/.test(maxValue)) {
        const year = Number.parseInt(maxValue.substring(0, 4), 10)
        const month = Number.parseInt(maxValue.substring(4, 6), 10) - 1 // months are 0-indexed
        setSelectedMonth(new Date(year, month, 1))
      } else {
        setSelectedMonth(new Date())
      }
    } else if (!loading && !maxValueData) {
      setSelectedMonth(new Date())
    }
  }, [loading, maxValueData])

  return (
    <WidgetLayout
      title={widget.title}
      subtitle={widget.subtitle}
      selectedMonth={selectedMonth}
      setSelectedMonth={setSelectedMonth}
      selectedView={selectedView}
      onViewChange={setSelectedView}
      hasOverview={hasOverview}
      hasRanking={hasRanking}
      hasTrend={hasTrend}
      hasHighlightCards={hasHighlightCards}
    >
      {selectedView === 'overview' && widget.data.overview.subset_id != null && (
        <OverviewWidgetContent
          subsetId={widget.data.overview.subset_id}
          measure={widget.data.overview.measures}
          dimension={widget.data.overview.dimension}
          chartType={widget.data.overview.chart_type}
          colorPalette={widget.data.overview.color_palette}
          highlightCards={widget.data.highlight_cards}
          selectedMonth={selectedMonth ?? new Date()}
        />
      )}
      {selectedView === 'trend' && (
        <TrendWidget
          trendSubsetId={widget.data.trend.subset_id}
          subsetColumn={widget.data.trend.measure?.subset_column ?? null}
          subsetFieldName={widget.data.trend.measure?.subset_field_name ?? null}
          trendChartType={widget.data.trend.chart_type ?? null}
          trendColor={widget.data.trend.color ?? null}
          selectedMonth={selectedMonth ?? new Date()}
          setSelectedMonth={setSelectedMonth}
        />
      )}
      {selectedView === 'ranking' &&
        selectedMonth != null &&
        widget.data.rank.subset_id != null && (
          <RankingWidget
            subsetId={widget.data.rank.subset_id}
            subsetColumn={widget.data.rank.order_by?.subset_column ?? null}
            subsetFieldName={widget.data.rank.order_by?.subset_field_name ?? null}
            selectedMonth={selectedMonth}
          />
        )}
    </WidgetLayout>
  )
}

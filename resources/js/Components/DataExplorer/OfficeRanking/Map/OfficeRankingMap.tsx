import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import { DataTableItem, OfficeCoordinates } from '@/interfaces/data_interfaces'
import useFetchRecord from '@/hooks/useFetchRecord'

interface Props {
  mapData: DataTableItem[]
}
const OfficeRankingMap = ({ mapData }: Props) => {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  const fullMapData = useFetchRecord<{ data: OfficeCoordinates[] }>(
    route('find-office-coordinates')
  )

  console.log(fullMapData)
  const BubbleIcon = L.divIcon({
    className: 'bubble-icon',
    html: `<div class="bubble-marker"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  })
  L.Marker.prototype.options.icon = BubbleIcon

  useEffect(() => {
    if (mapRef.current) return

    if (mapContainerRef.current && fullMapData[0]?.data) {
      const bounds = L.latLngBounds([8.17, 74.85], [12.78, 77.7])

      mapRef.current = L.map(mapContainerRef.current, {
        center: [9.66505, 76.55606],
        zoom: 8,
        maxBounds: bounds,
        maxBoundsViscosity: 1.0,
        keyboard: true,
        dragging: true,
        zoomControl: true,
        boxZoom: true,
        doubleClickZoom: true,
        scrollWheelZoom: true,
        touchZoom: true,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current)

      mapData.forEach((dataItem) => {
        const matchedOffice = fullMapData[0]?.data.find(
          (office) => office.office_code === dataItem.office_code
        )

        if (matchedOffice) {
          const marker = L.marker([matchedOffice.latitude, matchedOffice.longitude]).addTo(
            mapRef.current!
          )
          marker.bindPopup(`<b>${dataItem.office_name}</b>`)
        }
      })
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.off()
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [fullMapData, mapData])

  return (
    <div>
      <style>{`
        .bubble-marker {
          width: 20px;
          height: 20px;
          background-color: #4285f4;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 0 6px rgba(0, 0, 0, 0.3);
        }
      `}</style>
      <div
        ref={mapContainerRef}
        id='map'
        style={{ height: '500px', width: '100%' }}
      />
    </div>
  )
}

export default OfficeRankingMap

import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { OfficeCoordinates } from '@/interfaces/data_interfaces'
import useFetchList from '@/hooks/useFetchList'

interface MapDataItem {
  [key: string]: string | number | null | undefined
  office_name: string
  office_code: string | null | undefined
}
interface Props {
  mapData: MapDataItem[]
}
const OfficeRankingMap = ({ mapData }: Props) => {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  const [coordinates] = useFetchList<OfficeCoordinates>(route('office-coordinates'))

  useEffect(() => {
    if (mapRef.current) return

    if (mapContainerRef.current && coordinates) {
      const bounds = L.latLngBounds([8.17, 74.85], [12.78, 77.7])

      mapRef.current = L.map(mapContainerRef.current, {
        center: [9.66505, 76.55606],
        zoom: 7,
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

      // Extract values for scaling
      const values = mapData.map((dataItem) => {
        const key = Object.keys(dataItem).find(
          (k) => typeof dataItem[k] === 'number' && k !== 'office_code'
        )
        return key && typeof dataItem[key] === 'number' ? (dataItem[key] as number) : 0
      })
      const minValue = Math.min(...values)
      const maxValue = Math.max(...values)

      const scaleRadius = (value: number) => {
        const minRadius = 1000
        const maxRadius = 10000
        if (maxValue === minValue) return (minRadius + maxRadius) / 2
        return ((value - minValue) / (maxValue - minValue)) * (maxRadius - minRadius) + minRadius
      }

      mapData.forEach((dataItem) => {
        const matchedOffice = coordinates.find(
          (office) => office.office_code === dataItem.office_code
        )

        if (matchedOffice) {
          const radiusKey = Object.keys(dataItem).find(
            (key) => typeof dataItem[key] === 'number' && key !== 'office_code'
          )

          const value =
            radiusKey && typeof dataItem[radiusKey] === 'number'
              ? (dataItem[radiusKey] as number)
              : 0
          const scaledRadius = scaleRadius(value)

          const circle = L.circle([matchedOffice.latitude, matchedOffice.longitude], {
            radius: scaledRadius,
            color: '#4285f4',
            fillColor: '#4285f4',
            fillOpacity: 0.6,
          }).addTo(mapRef.current!)

          const popupContent = `<b>${dataItem.office_name}</b><br>${radiusKey}: ${value.toFixed(2)}`

          circle.on('mouseover', function (e) {
            const popup = L.popup({ closeButton: false })
              .setLatLng(e.latlng)
              .setContent(popupContent)
              .openOn(mapRef.current!)
          })

          circle.on('mouseout', function () {
            mapRef.current?.closePopup()
          })
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
  }, [coordinates, mapData])

  return (
    <div>
      <div
        ref={mapContainerRef}
        id='map'
        style={{ height: '500px', width: '100%' }}
      />
    </div>
  )
}

export default OfficeRankingMap

"use client"

import React, { useCallback } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { Button } from "@/components/ui/button"

export function TimePicker({setHours, setMinutes, time}:{
    setHours: React.Dispatch<React.SetStateAction<number>>,
    setMinutes: React.Dispatch<React.SetStateAction<number>>,
    time:{
        hours:number,
        minutes:number
    }
}) {
  

  const incrementHours = useCallback(() => setHours((h) => (h + 1) % 24), [])
  const decrementHours = useCallback(() => setHours((h) => (h - 1 + 24) % 24), [])
  const incrementMinutes = useCallback(() => setMinutes((m) => (m + 1) % 60), [])
  const decrementMinutes = useCallback(() => setMinutes((m) => (m - 1 + 60) % 60), [])

  const formatTime = (value: number) => value.toString().padStart(2, '0')

  const renderTimeValues = (value: number, max: number) => {
    const values = []
    for (let i = -2; i <= 2; i++) {
      values.push((value + i + max) % max)
    }
    return values
  }

  return (
    <div className="flex items-center justify-center space-x-4 p-2 bg-black rounded-lg shadow-md text-white">
      <TimeColumn
        values={renderTimeValues(time.hours, 24)}
        onIncrement={incrementHours}
        onDecrement={decrementHours}
        ariaLabel="hours"
      />
      <div className="text-xl font-bold">:</div>
      <TimeColumn
        values={renderTimeValues(time.minutes, 60)}
        onIncrement={incrementMinutes}
        onDecrement={decrementMinutes}
        ariaLabel="minutes"
      />
    </div>
  )
}

interface TimeColumnProps {
  values: number[]
  onIncrement: () => void
  onDecrement: () => void
  ariaLabel: string
}

function TimeColumn({ values, onIncrement, onDecrement, ariaLabel }: TimeColumnProps) {
  const formatTime = (value: number) => value.toString().padStart(2, '0')

  return (
    <div className="flex flex-col items-center">
      <Button
        variant="ghost"
        size="icon"
        onClick={onIncrement}
        aria-label={`Increment ${ariaLabel}`}
        className="text-white hover:text-white hover:bg-gray-800"
      >
        <ChevronUp className="h-4 w-4" />
      </Button>
      <div className="flex flex-col items-center my-1" aria-live="polite">
        {values.map((value, index) => (
          <div
            key={index}
            className={`text-sm font-bold w-7 h-7 flex items-center justify-center ${
              index === 2 ? 'bg-[#38f68f] text-black rounded-lg' : ''
            }`}
          >
            {formatTime(value)}
          </div>
        ))}
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onDecrement}
        aria-label={`Decrement ${ariaLabel}`}
        className="text-white hover:text-white hover:bg-gray-800"
      >
        <ChevronDown className="h-4 w-4" />
      </Button>
    </div>
  )
}


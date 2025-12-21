'use client'

import { useState } from 'react'

const indianStates = [
  { code: 'AP', name: 'Andhra Pradesh', count: 45 },
  { code: 'AR', name: 'Arunachal Pradesh', count: 12 },
  { code: 'AS', name: 'Assam', count: 28 },
  { code: 'BR', name: 'Bihar', count: 67 },
  { code: 'CG', name: 'Chhattisgarh', count: 23 },
  { code: 'GA', name: 'Goa', count: 18 },
  { code: 'GJ', name: 'Gujarat', count: 31 },
  { code: 'HR', name: 'Haryana', count: 24 },
  { code: 'HP', name: 'Himachal Pradesh', count: 15 },
  { code: 'JH', name: 'Jharkhand', count: 29 },
  { code: 'KA', name: 'Karnataka', count: 36 },
  { code: 'KL', name: 'Kerala', count: 33 },
  { code: 'MP', name: 'Madhya Pradesh', count: 39 },
  { code: 'MH', name: 'Maharashtra', count: 52 },
  { code: 'MN', name: 'Manipur', count: 8 },
  { code: 'ML', name: 'Meghalaya', count: 9 },
  { code: 'MZ', name: 'Mizoram', count: 6 },
  { code: 'NL', name: 'Nagaland', count: 7 },
  { code: 'OD', name: 'Odisha', count: 26 },
  { code: 'PB', name: 'Punjab', count: 22 },
  { code: 'RJ', name: 'Rajasthan', count: 41 },
  { code: 'SK', name: 'Sikkim', count: 5 },
  { code: 'TN', name: 'Tamil Nadu', count: 45 },
  { code: 'TS', name: 'Telangana', count: 38 },
  { code: 'TR', name: 'Tripura', count: 11 },
  { code: 'UP', name: 'Uttar Pradesh', count: 78 },
  { code: 'UK', name: 'Uttarakhand', count: 19 },
  { code: 'WB', name: 'West Bengal', count: 34 },
  { code: 'AN', name: 'Andaman & Nicobar', count: 4 },
  { code: 'CH', name: 'Chandigarh', count: 14 },
  { code: 'DN', name: 'Dadra & Nagar Haveli', count: 3 },
  { code: 'DL', name: 'Delhi', count: 92 },
  { code: 'JK', name: 'Jammu & Kashmir', count: 27 },
  { code: 'LA', name: 'Ladakh', count: 5 },
  { code: 'LD', name: 'Lakshadweep', count: 2 },
  { code: 'PY', name: 'Puducherry', count: 7 },
  { code: 'AI', name: 'All India', count: 156 },
]

export function StateFilter() {
  const [selectedState, setSelectedState] = useState<string>('')

  return (
    <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
      <button
        onClick={() => setSelectedState('all_india')}
        className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${
          selectedState === 'all_india'
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600 hover:text-blue-600'
        }`}
      >
        <span className="font-medium">🌏 All India</span>
        <span className="text-xs bg-white/20 px-2 py-1 rounded">512</span>
      </button>

      {indianStates.map((state) => (
        <button
          key={state.code}
          onClick={() => setSelectedState(state.code)}
          className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${
            selectedState === state.code
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600 hover:text-blue-600'
          }`}
        >
          <span className="font-medium">{state.name}</span>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
            {state.count}
          </span>
        </button>
      ))}
    </div>
  )
}
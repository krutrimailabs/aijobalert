'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { IndianRupee, Calculator, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SalaryCalculatorProps {
  salaryString?: string | null
}

export const SalaryCalculator: React.FC<SalaryCalculatorProps> = ({ salaryString }) => {
  const [basicPay, setBasicPay] = useState<number>(35400) // Default Level 6 Basic
  const [isOpen, setIsOpen] = useState(false)

  // Allow toggling the calculator
  const toggleOpen = () => setIsOpen(!isOpen)

  // Extract potential salary from string if possible (very basic heuristic)
  useEffect(() => {
    if (salaryString) {
      // Try to find a 4-5 digit number that looks like basic pay (e.g. 35400, 56100)
      const match = salaryString.match(/(\d{5})/)
      if (match) {
        setBasicPay(parseInt(match[0]))
      }
    }
  }, [salaryString])

  const daPercent = 50 // Current DA ~50%
  const hraPercent = 27 // X Class City
  const taAmount = 3600 // Approx for many levels

  const da = Math.round(basicPay * (daPercent / 100))
  const hra = Math.round(basicPay * (hraPercent / 100))
  const gross = basicPay + da + hra + taAmount

  const nps = Math.round((basicPay + da) * 0.1)
  const inHand = gross - nps

  return (
    <Card className="bg-white border-slate-200 shadow-sm mt-6">
      <div
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors rounded-t-xl"
        onClick={toggleOpen}
      >
        <div className="flex items-center gap-2">
          <div className="bg-green-100 p-2 rounded-lg text-green-700">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">7th CPC Salary Calculator</h3>
            <p className="text-xs text-slate-500">Estimate your in-hand salary</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>
      </div>

      {isOpen && (
        <CardContent className="pt-0 pb-6 border-t border-slate-100">
          <div className="mt-4 space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-slate-700">Basic Pay</label>
                <span className="font-bold text-slate-900">₹ {basicPay.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={18000}
                max={250000}
                step={100}
                value={basicPay}
                onChange={(e) => setBasicPay(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>Level 1 (18k)</span>
                <span>Level 10 (56k)</span>
                <span>High (2.5L)</span>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Dearness Allowance ({daPercent}%)</span>
                <span className="font-medium text-slate-900">+ ₹ {da.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">HRA (Class X - {hraPercent}%)</span>
                <span className="font-medium text-slate-900">+ ₹ {hra.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Travel Allowance (Approx)</span>
                <span className="font-medium text-slate-900">+ ₹ {taAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200">
                <span className="text-slate-600">Gross Salary</span>
                <span className="font-bold text-slate-900">₹ {gross.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>NPS Deduction (10%)</span>
                <span>- ₹ {nps.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-green-600 text-white p-4 rounded-lg flex justify-between items-center shadow-md">
              <div>
                <p className="text-xs text-green-100 font-medium uppercase tracking-wider">
                  Estimated In-Hand
                </p>
                <p className="text-2xl font-bold">
                  ₹ {inHand.toLocaleString()}
                  <span className="text-base font-normal opacity-80">/mo</span>
                </p>
              </div>
              <IndianRupee className="w-8 h-8 opacity-20" />
            </div>

            <p className="text-[10px] text-center text-slate-400">
              *Estimates based on 7th CPC (X City). Actual may vary based on deductions, hierarchy &
              location.
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

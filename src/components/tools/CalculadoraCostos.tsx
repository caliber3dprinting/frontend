'use client'

import { useState } from 'react'

type Vals = {
  peso: number
  costoFilamento: number
  tiempo: number
  consumo: number
  costoKwh: number
  costoMaquina: number
  vidaUtil: number
  postProcesado: number
  valorHora: number
  tasaFallos: number
}

const DEFAULTS: Vals = {
  peso: 50,
  costoFilamento: 400,
  tiempo: 4,
  consumo: 150,
  costoKwh: 1.5,
  costoMaquina: 5000,
  vidaUtil: 3000,
  postProcesado: 15,
  valorHora: 150,
  tasaFallos: 10,
}

function fmt(n: number) {
  return n.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function Field({
  label,
  hint,
  id,
  value,
  onChange,
}: {
  label: string
  hint: string
  id: keyof Vals
  value: number
  onChange: (id: keyof Vals, val: number) => void
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-medium text-zinc-400 uppercase tracking-wide mb-1.5"
      >
        {label}
        <span className="ml-1 text-zinc-600 normal-case tracking-normal font-normal">({hint})</span>
      </label>
      <input
        type="number"
        id={id}
        value={value}
        min="0"
        onChange={e => onChange(id, parseFloat(e.target.value) || 0)}
        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
    </div>
  )
}

function BreakdownBar({
  label,
  amount,
  total,
  color,
}: {
  label: string
  amount: number
  total: number
  color: string
}) {
  const pct = total > 0 ? Math.min((amount / total) * 100, 100) : 0
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-sm">
        <span className="text-zinc-400">{label}</span>
        <span className="font-mono text-zinc-200">${fmt(amount)}</span>
      </div>
      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export default function CalculadoraCostos() {
  const [vals, setVals] = useState<Vals>(DEFAULTS)
  const [copied, setCopied] = useState(false)

  function set(id: keyof Vals, val: number) {
    setVals(prev => ({ ...prev, [id]: val }))
  }

  const mat = (vals.peso / 1000) * vals.costoFilamento
  const ene = (vals.consumo / 1000) * vals.tiempo * vals.costoKwh
  const amo = vals.vidaUtil > 0 ? (vals.costoMaquina / vals.vidaUtil) * vals.tiempo : 0
  const man = (vals.postProcesado / 60) * vals.valorHora
  const costoBase = mat + ene + amo + man
  const costoReal = costoBase * (1 + vals.tasaFallos / 100)

  async function handleCopy() {
    const lines = [
      'Calculadora 3D — Caliber 3D Printing',
      `Material:              $${fmt(mat)}`,
      `Energía eléctrica:     $${fmt(ene)}`,
      `Amortización:          $${fmt(amo)}`,
      `Mano de obra:          $${fmt(man)}`,
      `Costo base:            $${fmt(costoBase)}`,
      `Costo total (con fallos ${vals.tasaFallos}%): $${fmt(costoReal)}`,
    ]
    await navigator.clipboard.writeText(lines.join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

      {/* Inputs */}
      <div className="lg:col-span-3 space-y-4">

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-5 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-orange-500 rounded-full shrink-0" />
            Material y Energía
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Peso pieza" hint="gramos" id="peso" value={vals.peso} onChange={set} />
            <Field label="Costo filamento" hint="$/kg" id="costoFilamento" value={vals.costoFilamento} onChange={set} />
            <Field label="Tiempo impresión" hint="horas" id="tiempo" value={vals.tiempo} onChange={set} />
            <Field label="Consumo impresora" hint="watts" id="consumo" value={vals.consumo} onChange={set} />
            <Field label="Costo electricidad" hint="$/kWh" id="costoKwh" value={vals.costoKwh} onChange={set} />
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-5 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-orange-500 rounded-full shrink-0" />
            Máquina y Mano de Obra
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Costo máquina" hint="$" id="costoMaquina" value={vals.costoMaquina} onChange={set} />
            <Field label="Vida útil" hint="horas" id="vidaUtil" value={vals.vidaUtil} onChange={set} />
            <Field label="Post-procesado" hint="minutos" id="postProcesado" value={vals.postProcesado} onChange={set} />
            <Field label="Valor hora trabajo" hint="$/h" id="valorHora" value={vals.valorHora} onChange={set} />
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-5 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-orange-500 rounded-full shrink-0" />
            Factor de riesgo
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Tasa de fallos" hint="%" id="tasaFallos" value={vals.tasaFallos} onChange={set} />
          </div>
        </div>

        <button
          onClick={() => setVals(DEFAULTS)}
          className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors underline underline-offset-2"
        >
          Restaurar valores por defecto
        </button>
      </div>

      {/* Results */}
      <div className="lg:col-span-2">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 lg:sticky lg:top-24">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6">
            Desglose operativo
          </h3>

          <div className="space-y-4 mb-6">
            <BreakdownBar label="Material" amount={mat} total={costoBase} color="bg-orange-500" />
            <BreakdownBar label="Energía eléctrica" amount={ene} total={costoBase} color="bg-blue-500" />
            <BreakdownBar label="Amortización máquina" amount={amo} total={costoBase} color="bg-purple-500" />
            <BreakdownBar label="Mano de obra" amount={man} total={costoBase} color="bg-teal-500" />
          </div>

          <div className="border-t border-zinc-800 pt-4 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Subtotal sin riesgo</span>
              <span className="font-mono text-zinc-300">${fmt(costoBase)}</span>
            </div>
          </div>

          <div className="border-t-2 border-dashed border-zinc-700 pt-5 text-center">
            <span className="text-xs font-bold text-orange-500 uppercase tracking-widest block mb-2">
              Costo real de producción
            </span>
            <div className="text-4xl font-black text-white font-mono">
              ${fmt(costoReal)}
            </div>
            <div className="text-xs text-zinc-600 mt-1">
              incluye {vals.tasaFallos}% de tasa de fallos
            </div>
          </div>

          <button
            onClick={handleCopy}
            className="mt-6 w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 hover:text-white text-sm font-medium py-2.5 rounded-xl transition-all"
          >
            {copied ? (
              <>
                <svg className="w-4 h-4 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-green-400">Copiado al portapapeles</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                </svg>
                Copiar desglose
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  )
}

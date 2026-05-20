'use client'

import { useState, useRef } from 'react'

const PRINTER_PRESETS = [
  { label: 'Ender 3', watts: 120 },
  { label: 'Prusa MK4', watts: 100 },
  { label: 'Bambu X1', watts: 280 },
  { label: 'CR-10', watts: 180 },
]

function num(s: string) {
  const v = parseFloat(s.replace(',', '.'))
  return isNaN(v) || v < 0 ? 0 : v
}

function fmt(n: number) {
  return n.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function Field({
  label,
  hint,
  value,
  onChange,
  placeholder,
}: {
  label: string
  hint: string
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wide mb-1.5">
        {label}
        <span className="ml-1 text-zinc-600 normal-case tracking-normal font-normal">({hint})</span>
      </label>
      <input
        type="number"
        value={value}
        min="0"
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
    </div>
  )
}

function OptionalSection({
  label,
  enabled,
  onToggle,
  children,
  hint,
}: {
  label: string
  enabled: boolean
  onToggle: () => void
  children: React.ReactNode
  hint: string
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-widest group"
      >
        <span className={`w-1.5 h-4 rounded-full shrink-0 transition-colors ${enabled ? 'bg-orange-500' : 'bg-zinc-700'}`} />
        {label}
        <span className={`ml-auto text-xs font-normal normal-case tracking-normal transition-colors ${enabled ? 'text-orange-400' : 'text-zinc-600 group-hover:text-zinc-400'}`}>
          {enabled ? '— quitar' : '+ agregar'}
        </span>
      </button>
      {enabled ? (
        <div className="mt-5">{children}</div>
      ) : (
        <p className="text-xs text-zinc-700 mt-3 leading-relaxed">{hint}</p>
      )}
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
  const [peso, setPeso] = useState('')
  const [costoFilamento, setCostoFilamento] = useState('')
  const [tiempo, setTiempo] = useState('')
  const [consumo, setConsumo] = useState('')
  const [costoKwh, setCostoKwh] = useState('')
  const [machineEnabled, setMachineEnabled] = useState(false)
  const [costoMaquina, setCostoMaquina] = useState('')
  const [vidaUtil, setVidaUtil] = useState('')
  const [laborEnabled, setLaborEnabled] = useState(false)
  const [postProcesado, setPostProcesado] = useState('')
  const [valorHora, setValorHora] = useState('')
  const [tasaFallos, setTasaFallos] = useState('')
  const [cantidad, setCantidad] = useState('')

  const [copied, setCopied] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [nombrePieza, setNombrePieza] = useState('')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'ok' | 'error'>('idle')
  const nombreRef = useRef<HTMLInputElement>(null)

  const mat = (num(peso) / 1000) * num(costoFilamento)
  const ene = (num(consumo) / 1000) * num(tiempo) * num(costoKwh)
  const amo = machineEnabled && num(vidaUtil) > 0
    ? (num(costoMaquina) / num(vidaUtil)) * num(tiempo)
    : 0
  const man = laborEnabled ? (num(postProcesado) / 60) * num(valorHora) : 0
  const costoBase = mat + ene + amo + man
  const tasaFallosNum = num(tasaFallos) || 0
  const costoUnidad = costoBase * (1 + tasaFallosNum / 100)
  const cantidadNum = Math.max(1, Math.round(num(cantidad)) || 1)
  const costoTotal = costoUnidad * cantidadNum

  function openSaveModal() {
    setNombrePieza('')
    setSaveStatus('idle')
    setShowSaveModal(true)
    setTimeout(() => nombreRef.current?.focus(), 50)
  }

  async function handleSaveCalculo() {
    if (!nombrePieza.trim()) return
    setSaveStatus('saving')
    try {
      const res = await fetch('/api/calculos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombrePieza: nombrePieza.trim(),
          resultado: costoUnidad,
          costoBase,
          peso: num(peso),
          costoFilamento: num(costoFilamento),
          tiempo: num(tiempo),
          consumo: num(consumo),
          costoKwh: num(costoKwh),
          costoMaquina: machineEnabled ? num(costoMaquina) : 0,
          vidaUtil: machineEnabled ? num(vidaUtil) : 0,
          postProcesado: laborEnabled ? num(postProcesado) : 0,
          valorHora: laborEnabled ? num(valorHora) : 0,
          tasaFallos: tasaFallosNum,
        }),
      })
      if (!res.ok) throw new Error()
      setSaveStatus('ok')
      setTimeout(() => setShowSaveModal(false), 1500)
    } catch {
      setSaveStatus('error')
    }
  }

  async function handleCopy() {
    const lines = [
      'Calculadora 3D — Caliber 3D Printing',
      `Material:              $${fmt(mat)}`,
      `Energía eléctrica:     $${fmt(ene)}`,
      ...(machineEnabled ? [`Amortización máq.:     $${fmt(amo)}`] : []),
      ...(laborEnabled ? [`Mano de obra:          $${fmt(man)}`] : []),
      `Subtotal (sin riesgo): $${fmt(costoBase)}`,
      `Costo por pieza${tasaFallosNum > 0 ? ` (+${tasaFallosNum}% fallos)` : ''}:  $${fmt(costoUnidad)}`,
      ...(cantidadNum > 1 ? [`Total × ${cantidadNum} piezas:   $${fmt(costoTotal)}`] : []),
    ]
    await navigator.clipboard.writeText(lines.join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <SaveModal
        open={showSaveModal}
        nombrePieza={nombrePieza}
        onChange={setNombrePieza}
        onSave={handleSaveCalculo}
        onClose={() => setShowSaveModal(false)}
        status={saveStatus}
        nombreRef={nombreRef}
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Inputs */}
        <div className="lg:col-span-3 space-y-4">

          {/* Material */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-5 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-orange-500 rounded-full shrink-0" />
              Material
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Peso pieza" hint="gramos" value={peso} onChange={setPeso} placeholder="ej: 25" />
              <Field label="Costo filamento" hint="$/kg" value={costoFilamento} onChange={setCostoFilamento} placeholder="ej: 400" />
            </div>
          </div>

          {/* Energía */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-5 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-blue-500 rounded-full shrink-0" />
              Energía eléctrica
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Field label="Tiempo impresión" hint="horas" value={tiempo} onChange={setTiempo} placeholder="ej: 4" />
              <Field label="Costo electricidad" hint="$/kWh" value={costoKwh} onChange={setCostoKwh} placeholder="ej: 1.5" />
              <div className="col-span-2">
                <Field label="Consumo impresora" hint="watts" value={consumo} onChange={setConsumo} placeholder="ej: 150" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-zinc-600">Referencia por modelo de impresora:</p>
              <div className="flex flex-wrap gap-2">
                {PRINTER_PRESETS.map(p => (
                  <button
                    key={p.label}
                    onClick={() => setConsumo(String(p.watts))}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                      consumo === String(p.watts)
                        ? 'border-blue-500 text-blue-400 bg-blue-500/10'
                        : 'border-zinc-700 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {p.label} · {p.watts}W
                  </button>
                ))}
              </div>
              <p className="text-xs text-zinc-700 leading-relaxed">
                El consumo varía con la temperatura de cama, ambiente y velocidad. Consultá la ficha técnica de tu impresora para el valor exacto.
              </p>
            </div>
          </div>

          {/* Amortización (opcional) */}
          <OptionalSection
            label="Amortización de máquina"
            enabled={machineEnabled}
            onToggle={() => setMachineEnabled(v => !v)}
            hint="Distribuye el costo de tu impresora en horas de vida útil. Activalo si querés reflejar el desgaste real del equipo."
          >
            <div className="grid grid-cols-2 gap-4">
              <Field label="Costo máquina" hint="$" value={costoMaquina} onChange={setCostoMaquina} placeholder="ej: 5000" />
              <Field label="Vida útil" hint="horas" value={vidaUtil} onChange={setVidaUtil} placeholder="ej: 3000" />
            </div>
          </OptionalSection>

          {/* Mano de obra (opcional) */}
          <OptionalSection
            label="Mano de obra"
            enabled={laborEnabled}
            onToggle={() => setLaborEnabled(v => !v)}
            hint="Lijado, soporte, pintura y armado. Activalo si tu tiempo tiene valor en el precio final."
          >
            <div className="grid grid-cols-2 gap-4">
              <Field label="Post-procesado" hint="minutos" value={postProcesado} onChange={setPostProcesado} placeholder="ej: 15" />
              <Field label="Valor hora trabajo" hint="$/h" value={valorHora} onChange={setValorHora} placeholder="ej: 150" />
            </div>
          </OptionalSection>

          {/* Factor de riesgo */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-5 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-red-500 rounded-full shrink-0" />
              Factor de riesgo
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Tasa de fallos" hint="%" value={tasaFallos} onChange={setTasaFallos} placeholder="ej: 10" />
            </div>
            <p className="text-xs text-zinc-700 mt-3">
              Porcentaje de impresiones fallidas que absorbés como costo. Dejalo vacío para no aplicar factor.
            </p>
          </div>

          {/* Multiplicador */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-5 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-teal-500 rounded-full shrink-0" />
              Cantidad de piezas
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Piezas" hint="unidades" value={cantidad} onChange={setCantidad} placeholder="1" />
            </div>
            <p className="text-xs text-zinc-700 mt-3">
              Multiplicá el costo unitario para cotizar pedidos con varias unidades iguales.
            </p>
          </div>

        </div>

        {/* Results */}
        <div className="lg:col-span-2">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 lg:sticky lg:top-24">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6">
              Desglose por pieza
            </h3>

            <div className="space-y-4 mb-6">
              <BreakdownBar label="Material" amount={mat} total={costoBase} color="bg-orange-500" />
              <BreakdownBar label="Energía eléctrica" amount={ene} total={costoBase} color="bg-blue-500" />
              {machineEnabled && (
                <BreakdownBar label="Amortización máquina" amount={amo} total={costoBase} color="bg-purple-500" />
              )}
              {laborEnabled && (
                <BreakdownBar label="Mano de obra" amount={man} total={costoBase} color="bg-teal-500" />
              )}
            </div>

            <div className="border-t border-zinc-800 pt-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Subtotal sin riesgo</span>
                <span className="font-mono text-zinc-300">${fmt(costoBase)}</span>
              </div>
            </div>

            <div className="border-t-2 border-dashed border-zinc-700 pt-5 text-center">
              <span className="text-xs font-bold text-orange-500 uppercase tracking-widest block mb-2">
                Costo por pieza
              </span>
              <div className="text-4xl font-black text-white font-mono">
                ${fmt(costoUnidad)}
              </div>
              {tasaFallosNum > 0 && (
                <div className="text-xs text-zinc-600 mt-1">
                  incluye {tasaFallosNum}% de tasa de fallos
                </div>
              )}
            </div>

            {cantidadNum > 1 && (
              <div className="mt-5 pt-4 border-t border-zinc-800 text-center">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-widest block mb-1">
                  Total × {cantidadNum} piezas
                </span>
                <div className="text-2xl font-black text-teal-300 font-mono">
                  ${fmt(costoTotal)}
                </div>
              </div>
            )}

            <div className="mt-6 space-y-3">
              <button
                onClick={handleCopy}
                className="w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 hover:text-white text-sm font-medium py-2.5 rounded-xl transition-all"
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

              <button
                onClick={openSaveModal}
                className="w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 hover:text-white text-sm font-medium py-2.5 rounded-xl transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
                </svg>
                Guardar cálculo
              </button>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}

function SaveModal({
  open,
  nombrePieza,
  onChange,
  onSave,
  onClose,
  status,
  nombreRef,
}: {
  open: boolean
  nombrePieza: string
  onChange: (v: string) => void
  onSave: () => void
  onClose: () => void
  status: 'idle' | 'saving' | 'ok' | 'error'
  nombreRef: React.RefObject<HTMLInputElement | null>
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <h3 className="text-white font-bold text-base mb-1">Guardar cálculo</h3>
        <p className="text-zinc-400 text-sm mb-4">¿Cómo se llama la pieza que calculaste?</p>

        <input
          ref={nombreRef}
          type="text"
          value={nombrePieza}
          onChange={e => onChange(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onSave()}
          placeholder="Ej: Medalla 5cm, soporte escritorio..."
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all mb-4"
        />

        {status === 'error' && (
          <p className="text-red-400 text-xs mb-3">Error al guardar. Intentá de nuevo.</p>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium py-2.5 rounded-xl transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={onSave}
            disabled={status === 'saving' || !nombrePieza.trim()}
            className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white text-sm font-bold py-2.5 rounded-xl transition-all"
          >
            {status === 'saving' ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Guardando...
              </>
            ) : status === 'ok' ? (
              <>
                <svg className="w-4 h-4 text-green-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Guardado
              </>
            ) : (
              'Guardar'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

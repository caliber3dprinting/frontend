'use client'

import { useState } from 'react'

function num(s: string) {
  const v = parseFloat(s.replace(',', '.'))
  return isNaN(v) || v < 0 ? 0 : v
}

function fmt(n: number, decimals = 2) {
  return n.toLocaleString('es-AR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
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

export default function CalculadoraEscala() {
  const [actual, setActual] = useState('')
  const [objetivo, setObjetivo] = useState('')
  const [holguraEnabled, setHolguraEnabled] = useState(false)
  const [holgura, setHolgura] = useState('')
  const [alturaEnabled, setAlturaEnabled] = useState(false)
  const [alturaActual, setAlturaActual] = useState('')

  const [copied, setCopied] = useState(false)

  const a = num(actual)
  const o = num(objetivo)
  const h = holguraEnabled ? num(holgura) : 0
  const objetivoFinal = o + h

  const valid = a > 0 && objetivoFinal > 0
  const factor = valid ? objetivoFinal / a : 0
  const pct = factor * 100
  const diff = pct - 100
  const sube = diff > 0.005
  const baja = diff < -0.005

  const alturaNueva = alturaEnabled && valid ? num(alturaActual) * factor : 0

  async function handleCopy() {
    const lines = [
      'Calculadora de escala 3D — Caliber 3D',
      `Diámetro actual:    ${fmt(a)} mm`,
      `Diámetro objetivo:  ${fmt(o)} mm`,
      ...(holguraEnabled && h > 0 ? [`Holgura aplicada:   +${fmt(h)} mm  (objetivo final ${fmt(objetivoFinal)} mm)`] : []),
      `Escala a aplicar:   ${fmt(pct)}%`,
      sube
        ? `→ Aumentar ${fmt(diff)}%`
        : baja
        ? `→ Reducir ${fmt(Math.abs(diff))}%`
        : '→ Sin cambios (ya tiene la medida)',
      ...(alturaEnabled && num(alturaActual) > 0
        ? [`Altura: ${fmt(num(alturaActual))} mm → ${fmt(alturaNueva)} mm`]
        : []),
    ]
    await navigator.clipboard.writeText(lines.join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

      {/* Inputs */}
      <div className="lg:col-span-3 space-y-4">

        {/* Medidas */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-5 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-orange-500 rounded-full shrink-0" />
            Medidas
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Diámetro actual"
              hint="mm"
              value={actual}
              onChange={setActual}
              placeholder="ej: 85"
            />
            <Field
              label="Diámetro objetivo"
              hint="mm"
              value={objetivo}
              onChange={setObjetivo}
              placeholder="ej: 91"
            />
          </div>
          <p className="text-xs text-zinc-700 mt-4 leading-relaxed">
            Ingresá el diámetro que tiene tu pieza ahora (ej: interior de tu jarra) y el diámetro
            al que querés llevarla (ej: el de tu vaso). Te decimos el porcentaje exacto de escala.
          </p>
        </div>

        {/* Holgura (opcional) */}
        <OptionalSection
          label="Holgura / tolerancia"
          enabled={holguraEnabled}
          onToggle={() => setHolguraEnabled(v => !v)}
          hint="Espacio extra para que dos piezas encajen con juego (que el vaso entre en la jarra sin forzar). Se suma al diámetro objetivo. Típico: 0.2 a 0.5 mm."
        >
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Holgura"
              hint="mm"
              value={holgura}
              onChange={setHolgura}
              placeholder="ej: 0.3"
            />
          </div>
          <p className="text-xs text-zinc-700 mt-3 leading-relaxed">
            Se suma al objetivo: con objetivo {o > 0 ? fmt(o) : '91'} mm y holgura{' '}
            {h > 0 ? fmt(h) : '0.3'} mm, la pieza llega a {objetivoFinal > 0 ? fmt(objetivoFinal) : '91.30'} mm.
          </p>
        </OptionalSection>

        {/* Efecto en la altura (opcional) */}
        <OptionalSection
          label="Efecto en la altura"
          enabled={alturaEnabled}
          onToggle={() => setAlturaEnabled(v => !v)}
          hint="El escalado del slicer es proporcional: cambia toda la pieza, no solo el diámetro. Activalo para ver a cuánto queda la altura con esta escala."
        >
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Altura actual"
              hint="mm"
              value={alturaActual}
              onChange={setAlturaActual}
              placeholder="ej: 110"
            />
          </div>
          {alturaEnabled && num(alturaActual) > 0 && valid && (
            <p className="text-xs text-zinc-500 mt-3">
              A {fmt(pct)}% de escala, la altura pasa de{' '}
              <span className="text-zinc-300 font-mono">{fmt(num(alturaActual))} mm</span> a{' '}
              <span className="text-orange-400 font-mono">{fmt(alturaNueva)} mm</span>.
            </p>
          )}
        </OptionalSection>

        {/* Aviso */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 flex items-start gap-3">
          <svg className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="text-zinc-400 text-sm leading-relaxed">
            En Bambu Studio o Cura, seleccioná la pieza y escribí este porcentaje en el campo de
            <span className="text-zinc-200"> Escala</span> con el bloqueo proporcional activado
            (escala uniforme en X, Y y Z). El escalado afecta a toda la pieza, incluido el grosor de
            pared y la altura.
          </p>
        </div>

      </div>

      {/* Results */}
      <div className="lg:col-span-2">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 lg:sticky lg:top-24">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6">
            Escala a aplicar
          </h3>

          <div className="border-2 border-dashed border-zinc-700 rounded-xl py-6 text-center mb-6">
            <span className="text-xs font-bold text-orange-500 uppercase tracking-widest block mb-2">
              Escala
            </span>
            <div className="text-5xl font-black text-white font-mono leading-none">
              {valid ? `${fmt(pct)}%` : '—'}
            </div>
            {valid && (
              <div className={`mt-3 inline-flex items-center gap-1.5 text-sm font-semibold ${
                sube ? 'text-green-400' : baja ? 'text-blue-400' : 'text-zinc-400'
              }`}>
                {sube && (
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 17a1 1 0 01-1-1V6.414L5.707 9.707a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0l5 5a1 1 0 01-1.414 1.414L11 6.414V16a1 1 0 01-1 1z" clipRule="evenodd" />
                  </svg>
                )}
                {baja && (
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v9.586l3.293-3.293a1 1 0 011.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 011.414-1.414L9 13.586V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                )}
                {sube
                  ? `Aumentar ${fmt(diff)}%`
                  : baja
                  ? `Reducir ${fmt(Math.abs(diff))}%`
                  : 'Sin cambios'}
              </div>
            )}
          </div>

          <div className="space-y-2.5 text-sm mb-6">
            <div className="flex justify-between">
              <span className="text-zinc-500">Diámetro actual</span>
              <span className="font-mono text-zinc-300">{a > 0 ? `${fmt(a)} mm` : '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Diámetro objetivo</span>
              <span className="font-mono text-zinc-300">{o > 0 ? `${fmt(o)} mm` : '—'}</span>
            </div>
            {holguraEnabled && h > 0 && (
              <>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Holgura</span>
                  <span className="font-mono text-zinc-300">+{fmt(h)} mm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Objetivo final</span>
                  <span className="font-mono text-orange-400">{fmt(objetivoFinal)} mm</span>
                </div>
              </>
            )}
            {alturaEnabled && num(alturaActual) > 0 && valid && (
              <div className="flex justify-between border-t border-zinc-800 pt-2.5">
                <span className="text-zinc-500">Altura resultante</span>
                <span className="font-mono text-zinc-300">{fmt(alturaNueva)} mm</span>
              </div>
            )}
          </div>

          <button
            onClick={handleCopy}
            disabled={!valid}
            className="w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white text-sm font-medium py-2.5 rounded-xl transition-all"
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
                Copiar resultado
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  )
}

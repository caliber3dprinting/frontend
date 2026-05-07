'use client'

import { useState, useEffect, useRef } from 'react'
import { useUser } from '@clerk/nextjs'

type Accesorio = { id: string; nombre: string; costo: number }

type BudgetState = {
  nombre: string
  cliente: string
  pieza: string
  costoPieza: number
  cantidad: number
  manoDeObra: number
  accesorios: Accesorio[]
}

type BrandState = {
  marcaNegocio: string
  telefono: string
  emailContacto: string
  logoBase64: string
}

const BUDGET_DEFAULTS: BudgetState = {
  nombre: '',
  cliente: '',
  pieza: '',
  costoPieza: 0,
  cantidad: 1,
  manoDeObra: 0,
  accesorios: [],
}

function fmt(n: number) {
  return n.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function escHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function SectionHeader({ label }: { label: string }) {
  return (
    <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-5 flex items-center gap-2">
      <span className="w-1.5 h-4 bg-orange-500 rounded-full shrink-0" />
      {label}
    </h2>
  )
}

function TextField({
  label,
  hint,
  value,
  onChange,
  placeholder = '',
  className = '',
}: {
  label: string
  hint?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  className?: string
}) {
  return (
    <div className={className}>
      <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wide mb-1.5">
        {label}
        {hint && (
          <span className="ml-1 text-zinc-600 normal-case tracking-normal font-normal">({hint})</span>
        )}
      </label>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
      />
    </div>
  )
}

function NumberField({
  label,
  hint,
  value,
  onChange,
  className = '',
}: {
  label: string
  hint?: string
  value: number
  onChange: (v: number) => void
  className?: string
}) {
  return (
    <div className={className}>
      <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wide mb-1.5">
        {label}
        {hint && (
          <span className="ml-1 text-zinc-600 normal-case tracking-normal font-normal">({hint})</span>
        )}
      </label>
      <input
        type="number"
        value={value}
        min="0"
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
    </div>
  )
}

export default function Presupuestador() {
  const { user } = useUser()
  const [budget, setBudget] = useState<BudgetState>(BUDGET_DEFAULTS)
  const [brand, setBrand] = useState<BrandState>({
    marcaNegocio: '',
    telefono: '',
    emailContacto: '',
    logoBase64: '',
  })
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'ok' | 'error'>('idle')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load brand from localStorage; if first time, prefill from Clerk
  useEffect(() => {
    const stored = localStorage.getItem('presupuestador_brand')
    if (stored) {
      try {
        setBrand(JSON.parse(stored))
      } catch {}
    }
  }, [])

  useEffect(() => {
    if (!user) return
    setBrand((prev) => {
      if (prev.marcaNegocio || prev.emailContacto) return prev
      return {
        ...prev,
        marcaNegocio: user.fullName || '',
        emailContacto: user.primaryEmailAddress?.emailAddress || '',
      }
    })
  }, [user])

  // Persist brand info to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('presupuestador_brand', JSON.stringify(brand))
  }, [brand])

  // Calculations
  const costoPorPiezaSinAcc = budget.costoPieza + budget.manoDeObra
  const totalAccesorios = budget.accesorios.reduce((sum, a) => sum + a.costo, 0)
  const costoPorPiezaConAcc = costoPorPiezaSinAcc + totalAccesorios
  const totalSinAcc = costoPorPiezaSinAcc * budget.cantidad
  const totalConAcc = costoPorPiezaConAcc * budget.cantidad
  const accesoriosValidos = budget.accesorios.filter((a) => a.nombre && a.costo > 0)

  function setBudgetField<K extends keyof BudgetState>(key: K, val: BudgetState[K]) {
    setBudget((prev) => ({ ...prev, [key]: val }))
  }

  function setBrandField<K extends keyof BrandState>(key: K, val: BrandState[K]) {
    setBrand((prev) => ({ ...prev, [key]: val }))
  }

  function addAccesorio() {
    setBudget((prev) => ({
      ...prev,
      accesorios: [
        ...prev.accesorios,
        { id: crypto.randomUUID(), nombre: '', costo: 0 },
      ],
    }))
  }

  function updateAccesorio(id: string, field: 'nombre' | 'costo', value: string | number) {
    setBudget((prev) => ({
      ...prev,
      accesorios: prev.accesorios.map((a) =>
        a.id === id ? { ...a, [field]: value } : a
      ),
    }))
  }

  function removeAccesorio(id: string) {
    setBudget((prev) => ({
      ...prev,
      accesorios: prev.accesorios.filter((a) => a.id !== id),
    }))
  }

  function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setBrandField('logoBase64', reader.result as string)
    reader.readAsDataURL(file)
  }

  function generarPDF() {
    const fecha = new Date().toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
    const year = new Date().getFullYear()
    const e = escHtml

    const logoHtml = brand.logoBase64
      ? `<img src="${brand.logoBase64}" style="max-height:55px;max-width:110px;object-fit:contain;display:block;" />`
      : ''

    const accesoriosRows = accesoriosValidos
      .map(
        (a) => `
      <tr>
        <td>${e(a.nombre)}</td>
        <td>$${fmt(a.costo)}</td>
        <td>${budget.cantidad}</td>
        <td>$${fmt(a.costo * budget.cantidad)}</td>
      </tr>`
      )
      .join('')

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Presupuesto — ${e(budget.nombre || 'Sin título')}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, Helvetica, sans-serif; font-size: 12px; color: #111827; padding: 32px 38px; max-width: 820px; margin: 0 auto; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 18px; margin-bottom: 20px; border-bottom: 3px solid #f97316; }
  .brand-left { display: flex; gap: 12px; align-items: flex-start; }
  .brand-name { font-size: 18px; font-weight: 800; color: #111; margin-bottom: 5px; }
  .brand-contact { font-size: 10.5px; color: #555; line-height: 1.8; }
  .doc-info { text-align: right; flex-shrink: 0; }
  .doc-title { font-size: 20px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; color: #f97316; }
  .doc-date { font-size: 10.5px; color: #777; margin-top: 4px; }
  .presupuesto-header { background: #f97316; color: white; padding: 11px 15px; border-radius: 7px; margin-bottom: 16px; }
  .presupuesto-header h2 { font-size: 15px; font-weight: 800; }
  .presupuesto-header .cliente { font-size: 11px; opacity: 0.88; margin-top: 3px; }
  table { width: 100%; border-collapse: collapse; }
  thead th { background: #18181b; color: white; padding: 9px 11px; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 0.8px; font-weight: 700; }
  thead th:not(:first-child) { text-align: right; }
  tbody td { padding: 8px 11px; border-bottom: 1px solid #e5e7eb; font-size: 12px; }
  tbody td:not(:first-child) { text-align: right; }
  .subtotal-row td { background: #f4f4f5; font-weight: 700; }
  .acc-header-row td { background: #fff7ed; color: #c2410c; font-weight: 700; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; border-top: 2px solid #fed7aa; border-bottom: 1px solid #fed7aa; }
  .total-row td { background: #18181b; color: white; font-weight: 800; font-size: 14px; padding: 11px 11px; border: none; }
  .footer { margin-top: 30px; padding-top: 13px; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: flex-end; }
  .footer .note { font-size: 9px; color: #9ca3af; max-width: 260px; line-height: 1.6; }
  .footer .caliber-brand { text-align: right; }
  .footer .caliber-brand .name { font-size: 12px; font-weight: 800; color: #f97316; letter-spacing: 0.5px; }
  .footer .caliber-brand .url { font-size: 10px; color: #6b7280; margin-top: 1px; }
  .footer .caliber-brand .rights { font-size: 8.5px; color: #9ca3af; margin-top: 2px; }
  @media print { body { padding: 15px 20px; } @page { margin: 10mm; } }
</style>
</head>
<body>

<div class="header">
  <div class="brand-left">
    ${logoHtml}
    <div>
      <div class="brand-name">${e(brand.marcaNegocio || 'Técnico 3D')}</div>
      <div class="brand-contact">
        ${brand.emailContacto ? e(brand.emailContacto) + '<br>' : ''}
        ${brand.telefono ? e(brand.telefono) : ''}
      </div>
    </div>
  </div>
  <div class="doc-info">
    <div class="doc-title">Presupuesto</div>
    <div class="doc-date">${fecha}</div>
  </div>
</div>

<div class="presupuesto-header">
  <h2>${e(budget.nombre || 'Presupuesto sin título')}</h2>
  ${budget.cliente ? `<div class="cliente">Cliente: ${e(budget.cliente)}</div>` : ''}
</div>

<table>
  <thead>
    <tr>
      <th>Concepto</th>
      <th>$/pieza</th>
      <th>Cantidad</th>
      <th>Total</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>${budget.pieza ? `Impresión 3D — ${e(budget.pieza)}` : 'Impresión 3D'}</td>
      <td>$${fmt(budget.costoPieza)}</td>
      <td>${budget.cantidad}</td>
      <td>$${fmt(budget.costoPieza * budget.cantidad)}</td>
    </tr>
    ${budget.manoDeObra > 0 ? `
    <tr>
      <td>Mano de obra / terminado</td>
      <td>$${fmt(budget.manoDeObra)}</td>
      <td>${budget.cantidad}</td>
      <td>$${fmt(budget.manoDeObra * budget.cantidad)}</td>
    </tr>` : ''}
    <tr class="subtotal-row">
      <td>Subtotal sin accesorios</td>
      <td>$${fmt(costoPorPiezaSinAcc)}</td>
      <td>${budget.cantidad}</td>
      <td>$${fmt(totalSinAcc)}</td>
    </tr>
    ${accesoriosRows ? `
    <tr class="acc-header-row">
      <td colspan="4">Accesorios</td>
    </tr>
    ${accesoriosRows}` : ''}
    <tr class="total-row">
      <td>TOTAL GENERAL</td>
      <td>$${fmt(costoPorPiezaConAcc)}</td>
      <td>${budget.cantidad}</td>
      <td>$${fmt(totalConAcc)}</td>
    </tr>
  </tbody>
</table>

<div class="footer">
  <div class="note">Presupuesto válido por 7 días hábiles. Los valores pueden variar según disponibilidad de materiales.</div>
  <div class="caliber-brand">
    <div class="name">CALIBER 3D PRINTING</div>
    <div class="url">caliber3d.com.ar</div>
    <div class="rights">© ${year} Todos los derechos reservados</div>
  </div>
</div>

<script>
  window.onload = function() { setTimeout(function() { window.print(); }, 350); }
</script>
</body>
</html>`

    const win = window.open('', '_blank', 'width=920,height=700')
    if (!win) {
      alert('Habilitá las ventanas emergentes en tu navegador para generar el PDF.')
      return
    }
    win.document.write(html)
    win.document.close()
  }

  async function handleSave() {
    if (!budget.nombre.trim()) {
      alert('Ingresá un nombre para el presupuesto antes de guardar.')
      return
    }
    setSaving(true)
    setSaveStatus('idle')
    try {
      const res = await fetch('/api/presupuestos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: budget.nombre,
          cliente: budget.cliente,
          pieza: budget.pieza,
          costoPieza: budget.costoPieza,
          cantidad: budget.cantidad,
          manoDeObra: budget.manoDeObra,
          accesorios: budget.accesorios.map(({ nombre, costo }) => ({ nombre, costo })),
          totalSinAccesorios: totalSinAcc,
          totalConAccesorios: totalConAcc,
          marcaNegocio: brand.marcaNegocio,
          telefono: brand.telefono,
          emailContacto: brand.emailContacto,
        }),
      })
      if (!res.ok) throw new Error()
      setSaveStatus('ok')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } catch {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

      {/* ── Left: Form ── */}
      <div className="lg:col-span-3 space-y-4">

        {/* Brand info */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <SectionHeader label="Tu información (aparece en el PDF)" />
          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="Nombre del negocio"
              hint="o tu nombre"
              value={brand.marcaNegocio}
              onChange={(v) => setBrandField('marcaNegocio', v)}
              placeholder="Ej: Imprenta 3D Ezequiel"
              className="col-span-2 sm:col-span-1"
            />
            <TextField
              label="Teléfono"
              hint="opcional"
              value={brand.telefono}
              onChange={(v) => setBrandField('telefono', v)}
              placeholder="+54 9 11 ..."
            />
            <TextField
              label="Email de contacto"
              hint="opcional"
              value={brand.emailContacto}
              onChange={(v) => setBrandField('emailContacto', v)}
              placeholder="tu@email.com"
            />

            {/* Logo upload */}
            <div className="col-span-2">
              <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wide mb-1.5">
                Logo{' '}
                <span className="text-zinc-600 normal-case tracking-normal font-normal">
                  (opcional)
                </span>
              </label>
              <div className="flex items-center gap-3 flex-wrap">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 hover:text-white text-sm px-4 py-2 rounded-lg transition-all"
                >
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {brand.logoBase64 ? 'Cambiar logo' : 'Subir logo'}
                </button>
                {brand.logoBase64 && (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={brand.logoBase64}
                      alt="logo"
                      className="h-10 w-auto object-contain rounded border border-zinc-700 bg-white/5 px-2"
                    />
                    <button
                      type="button"
                      onClick={() => setBrandField('logoBase64', '')}
                      className="text-zinc-600 hover:text-zinc-400 text-xs transition-colors"
                    >
                      Quitar
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
          <p className="text-xs text-zinc-600 mt-4">
            Esta información se guarda en este dispositivo y aparece en todos tus PDFs.
          </p>
        </div>

        {/* Budget data */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <SectionHeader label="El pedido" />
          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="Nombre del presupuesto"
              hint="ej: Medallas Torneo 2025"
              value={budget.nombre}
              onChange={(v) => setBudgetField('nombre', v)}
              placeholder="Nombre o referencia del trabajo"
              className="col-span-2"
            />
            <TextField
              label="Cliente"
              hint="opcional"
              value={budget.cliente}
              onChange={(v) => setBudgetField('cliente', v)}
              placeholder="Nombre del cliente"
            />
            <TextField
              label="Nombre de la pieza"
              hint="ej: Medalla 5cm"
              value={budget.pieza}
              onChange={(v) => setBudgetField('pieza', v)}
              placeholder="Descripción de la pieza"
            />
            <NumberField
              label="Costo impresión por pieza"
              hint="$"
              value={budget.costoPieza}
              onChange={(v) => setBudgetField('costoPieza', v)}
            />
            <NumberField
              label="Cantidad"
              hint="unidades"
              value={budget.cantidad}
              onChange={(v) => setBudgetField('cantidad', Math.max(1, Math.round(v)))}
            />
            <NumberField
              label="Mano de obra por pieza"
              hint="$ armado / terminado"
              value={budget.manoDeObra}
              onChange={(v) => setBudgetField('manoDeObra', v)}
              className="col-span-2 sm:col-span-1"
            />
          </div>
        </div>

        {/* Accessories */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-4 bg-orange-500 rounded-full shrink-0" />
              Accesorios
            </h2>
            <button
              type="button"
              onClick={addAccesorio}
              className="flex items-center gap-1.5 text-xs font-semibold text-orange-400 hover:text-orange-300 border border-orange-500/30 hover:border-orange-400/50 px-3 py-1.5 rounded-lg transition-all"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Agregar accesorio
            </button>
          </div>

          {budget.accesorios.length === 0 ? (
            <p className="text-sm text-zinc-600 text-center py-4">
              Nada todavía. Ej: listón, base, envasado, pintura, soporte...
            </p>
          ) : (
            <div className="space-y-3">
              {budget.accesorios.map((acc, i) => (
                <div key={acc.id} className="flex items-center gap-2">
                  <span className="text-xs text-zinc-600 w-5 text-right shrink-0">{i + 1}</span>
                  <input
                    type="text"
                    placeholder="Nombre del accesorio"
                    value={acc.nombre}
                    onChange={(e) => updateAccesorio(acc.id, 'nombre', e.target.value)}
                    className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                  <div className="relative shrink-0 w-32">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm pointer-events-none">
                      $
                    </span>
                    <input
                      type="number"
                      placeholder="0"
                      value={acc.costo || ''}
                      min="0"
                      onChange={(e) =>
                        updateAccesorio(acc.id, 'costo', parseFloat(e.target.value) || 0)
                      }
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-7 pr-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                  <span className="text-xs text-zinc-600 shrink-0">/pieza</span>
                  <button
                    type="button"
                    onClick={() => removeAccesorio(acc.id)}
                    className="shrink-0 p-1.5 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                    aria-label="Quitar accesorio"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setBudget(BUDGET_DEFAULTS)}
          className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors underline underline-offset-2"
        >
          Nuevo presupuesto (limpiar todo)
        </button>
      </div>

      {/* ── Right: Results ── */}
      <div className="lg:col-span-2">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 lg:sticky lg:top-24 space-y-5">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Resumen</h3>

          {/* Per-piece breakdown */}
          <div className="space-y-2.5">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Impresión 3D</span>
              <span className="font-mono text-zinc-200">${fmt(budget.costoPieza)}</span>
            </div>
            {budget.manoDeObra > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Mano de obra</span>
                <span className="font-mono text-zinc-200">${fmt(budget.manoDeObra)}</span>
              </div>
            )}
            {budget.accesorios
              .filter((a) => a.costo > 0)
              .map((a) => (
                <div key={a.id} className="flex justify-between text-sm">
                  <span className="text-zinc-500 italic truncate max-w-[60%]">
                    {a.nombre || 'Accesorio'}
                  </span>
                  <span className="font-mono text-zinc-400">${fmt(a.costo)}</span>
                </div>
              ))}
          </div>

          {/* Sub-totals per piece */}
          <div className="border-t border-zinc-800 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Pieza sin accesorios</span>
              <span className="font-mono text-zinc-300">${fmt(costoPorPiezaSinAcc)}</span>
            </div>
            {accesoriosValidos.length > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Pieza con accesorios</span>
                <span className="font-mono text-zinc-300">${fmt(costoPorPiezaConAcc)}</span>
              </div>
            )}
          </div>

          {/* Grand total */}
          <div className="border-t-2 border-dashed border-zinc-700 pt-5 text-center">
            <span className="text-xs font-bold text-orange-500 uppercase tracking-widest block mb-2">
              Total general
            </span>
            <div className="text-4xl font-black text-white font-mono">${fmt(totalConAcc)}</div>
            {accesoriosValidos.length > 0 && (
              <div className="text-sm text-zinc-500 mt-1.5">
                Sin accesorios:{' '}
                <span className="font-mono">${fmt(totalSinAcc)}</span>
              </div>
            )}
            <div className="text-xs text-zinc-600 mt-1">
              {budget.cantidad} {budget.cantidad === 1 ? 'unidad' : 'unidades'} ×{' '}
              ${fmt(costoPorPiezaConAcc)} c/u
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3 pt-1">
            <button
              type="button"
              onClick={generarPDF}
              className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold py-3 rounded-xl text-sm transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z"
                  clipRule="evenodd"
                />
              </svg>
              Generar PDF
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className={`w-full flex items-center justify-center gap-2 border text-sm font-medium py-2.5 rounded-xl transition-all ${
                saveStatus === 'ok'
                  ? 'bg-green-500/10 border-green-500/30 text-green-400'
                  : saveStatus === 'error'
                  ? 'bg-red-500/10 border-red-500/30 text-red-400'
                  : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300 hover:text-white disabled:opacity-50'
              }`}
            >
              {saving ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Guardando...
                </>
              ) : saveStatus === 'ok' ? (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Guardado en tu cuenta
                </>
              ) : saveStatus === 'error' ? (
                'Error al guardar. Intentá de nuevo.'
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
                  </svg>
                  Guardar en mi cuenta
                </>
              )}
            </button>
          </div>

          <a
            href="/presupuestador/historial"
            className="block text-center text-xs text-zinc-600 hover:text-zinc-400 transition-colors underline underline-offset-2 pt-1"
          >
            Ver mis presupuestos guardados →
          </a>
        </div>
      </div>

    </div>
  )
}

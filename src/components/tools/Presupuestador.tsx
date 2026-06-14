'use client'

import { useState, useEffect, useRef } from 'react'
import { useUser } from '@clerk/nextjs'

type Accesorio = { id: string; nombre: string; costo: number }

type PiezaItem = {
  id: string
  nombre: string
  precioPieza: number
  cantidad: number
  manoDeObra: number
  mostrarManoDeObra: boolean
}

type BudgetState = {
  nombre: string
  cliente: string
  piezas: PiezaItem[]
  accesorios: Accesorio[]
}

type BrandState = {
  marcaNegocio: string
  telefono: string
  emailContacto: string
  logoBase64: string
}

function newPieza(): PiezaItem {
  return {
    id: crypto.randomUUID(),
    nombre: '',
    precioPieza: 0,
    cantidad: 0,
    manoDeObra: 0,
    mostrarManoDeObra: true,
  }
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

function calcPieza(p: PiezaItem) {
  const precioConMdo = p.precioPieza + p.manoDeObra
  return { precioConMdo, subtotal: precioConMdo * p.cantidad }
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
          <span className="ml-1 text-zinc-600 normal-case tracking-normal font-normal">
            ({hint})
          </span>
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

export default function Presupuestador() {
  const { user } = useUser()
  const [budget, setBudget] = useState<BudgetState>({
    nombre: '',
    cliente: '',
    piezas: [newPieza()],
    accesorios: [],
  })
  const [brand, setBrand] = useState<BrandState>({
    marcaNegocio: '',
    telefono: '',
    emailContacto: '',
    logoBase64: '',
  })
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'ok' | 'error'>('idle')
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  useEffect(() => {
    localStorage.setItem('presupuestador_brand', JSON.stringify(brand))
  }, [brand])

  // Totals
  const totalUnidades = budget.piezas.reduce((sum, p) => sum + p.cantidad, 0)
  const totalPiezas = budget.piezas.reduce((sum, p) => sum + calcPieza(p).subtotal, 0)
  const accsValidos = budget.accesorios.filter((a) => a.nombre && a.costo > 0)
  const totalAccesorios = accsValidos.reduce((sum, a) => sum + a.costo * totalUnidades, 0)
  const totalGeneral = totalPiezas + totalAccesorios

  function setBrandField<K extends keyof BrandState>(key: K, val: BrandState[K]) {
    setBrand((prev) => ({ ...prev, [key]: val }))
  }

  // Piece CRUD
  function addPieza() {
    setBudget((prev) => ({ ...prev, piezas: [...prev.piezas, newPieza()] }))
  }

  function removePieza(id: string) {
    setBudget((prev) => ({
      ...prev,
      piezas: prev.piezas.length > 1 ? prev.piezas.filter((p) => p.id !== id) : prev.piezas,
    }))
  }

  function updatePieza(id: string, patch: Partial<PiezaItem>) {
    setBudget((prev) => ({
      ...prev,
      piezas: prev.piezas.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }))
  }

  // Accessory CRUD (global)
  function addAccesorio() {
    setBudget((prev) => ({
      ...prev,
      accesorios: [...prev.accesorios, { id: crypto.randomUUID(), nombre: '', costo: 0 }],
    }))
  }

  function updateAccesorio(id: string, field: 'nombre' | 'costo', val: string | number) {
    setBudget((prev) => ({
      ...prev,
      accesorios: prev.accesorios.map((a) => (a.id === id ? { ...a, [field]: val } : a)),
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

    const multiPieza = budget.piezas.length > 1

    const piezasRows = budget.piezas
      .map((p) => {
        const { precioConMdo, subtotal } = calcPieza(p)
        const nombre = p.nombre || 'Pieza'

        let rows = `
        <tr class="pieza-header-row">
          <td colspan="4">${e(nombre)}</td>
        </tr>`

        if (p.mostrarManoDeObra && p.manoDeObra > 0) {
          rows += `
        <tr>
          <td>Impresión 3D</td>
          <td>$${fmt(p.precioPieza)}</td>
          <td>${p.cantidad}</td>
          <td>$${fmt(p.precioPieza * p.cantidad)}</td>
        </tr>
        <tr>
          <td>Mano de obra / terminado</td>
          <td>$${fmt(p.manoDeObra)}</td>
          <td>${p.cantidad}</td>
          <td>$${fmt(p.manoDeObra * p.cantidad)}</td>
        </tr>`
        } else {
          rows += `
        <tr>
          <td>Precio por pieza</td>
          <td>$${fmt(precioConMdo)}</td>
          <td>${p.cantidad}</td>
          <td>$${fmt(precioConMdo * p.cantidad)}</td>
        </tr>`
        }

        rows += `
        <tr class="subtotal-row">
          <td>${multiPieza ? `Subtotal — ${e(nombre)}` : 'Subtotal'}</td>
          <td>$${fmt(precioConMdo)}</td>
          <td>${p.cantidad}</td>
          <td>$${fmt(subtotal)}</td>
        </tr>`

        return rows
      })
      .join('')

    const accesoriosRows =
      accsValidos.length > 0
        ? `
        <tr class="acc-section-row">
          <td colspan="4">Accesorios</td>
        </tr>
        ${accsValidos
          .map(
            (a) => `
        <tr>
          <td>${e(a.nombre)}</td>
          <td>$${fmt(a.costo)}</td>
          <td>${totalUnidades}</td>
          <td>$${fmt(a.costo * totalUnidades)}</td>
        </tr>`
          )
          .join('')}`
        : ''

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Cotización — ${e(budget.nombre || 'Sin título')}</title>
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
  .pieza-header-row td { background: #fff7ed; color: #c2410c; font-weight: 800; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; border-top: 2px solid #fed7aa; border-bottom: 1px solid #fed7aa; padding: 7px 11px; }
  .subtotal-row td { background: #f4f4f5; font-weight: 700; }
  .acc-section-row td { background: #18181b; color: #d4d4d8; font-weight: 700; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; border-top: 3px solid #3f3f46; padding: 8px 11px; }
  .total-row td { background: #111; color: white; font-weight: 800; font-size: 15px; padding: 13px 11px; border: none; }
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
    <div class="doc-title">Cotización</div>
    <div class="doc-date">${fecha}</div>
  </div>
</div>

<div class="presupuesto-header">
  <h2>${e(budget.nombre || 'Cotización sin título')}</h2>
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
    ${piezasRows}
    ${accesoriosRows}
    <tr class="total-row">
      <td colspan="3">TOTAL GENERAL</td>
      <td>$${fmt(totalGeneral)}</td>
    </tr>
  </tbody>
</table>

<div class="footer">
  <div class="note">Cotización válida por 7 días hábiles. Los precios pueden variar según disponibilidad de materiales.</div>
  <div class="caliber-brand">
    <div class="name">CALIBER 3D PRINTING</div>
    <div class="url">caliber3d.mx</div>
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
      alert('Ingresá un nombre para la cotización antes de guardar.')
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
          piezas: budget.piezas.map(({ id: _id, ...p }) => p),
          accesorios: budget.accesorios.map(({ id: _id, ...a }) => a),
          totalConAccesorios: totalGeneral,
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
            <div className="col-span-2">
              <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wide mb-1.5">
                Logo{' '}
                <span className="text-zinc-600 normal-case tracking-normal font-normal">(opcional)</span>
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

        {/* Budget header */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <SectionHeader label="El pedido" />
          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="Nombre de la cotización"
              hint="ej: Medallas Torneo 2025"
              value={budget.nombre}
              onChange={(v) => setBudget((prev) => ({ ...prev, nombre: v }))}
              placeholder="Nombre o referencia del trabajo"
              className="col-span-2"
            />
            <TextField
              label="Cliente"
              hint="opcional"
              value={budget.cliente}
              onChange={(v) => setBudget((prev) => ({ ...prev, cliente: v }))}
              placeholder="Nombre del cliente"
              className="col-span-2"
            />
          </div>
        </div>

        {/* Piece cards */}
        {budget.piezas.map((pieza, idx) => (
          <PiezaCard
            key={pieza.id}
            pieza={pieza}
            index={idx}
            canRemove={budget.piezas.length > 1}
            onRemove={() => removePieza(pieza.id)}
            onUpdate={(patch) => updatePieza(pieza.id, patch)}
          />
        ))}

        {/* Add piece */}
        <button
          type="button"
          onClick={addPieza}
          className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-zinc-700 hover:border-orange-500/50 text-zinc-500 hover:text-orange-400 text-sm font-medium py-3.5 rounded-2xl transition-all"
        >
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Agregar tipo de pieza
        </button>

        {/* Global accessories */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-4 bg-zinc-500 rounded-full shrink-0" />
                Accesorios
              </h2>
              {totalUnidades > 0 && (
                <p className="text-xs text-zinc-600 mt-1 ml-3.5">
                  Se aplican a las {totalUnidades} unidades totales
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={addAccesorio}
              className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 px-3 py-1.5 rounded-lg transition-all"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Agregar
            </button>
          </div>

          {budget.accesorios.length === 0 ? (
            <p className="text-sm text-zinc-600 text-center py-4">
              Listón, base, envasado, pintura... Se muestran al final de la cotización.
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
                      placeholder="Ej: 13.00"
                      value={acc.costo || ''}
                      min="0"
                      onChange={(e) =>
                        updateAccesorio(acc.id, 'costo', parseFloat(e.target.value) || 0)
                      }
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-7 pr-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                  <span className="text-xs text-zinc-600 shrink-0">/u</span>
                  {totalUnidades > 0 && acc.costo > 0 && (
                    <span className="text-xs text-zinc-500 shrink-0 font-mono w-20 text-right">
                      ${fmt(acc.costo * totalUnidades)}
                    </span>
                  )}
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
          onClick={() =>
            setBudget({ nombre: '', cliente: '', piezas: [newPieza()], accesorios: [] })
          }
          className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors underline underline-offset-2"
        >
          Nueva cotización (limpiar todo)
        </button>
      </div>

      {/* ── Right: Results ── */}
      <div className="lg:col-span-2">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 lg:sticky lg:top-24 space-y-5">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Resumen</h3>

          {/* Per-piece breakdown */}
          <div className="space-y-3">
            {budget.piezas.map((p, idx) => {
              const { precioConMdo, subtotal } = calcPieza(p)
              const label = p.nombre || `Pieza ${idx + 1}`
              return (
                <div key={p.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-orange-400 uppercase tracking-wide truncate max-w-[65%]">
                      {label}
                    </span>
                    <span className="text-xs text-zinc-600 shrink-0">{p.cantidad} u.</span>
                  </div>
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className="text-zinc-500">Precio/pieza</span>
                    <span className="font-mono text-zinc-300">${fmt(precioConMdo)}</span>
                  </div>
                  <div className="flex justify-between text-sm border-b border-zinc-800 pb-3">
                    <span className="text-zinc-500 text-xs">Subtotal</span>
                    <span className="font-mono text-zinc-200 font-medium">${fmt(subtotal)}</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Global accessories summary */}
          {accsValidos.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                Accesorios ({totalUnidades} u.)
              </p>
              {accsValidos.map((a) => (
                <div key={a.id} className="flex justify-between text-sm border-b border-zinc-800 pb-1.5">
                  <span className="text-zinc-500 text-xs truncate max-w-[60%]">{a.nombre}</span>
                  <span className="font-mono text-zinc-300 text-xs">${fmt(a.costo * totalUnidades)}</span>
                </div>
              ))}
            </div>
          )}

          {/* Grand total */}
          <div className="border-t-2 border-dashed border-zinc-700 pt-5 text-center">
            <span className="text-xs font-bold text-orange-500 uppercase tracking-widest block mb-2">
              Total general
            </span>
            <div className="text-4xl font-black text-white font-mono">${fmt(totalGeneral)}</div>
            <div className="text-xs text-zinc-600 mt-1">
              {totalUnidades} {totalUnidades === 1 ? 'unidad' : 'unidades'} en total
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
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Guardando...
                </>
              ) : saveStatus === 'ok' ? (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
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
            Ver mis cotizaciones guardadas →
          </a>
        </div>
      </div>

    </div>
  )
}

function PiezaCard({
  pieza,
  index,
  canRemove,
  onRemove,
  onUpdate,
}: {
  pieza: PiezaItem
  index: number
  canRemove: boolean
  onRemove: () => void
  onUpdate: (patch: Partial<PiezaItem>) => void
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-6 py-3.5 border-b border-zinc-800">
        <h3 className="text-xs font-bold text-orange-400 uppercase tracking-widest flex items-center gap-2">
          <span className="w-1.5 h-4 bg-orange-500 rounded-full shrink-0" />
          Pieza {index + 1}
          {pieza.nombre && (
            <span className="text-zinc-500 font-normal normal-case tracking-normal">
              — {pieza.nombre}
            </span>
          )}
        </h3>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-zinc-600 hover:text-red-400 hover:bg-red-500/10 p-1.5 rounded-lg transition-all"
            aria-label="Quitar pieza"
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wide mb-1.5">
              Nombre de la pieza{' '}
              <span className="text-zinc-600 normal-case tracking-normal font-normal">(ej: Medalla Oro)</span>
            </label>
            <input
              type="text"
              value={pieza.nombre}
              placeholder="Descripción de la pieza"
              onChange={(e) => onUpdate({ nombre: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wide mb-1.5">
              Precio por pieza{' '}
              <span className="text-zinc-600 normal-case tracking-normal font-normal">($)</span>
            </label>
            <input
              type="number"
              value={pieza.precioPieza || ''}
              min="0"
              placeholder="Ej: 25.00"
              onChange={(e) => onUpdate({ precioPieza: parseFloat(e.target.value) || 0 })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wide mb-1.5">
              Cantidad{' '}
              <span className="text-zinc-600 normal-case tracking-normal font-normal">(unidades)</span>
            </label>
            <input
              type="number"
              value={pieza.cantidad || ''}
              min="1"
              placeholder="Ej: 25"
              onChange={(e) => onUpdate({ cantidad: Math.max(1, Math.round(parseFloat(e.target.value) || 1)) })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
                Mano de obra{' '}
                <span className="text-zinc-600 normal-case tracking-normal font-normal">($/pieza)</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={pieza.mostrarManoDeObra}
                  onChange={(e) => onUpdate({ mostrarManoDeObra: e.target.checked })}
                  className="w-3.5 h-3.5 accent-orange-500 cursor-pointer"
                />
                <span className="text-xs text-zinc-500">En PDF</span>
              </label>
            </div>
            <input
              type="number"
              value={pieza.manoDeObra || ''}
              min="0"
              placeholder="Ej: 15.00"
              onChange={(e) => onUpdate({ manoDeObra: parseFloat(e.target.value) || 0 })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

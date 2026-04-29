import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useCart } from "@/context/CartContext"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ShoppingBag, CheckCircle2, Package, CreditCard } from "lucide-react"

// ── Esquema de validación con Zod ────────────────────────────────────────────
// Zod define la forma y las reglas del formulario como un esquema tipado.
// Si un campo no cumple la regla, el mensaje de error se muestra automáticamente.
const checkoutSchema = z.object({
  // Envío
  nombre:      z.string().min(2,  "El nombre debe tener al menos 2 caracteres"),
  direccion:   z.string().min(5,  "Ingresa una dirección válida"),
  ciudad:      z.string().min(2,  "Ingresa una ciudad válida"),
  telefono:    z.string().regex(/^\d{8}$/, "El teléfono debe tener 8 dígitos"),
  // Pago
  nombreTarjeta:  z.string().min(2, "Ingresa el nombre como aparece en la tarjeta"),
  numeroTarjeta:  z.string().regex(/^\d{16}$/, "Debe tener 16 dígitos, sin espacios"),
  vencimiento:    z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Formato MM/AA"),
  cvv:            z.string().regex(/^\d{3,4}$/, "El CVV debe tener 3 o 4 dígitos"),
})

// ── Componente auxiliar para cada campo del formulario ───────────────────────
// Evita repetir el bloque label + input + error en cada campo.
// Recibe `error` del objeto `formState.errors` de React Hook Form.
function FormField({ label, error, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-foreground mb-1.5">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-xs text-destructive mt-1">{error.message}</p>
      )}
    </div>
  )
}

// Clase base para todos los inputs — centralizada para consistencia
const inputBase =
  "w-full px-3 py-2.5 text-sm rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"

const inputNormal = `${inputBase} border-input`
const inputError  = `${inputBase} border-destructive focus:ring-destructive/30`

// ── Pantalla de confirmación ─────────────────────────────────────────────────
function PedidoConfirmado({ onVolver }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center max-w-sm mx-auto">
      <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-6">
        <CheckCircle2 className="h-9 w-9 text-emerald-500" />
      </div>
      <h2 className="font-display text-3xl font-bold text-foreground mb-2">
        ¡Pedido confirmado!
      </h2>
      <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
        Tus galletas están en camino. Recibirás una confirmación pronto.
      </p>
      <Button onClick={onVolver}>
        <ShoppingBag className="h-4 w-4" />
        Seguir comprando
      </Button>
    </div>
  )
}

// ── Página principal de Checkout ─────────────────────────────────────────────
function CheckoutPage() {
  const navigate = useNavigate()
  const { carrito, vaciarCarrito } = useCart()
  const [confirmado, setConfirmado] = useState(false)

  const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0)
  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0)

  // useForm: registra los campos, conecta el resolver de Zod y expone
  // register, handleSubmit y el objeto errors con los mensajes de validación.
  //
  // A diferencia de manejar formularios con useState:
  //   - No hay re-render en cada tecla
  //   - La validación se activa al salir del campo (onBlur) o al intentar enviar
  //   - Los errores están centralizados en un solo objeto
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
  })

  // Carrito vacío — no tiene sentido estar en checkout
  if (carrito.length === 0 && !confirmado) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col items-center justify-center py-24 text-center">
        <span className="text-5xl mb-4 opacity-40">🛒</span>
        <p className="text-sm font-medium text-foreground mb-4">
          Tu carrito está vacío
        </p>
        <Button asChild variant="outline">
          <Link to="/">Ver catálogo</Link>
        </Button>
      </div>
    )
  }

  if (confirmado) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-10">
        <PedidoConfirmado onVolver={() => navigate("/")} />
      </div>
    )
  }

  // handleSubmit valida el formulario con Zod antes de llamar a onSubmit.
  // Si hay errores, onSubmit nunca se ejecuta y los errores aparecen en pantalla.
  const onSubmit = () => {
    vaciarCarrito()
    setConfirmado(true)
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* Encabezado */}
      <Link
        to="/cart"
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 group w-fit"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
        Volver al carrito
      </Link>
      <h1 className="font-display text-4xl font-bold text-foreground mb-10">
        Checkout
      </h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-start gap-8">

          {/* ── Columna izquierda: formulario ── */}
          <div className="flex-1 min-w-0 space-y-6">

            {/* Sección: Envío */}
            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <Package className="h-4 w-4 text-primary" />
                <h2 className="font-display text-base font-semibold text-foreground">
                  Información de envío
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <FormField label="Nombre completo" error={errors.nombre}>
                  <input
                    {...register("nombre")}
                    placeholder="Ana García"
                    className={errors.nombre ? inputError : inputNormal}
                  />
                </FormField>

                <FormField label="Dirección" error={errors.direccion}>
                  <input
                    {...register("direccion")}
                    placeholder="Calle 5, Zona 10, Edificio A"
                    className={errors.direccion ? inputError : inputNormal}
                  />
                </FormField>

                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Ciudad" error={errors.ciudad}>
                    <input
                      {...register("ciudad")}
                      placeholder="Guatemala"
                      className={errors.ciudad ? inputError : inputNormal}
                    />
                  </FormField>

                  <FormField label="Teléfono" error={errors.telefono}>
                    <input
                      {...register("telefono")}
                      placeholder="55551234"
                      maxLength={8}
                      className={errors.telefono ? inputError : inputNormal}
                    />
                  </FormField>
                </div>
              </div>
            </div>

            {/* Sección: Pago */}
            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <CreditCard className="h-4 w-4 text-primary" />
                <h2 className="font-display text-base font-semibold text-foreground">
                  Información de pago
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <FormField label="Nombre en la tarjeta" error={errors.nombreTarjeta}>
                  <input
                    {...register("nombreTarjeta")}
                    placeholder="ANA GARCIA"
                    className={errors.nombreTarjeta ? inputError : inputNormal}
                  />
                </FormField>

                <FormField label="Número de tarjeta" error={errors.numeroTarjeta}>
                  <input
                    {...register("numeroTarjeta")}
                    placeholder="4242424242424242"
                    maxLength={16}
                    className={errors.numeroTarjeta ? inputError : inputNormal}
                  />
                </FormField>

                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Vencimiento" error={errors.vencimiento}>
                    <input
                      {...register("vencimiento")}
                      placeholder="MM/AA"
                      maxLength={5}
                      className={errors.vencimiento ? inputError : inputNormal}
                    />
                  </FormField>

                  <FormField label="CVV" error={errors.cvv}>
                    <input
                      {...register("cvv")}
                      placeholder="123"
                      maxLength={4}
                      className={errors.cvv ? inputError : inputNormal}
                    />
                  </FormField>
                </div>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              Confirmar pedido — Q{total.toFixed(2)}
            </Button>
          </div>

          {/* ── Columna derecha: resumen ── */}
          <aside className="w-72 shrink-0">
            <div className="sticky top-6 rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-border bg-[#FFF1D3]/60">
                <h2 className="font-display text-sm font-semibold text-foreground">
                  Resumen del pedido
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {totalItems} {totalItems === 1 ? "galleta" : "galletas"}
                </p>
              </div>

              <ul className="divide-y divide-border max-h-72 overflow-y-auto">
                {carrito.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 px-5 py-3">
                    <span className="text-xl leading-none">{item.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">
                        {item.nombre}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        x{item.cantidad}
                      </p>
                    </div>
                    <span className="font-sans text-xs font-bold text-primary shrink-0 tabular-nums">
                      Q{(item.precio * item.cantidad).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between px-5 py-4 border-t border-border bg-[#FFF1D3]/40">
                <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                  Total
                </span>
                <span className="font-sans text-lg font-bold text-foreground tabular-nums">
                  Q{total.toFixed(2)}
                </span>
              </div>
            </div>
          </aside>

        </div>
      </form>
    </div>
  )
}

export default CheckoutPage

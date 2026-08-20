import { useId } from 'react'
import { Plus } from 'lucide-react'

interface Props {
  /** Texto del botón, p. ej. "Subir logo" o "Subir imagen". */
  etiqueta: string
  /** Archivo elegido actualmente (o null si no hay ninguno). */
  archivo: File | null
  onCambiar: (archivo: File | null) => void
  accept?: string
  invalido?: boolean
}

/**
 * Input de archivo con la apariencia de un botón (`.boton`) en vez del feo
 * "Seleccionar archivo / Sin archivos seleccionados" nativo del navegador.
 * El `<input type="file">` real queda oculto y un `<label>` lo dispara.
 */
export default function SelectorArchivo({
  etiqueta,
  archivo,
  onCambiar,
  accept = 'image/*',
  invalido = false,
}: Props) {
  const id = useId()

  return (
    <div className="selector-archivo">
      <label htmlFor={id} className={`boton boton-secundario${invalido ? ' invalido' : ''}`}>
        <Plus size={16} aria-hidden="true" />
        {etiqueta}
      </label>
      <input
        id={id}
        type="file"
        accept={accept}
        className="selector-archivo-input"
        onChange={(evento) => onCambiar(evento.target.files?.[0] ?? null)}
      />
      {archivo !== null && <span className="texto-suave">{archivo.name}</span>}
    </div>
  )
}

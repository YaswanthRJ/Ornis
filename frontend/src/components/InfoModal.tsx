import { X } from "lucide-react"

interface Props {
  supportedSpecies: string[]
  open: boolean
  onClose: () => void
}

export function InfoModal({ supportedSpecies, open, onClose }: Props) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Overlay */}
      <div onClick={onClose} className="absolute inset-0 bg-black/60" />

      {/* Modal */}
      <div className="relative w-full sm:max-w-md bg-[#0d1f14] rounded-t-2xl sm:rounded-2xl p-5 shadow-lg">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-green-300 font-semibold text-base">
            Supported Birds
          </p>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-md hover:bg-green-900/40 transition"
          >
            <X size={18} className="text-green-400" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[55vh] overflow-y-auto">
          <ul className="space-y-2 text-sm text-green-200">
            {supportedSpecies.map((s, i) => (
              <li key={i} className="px-3 py-2 rounded-lg bg-green-900/20">
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile only close button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full mt-5 bg-green-600 hover:bg-green-500 py-2 rounded-lg font-semibold transition sm:hidden"
        >
          Close
        </button>
      </div>
    </div>
  )
}
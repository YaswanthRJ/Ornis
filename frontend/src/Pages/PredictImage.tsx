import { useRef, useState } from "react"
import { predictImage } from "../service/api"
import { Upload, Trash2, Info } from "lucide-react"
import { Link } from "react-router-dom"
import { InfoModal } from "../components/InfoModal"

export default function PredictImage() {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [prediction, setPrediction] = useState("")
  const [error, setError] = useState("")
  const [open, setOpen] = useState(false)

const supportedSpecies = [
  "Asian Green Bee Eater",
  "Brown Headed Barbet",
  "Cattle Egret",
  "Common Kingfisher",
  "Common Myna",
  "Common Rosefinch",
  "Common Tailorbird",
  "Coppersmith Barbet",
  "Forest Wagtail",
  "Gray Wagtail",
  "Hoopoe",
  "House Crow",
  "Indian Grey Hornbill",
  "Indian Peacock",
  "Indian Pitta",
  "Indian Roller",
  "Jungle Babbler",
  "Northern Lapwing",
  "Red Wattled Lapwing",
  "Ruddy Shelduck",
  "Rufous Treepie",
  "Sarus Crane",
  "White Breasted Kingfisher",
  "White Breasted-Waterhen",
  "White Wagtail",
]

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0]

    setError("")
    setPrediction("")

    if (!selected) return

    if (!selected.type.startsWith("image/")) {
      setError("Invalid image file")
      return
    }

    setFile(selected)
  }

  function openFilePicker() {
    inputRef.current?.click()
  }

  function removeImage() {
    setFile(null)
    setPrediction("")
    setError("")
    if (inputRef.current) inputRef.current.value = ""
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!file) {
      setError("Upload an image file")
      return
    }

    try {
      setLoading(true)
      setError("")
      setPrediction("")

      const res = await predictImage(file)
      setPrediction(res.predicted_class)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="size-full flex flex-col items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-[#0d1f14] border border-green-900 rounded-xl p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <p className="">Predict Image</p>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="p-2 rounded-md hover:bg-green-900/40 transition"
          >
            <Info size={18} className="text-green-400" />
          </button>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex items-start justify-between gap-4 mb-4">
          <p className="text-sm leading-snug h-10 overflow-hidden flex-1">
            {file ? file.name : "No file selected"}
          </p>

          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              onClick={openFilePicker}
              className="p-2 rounded-md hover:bg-green-900/40 transition"
              title={file ? "Change file" : "Select file"}
            >
              <Upload size={18} className="text-green-400" />
            </button>

            <button
              type="button"
              onClick={removeImage}
              disabled={!file}
              className="p-2 rounded-md hover:bg-red-900/30 disabled:opacity-30 transition"
              title="Remove file"
            >
              <Trash2 size={18} className="text-red-400" />
            </button>
          </div>
        </div>

        <div className="min-h-11 mb-4">
          <p className="text-red-400 text-sm leading-snug">{error}</p>
          <p className="text-green-400 text-sm font-semibold leading-snug">
            {prediction ? `Prediction: ${prediction}` : ""}
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-500 disabled:bg-green-900 py-2 rounded-lg font-semibold transition"
        >
          {loading ? "Processing..." : "Submit"}
        </button>
      </form>

      <Link className="text-sm my-2" to="/audio">
        Upload an audio
      </Link>

      <InfoModal
        open={open}
        onClose={() => setOpen(false)}
        supportedSpecies={supportedSpecies}
      />
    </div>
  )
}
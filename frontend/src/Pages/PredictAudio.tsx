import { useRef, useState } from "react"
import { predictAudio } from "../service/api"
import { Upload, Trash2 } from "lucide-react"

export default function PredictAudio() {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [prediction, setPrediction] = useState("")
  const [error, setError] = useState("")

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0]

    setError("")
    setPrediction("")

    if (!selected) return

    if (!selected.type.startsWith("audio/")) {
      setError("Invalid audio file")
      return
    }

    setFile(selected)
  }

  function openFilePicker() {
    inputRef.current?.click()
  }

  function removeAudio() {
    setFile(null)
    setPrediction("")
    setError("")
    if (inputRef.current) inputRef.current.value = ""
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!file) {
      setError("Upload an audio file")
      return
    }

    try {
      setLoading(true)
      setError("")
      setPrediction("")

      const res = await predictAudio(file)
      setPrediction(res.predicted_class)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="size-full flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-[#0d1f14] border border-green-900 rounded-xl p-6"
      >
        <p className="font-semibold text-green-300 mb-5">
          Predict Audio
        </p>

        <input
          ref={inputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Upload Row */}
        <div className="flex items-start justify-between gap-4 mb-4">
          {/* Fixed filename space (no shift) */}
          <p className="text-sm text-green-200 leading-snug h-10 overflow-hidden flex-1">
            {file ? file.name : "No file selected"}
          </p>

          {/* Icon Actions */}
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
              onClick={removeAudio}
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
    </div>
  )
}
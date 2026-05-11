const API_BASE_URL = import.meta.env.VITE_BASE_URL as string;

export interface PredictionResponse {
    predicted_class: string
}

async function uploadPredictionFile(
    endpoint: string, file: File): Promise<PredictionResponse> {
    try {
        if (!file) {
            throw new Error("No file selected")
        }

        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "POST",
            body: formData,
        })

        let data: any = null

        try {
            data = await response.json()
        } catch {
            // ignore json parse errors
        }

        if (!response.ok) {
            const message =
                data?.detail ||
                data?.message ||
                `Request failed with status ${response.status}`

            throw new Error(message)
        }

        if (!data?.predicted_class) {
            throw new Error("Invalid response from server")
        }

        return data
    } catch (error) {
        console.error("Prediction upload failed:", error)

        if (error instanceof Error) {
            throw error
        }

        throw new Error("Something went wrong while uploading the file")
    }
}

export async function predictImage(
    file: File
): Promise<PredictionResponse> {
    if (!file.type.startsWith("image/")) {
        throw new Error("Selected file must be an image")
    }
    return uploadPredictionFile("/predict/image", file)
}

export async function predictAudio(
    file: File
): Promise<PredictionResponse> {
    if (!file.type.startsWith("audio/")) {
        throw new Error("Selected file must be an audio file")
    }

    return uploadPredictionFile("/predict/audio", file)
}
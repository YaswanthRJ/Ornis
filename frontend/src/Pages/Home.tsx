import { Link } from "react-router-dom"
import { Image, Mic } from "lucide-react"

export default function Home() {
    return (
        <div className="size-full flex items-center justify-center px-5">
            <div className="w-full max-w-2xl">
                <p className="text-white/80 text-sm leading-relaxed mb-8">
                    A machine learning project for predicting bird species from images and audio
                </p>

                {/* Navigation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                    <Link
                        to="/image"
                        className="flex items-center gap-4 border border-white/20 rounded-xl px-5 py-4 hover:bg-white/5 transition"
                    >
                        <Image size={22} className="text-white" />
                        <div>
                            <p className="text-white font-semibold text-base">
                                Predict Image
                            </p>
                            <p className="text-white/60 text-sm">
                                Upload a bird image for classification
                            </p>
                        </div>
                    </Link>

                    <Link
                        to="/audio"
                        className="flex items-center gap-4 border border-white/20 rounded-xl px-5 py-4 hover:bg-white/5 transition"
                    >
                        <Mic size={22} className="text-white" />
                        <div>
                            <p className="text-white font-semibold text-base">
                                Predict Audio
                            </p>
                            <p className="text-white/60 text-sm">
                                Upload a bird call recording
                            </p>
                        </div>
                    </Link>
                </div>

                {/* Project Info */}
                <div className="space-y-3 text-sm text-white/80 leading-relaxed">
                    <p>
                        <span className="text-white font-semibold">Image Model:</span>{" "}
                        ShuffleNet V2 classifier (224×224 ImageNet normalized input)
                    </p>

                    <p>
                        <span className="text-white font-semibold">Audio Model:</span>{" "}
                        ShuffleNet V2 classifier trained on mel-spectrogram images
                    </p>

                    <p>
                        <span className="text-white font-semibold">Deployment Note:</span>{" "}
                        Free hosting may cause slower first prediction due to server cold start and model warm-up.
                    </p>

                    <p>
                        <span className="text-white font-semibold">Constraints:</span>{" "}
                        Limited number of supported species due to financial and hardware
                        constraints (dataset size + training compute).
                    </p>
                </div>

                {/* Pipeline */}
                <details className="mt-8 border border-white/15 rounded-xl px-5 py-4">
                    <summary className="cursor-pointer text-white font-semibold text-sm">
                        Pipeline Details
                    </summary>

                    <div className="mt-4 space-y-5 text-sm text-white/75 leading-relaxed">
                        <div>
                            <p className="text-white font-semibold mb-1">Image Pipeline</p>
                            <p>
                                Images are converted to RGB, resized to 224×224, transformed into
                                tensors, and normalized using ImageNet mean/std before being
                                passed into the classifier.
                            </p>
                        </div>

                        <div>
                            <p className="text-white font-semibold mb-1">Audio Pipeline</p>
                            <p>
                                Audio is resampled, normalized, noise-reduced, and trimmed. The
                                signal is chunked into fixed durations and converted into
                                mel-spectrogram images. Each chunk is classified, and the final
                                prediction is selected using majority voting.
                            </p>
                        </div>
                    </div>
                </details>
            </div>
        </div>
    )
}
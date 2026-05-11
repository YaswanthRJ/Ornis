import { Route, Routes } from "react-router-dom"
import { Layout } from "./Layout/Layout"
import PredictAudio from "./Pages/PredictAudio"
import PredictImage from "./Pages/PredictImage"

function App() {
  return (
   <>
   <Layout>
    <Routes>
    <Route path="/audio" element={<PredictAudio />} />
    <Route path="/image" element={<PredictImage/>} />
    </Routes>
   </Layout>
   </>
  )
}

export default App

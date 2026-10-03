import { createContext, useMemo, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Header } from "./components.jsx";
import {
  C16Matching,
  C17Assigned,
  C18Profile,
  C19Tracking,
  C20Chat,
  C21Arrived,
  C22CurrentJob,
} from "./pages.jsx";

export const RoadsideContext = createContext(null);

export default function App() {
  const [status, setStatus] = useState("searching");
  const [trackingProgress, setTrackingProgress] = useState(0.16);
  const value = useMemo(
    () => ({ status, setStatus, trackingProgress, setTrackingProgress }),
    [status, trackingProgress],
  );
  return (
    <RoadsideContext.Provider value={value}>
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to="/roadside/c16" replace />} />
          <Route path="/roadside/c16" element={<C16Matching />} />
          <Route path="/roadside/c17" element={<C17Assigned />} />
          <Route path="/roadside/c18" element={<C18Profile />} />
          <Route path="/roadside/c19" element={<C19Tracking />} />
          <Route path="/roadside/c20" element={<C20Chat />} />
          <Route path="/roadside/c21" element={<C21Arrived />} />
          <Route path="/roadside/c22" element={<C22CurrentJob />} />
          <Route path="*" element={<Navigate to="/roadside/c16" replace />} />
        </Routes>
      </main>
    </RoadsideContext.Provider>
  );
}

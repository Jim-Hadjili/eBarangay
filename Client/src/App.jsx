import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthLayout from "./pages/Auth";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import VerifyEmail from "./pages/VerifyEmail";
import PatientDashboard from "./pages/PatientDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminQueueControl from "./pages/AdminQueueControl";
import QueueDisplay from "./pages/QueueDisplay";
import QueueHistory from "./pages/QueueHistory";
import MedicalHistory from "./pages/MedicalHistory";
import MedicalRecordDetails from "./pages/MedicalRecordDetails";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/" element={<SignUp />} />
          <Route path="/SignIn" element={<SignIn />} />
        </Route>
        <Route path="/PatientDashboard" element={<PatientDashboard />} />
        <Route path="/queue-history" element={<QueueHistory />} />
        <Route path="/medical-history" element={<MedicalHistory />} />
        <Route
          path="/medical-record/:recordId"
          element={<MedicalRecordDetails />}
        />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/AdminQueueControl" element={<AdminQueueControl />} />
        {/* Public route for Queue Display (TV screen) */}
        <Route path="/queue-display" element={<QueueDisplay />} />
        {/* Email verification route */}
        <Route path="/verify-email" element={<VerifyEmail />} />
      </Routes>
    </BrowserRouter>
  );
}

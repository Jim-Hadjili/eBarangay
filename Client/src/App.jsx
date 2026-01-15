import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthLayout from "./pages/Auth";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import PatientDashboard from "./pages/PatientDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/" element={<SignUp />} />
          <Route path="/SignIn" element={<SignIn />} />
        </Route>
        <Route path="/PatientDashboard" element={<PatientDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

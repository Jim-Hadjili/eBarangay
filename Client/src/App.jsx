import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthLayout from "./pages/Auth";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/" element={<SignUp />} />
          <Route path="/SignIn" element={<SignIn />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

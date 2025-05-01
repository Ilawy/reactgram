import Dock from "./components/Dock";
import { BrowserRouter, Route, Routes } from "react-router";
import Index from "./routes/Index";
import Profile from "./routes/Profile";
import { PBProvider } from "./hooks/pb.context";
import Login from "./routes/Login";
import { Toaster } from "sonner";
import LoginGuard from "./components/LoginGuard";

function App() {
  return (
    <>
      <Toaster position="top-center" richColors />
      <PBProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route
              path="/profile"
              element={
                <LoginGuard>
                  <Profile mode="self" />
                </LoginGuard>
              }
            />
            <Route
              path="/u/:id"
              element={<Profile mode="user" />}
            />
            <Route path="/login" element={<Login />} />
          </Routes>
          <Dock />
        </BrowserRouter>
      </PBProvider>
    </>
  );
}

export default App;

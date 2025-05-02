import Dock from "./components/Dock";
import { BrowserRouter, Route, Routes } from "react-router";
import Index from "./routes/Index";
import Profile from "./routes/Profile";
import { PBProvider } from "./hooks/pb.context";
import Login from "./routes/Login";
import { Toaster } from "sonner";
import LoginGuard from "./components/LoginGuard";
import Aside from "./components/Aside";
import Test from "./routes/test";

function App() {
  return (
    <>
      <Toaster position="top-center" richColors />
      <PBProvider>
        <BrowserRouter>
          <main className="grid grid-cols-4">
            <Aside />
            <article className="col-span-4 lg:col-span-2 mb-24">
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
                <Route path="/test" element={<Test />} />
                <Route
                  path="/u/:id"
                  element={<Profile mode="user" />}
                />
                <Route path="/login" element={<Login />} />
              </Routes>
              <Dock />
            </article>
          </main>
        </BrowserRouter>
      </PBProvider>
    </>
  );
}

export default App;

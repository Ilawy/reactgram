import Dock from "./components/Dock";
import { BrowserRouter, Route, Routes } from "react-router";
import Index from "./routes/Index";
import Profile from "./routes/Profile";
import { PBProvider } from "./hooks/pb.context";
import Auth from "./routes/Auth";
import { Toaster } from "sonner";
import LoginGuard from "./components/LoginGuard";
import Aside from "./components/Aside";
import Search from "./routes/Search";
import Chats from "./routes/Chats";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
    return (
        <>
            <Toaster position="top-center" richColors className="z-50" />
            <QueryClientProvider client={queryClient}>
                <PBProvider>
                    <BrowserRouter>
                        <main className="grid grid-cols-4">
                            <Aside />
                            <article className="col-span-4 lg:col-span-2 mb-24">
                                <Routes>
                                    <Route path="/" element={<Index />} />
                                    <Route
                                        path="/search"
                                        element={
                                            <LoginGuard>
                                                <Search />
                                            </LoginGuard>
                                        }
                                    />
                                    <Route
                                        path="/chats"
                                        element={
                                            <LoginGuard>
                                                <Chats />
                                            </LoginGuard>
                                        }
                                    />
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
                                    <Route path="/auth" element={<Auth />} />
                                </Routes>
                                <Dock />
                            </article>
                        </main>
                    </BrowserRouter>
                </PBProvider>
            </QueryClientProvider>
        </>
    );
}

export default App;

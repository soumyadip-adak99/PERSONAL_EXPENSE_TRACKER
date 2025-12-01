import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Analytics from "./pages/Analytics";
import NotFoundPage from "./pages/NotFoundPage";
import Layout from "./layout/Layout";
import { ExpensesProvider } from "./context/Context";
import { Toaster } from "react-hot-toast";
import ExpensesHistory from "./sections/ExpensesHistory";

function App() {
    useEffect(() => {
        document.addEventListener("contextmenu", (e) => e.preventDefault());
        document.addEventListener("keydown", (e) => {
            if (
                e.key === "F12" ||
                (e.ctrlKey && e.shiftKey && e.key === "I") ||
                (e.ctrlKey && e.shiftKey && e.key === "C") ||
                (e.ctrlKey && e.shiftKey && e.key === "J") ||
                (e.ctrlKey && e.key === "U")
            ) {
                e.preventDefault();
            }
        });
    }, []);

    return (
        <BrowserRouter>
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: "black",
                        color: "white",
                    },
                }}
            />

            <ExpensesProvider>
                <Routes>
                    <Route element={<Layout />}>
                        <Route path="/" element={<Analytics />} />
                        <Route path="/history" element={<ExpensesHistory />} />
                    </Route>
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </ExpensesProvider>
        </BrowserRouter>
    );
}

export default App;

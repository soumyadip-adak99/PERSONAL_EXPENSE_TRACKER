import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../sections/Navbar";
import ExpenseSummary from "../sections/ExpenseSummary";

function Layout() {
    const location = useLocation();

    const isHistoryPage = location.pathname === "/history";

    return (
        <div className="flex min-h-screen">
            <Navbar />

            <div className="flex-1 w-full p-4 overflow-y-auto pt-20 lg:pt-4">
    
                {isHistoryPage ? (
                    <div className="hidden lg:block">
                        <ExpenseSummary />
                    </div>
                ) : (
                    <ExpenseSummary />
                )}

                <Outlet />
            </div>
        </div>
    );
}

export default Layout;

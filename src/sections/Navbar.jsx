import { useState, useEffect } from "react";
import { History, LayoutDashboard, Plus, X, Menu, Wallet } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import ExpensesForm from "../components/ExpensesForm";

function Navbar() {
    // State for sidebar open/close, form modal, and mobile detection
    const [isOpen, setIsOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
    const location = useLocation();

    // Navigation menu items
    const menuItem = [
        { id: "analytic", label: "Analytics", icon: LayoutDashboard, link: "/" },
        { id: "history", label: "History", icon: History, link: "/history" },
    ];

    // // Effect to handle window resize and mobile detection
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            // Auto-close sidebar when switching from mobile to desktop
            if (!mobile && isOpen) {
                setIsOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);
        // Cleanup: remove event listener on component unmount
        return () => window.removeEventListener("resize", handleResize);
    }, [isOpen]);

    return (
        <>
            {/* ------------------ MOBILE HEADER ------------------ */}
            {/* Fixed header that only shows on mobile devices */}
            <div className="lg:hidden bg-white shadow-sm w-full fixed top-0 left-0 z-30 flex items-center px-4 h-16">
                {/* Hamburger menu button to open sidebar */}
                <button
                    className="p-2.5 bg-gray-100 rounded-xl shadow-sm border border-gray-200 z-40"
                    onClick={() => setIsOpen(true)}
                    aria-label="Open menu"
                >
                    <Menu size={20} />
                </button>

                {/* Centered title */}
                <div className="flex-1 flex justify-center">
                    <h3 className="font-bold text-xl text-indigo-600 text-center">Finance Flow</h3>
                </div>

                {/* Invisible spacer to balance the layout (matches menu button width) */}
                <div className="w-10" />
            </div>

            {/* ------------------ BACKDROP OVERLAY ------------------ */}
            {/* Semi-transparent backdrop that appears when sidebar is open on mobile */}
            {isOpen && isMobile && (
                <div
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* ------------------ SIDEBAR NAVIGATION ------------------ */}
            {/* Main sidebar that is fixed on mobile and static on desktop */}
            <aside
                className={`
                    fixed lg:static inset-y-0 left-0 z-50
                    w-72 bg-white border-r border-gray-100 shadow-xl lg:shadow-none
                    transform transition-transform duration-300 ease-in-out
                    flex flex-col h-screen
                    ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                    ${isMobile ? "top-0" : ""}
                `}
            >
                {/* Sidebar header with logo and close button */}
                <div className="h-20 flex items-center justify-between px-6 border-b border-gray-100 shrink-0">
                    {/* Logo and brand name */}
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-600 rounded-lg shadow-blue-200 shadow-sm">
                            <Wallet className="text-white" size={20} />
                        </div>
                        <h1 className="text-xl font-bold text-indigo-600 ">Finance Flow</h1>
                    </div>

                    {/* Close button (only visible on mobile) */}
                    <button
                        className="lg:hidden p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        onClick={() => setIsOpen(false)}
                        aria-label="Close menu"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* ------------------ SIDEBAR CONTENT ------------------ */}
                <div className="flex-1 overflow-y-auto py-6 px-4">
                    {/* Menu section label */}
                    <p className="px-4 text-xs font-semibold text-gray-400 uppercase mb-2 tracking-wide">
                        Menu
                    </p>

                    {/* Navigation menu items */}
                    <nav aria-label="Main menu">
                        {menuItem.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.link;

                            return (
                                <Link key={item.id} to={item.link} className="block no-underline">
                                    <div
                                        // Close sidebar on mobile when menu item is clicked
                                        onClick={() => isMobile && setIsOpen(false)}
                                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium mb-1 cursor-pointer transition-all duration-200
                                            ${
                                                isActive
                                                    ? "bg-blue-50 text-blue-600 shadow-sm border border-blue-100"
                                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent"
                                            }
                                        `}
                                        role="menuitem"
                                    >
                                        {/* Menu item icon with active state styling */}
                                        <Icon
                                            size={20}
                                            className={isActive ? "text-blue-600" : "text-gray-400"}
                                            aria-hidden="true"
                                        />
                                        <span>{item.label}</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Divider between menu items and action button */}
                    <div className="h-px bg-gray-100 my-6" aria-hidden="true" />

                    {/* Add New Expense button */}
                    <div className="px-4">
                        <button
                            onClick={() => {
                                setIsFormOpen(true);
                                // Close sidebar on mobile when opening form
                                if (isMobile) setIsOpen(false);
                            }}
                            className="w-full flex items-center justify-center gap-2.5 bg-blue-600 text-white px-4 py-3.5 rounded-xl shadow-md hover:bg-blue-700 transition-all duration-200 hover:shadow-lg active:scale-95 font-medium"
                            aria-label="Add new expense"
                        >
                            <Plus size={18} aria-hidden="true" />
                            Add New Expense
                        </button>
                    </div>
                </div>
            </aside>

            {/* ------------------ EXPENSE FORM MODAL ------------------ */}
            {/* Modal overlay for adding new expenses */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-60 flex items-center justify-center p-4">
                    <ExpensesForm onClose={() => setIsFormOpen(false)} />
                </div>
            )}
        </>
    );
}

export default Navbar;

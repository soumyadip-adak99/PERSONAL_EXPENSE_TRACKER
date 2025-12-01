import { useState } from "react";
import { useExpenses } from "../context/Context";
import { formatCurrency, formatDate, getCategoryTextColor } from "../utils/expenses";
import { toast } from "react-hot-toast";
import {
    Trash2,
    Pencil,
    X,
    Save,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    Download,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function ExpensesHistory() {
    const {
        expenses,
        deleteExpense,
        updateExpense,
        editingExpense,
        setEditingExpense,
        cancelEdit,
    } = useExpenses();

    const [categoryFilter, setCategoryFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [editForm, setEditForm] = useState({
        description: "",
        amount: "",
        category: "",
        date: "",
    });

    const ITEMS_PER_PAGE = 5;

    const categoryOptions = [
        { value: "food", label: "Food & Dining" },
        { value: "transport", label: "Transportation" },
        { value: "entertainment", label: "Entertainment" },
        { value: "shopping", label: "Shopping" },
        { value: "utilities", label: "Utilities" },
        { value: "health", label: "Health & Medical" },
        { value: "other", label: "Other" },
    ];

    const filteredExpenses = expenses.filter(
        (expense) => categoryFilter === "all" || expense.category === categoryFilter
    );

    const sortedExpenses = [...filteredExpenses].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
    );

    // Pagination calculations
    const totalPages = Math.ceil(sortedExpenses.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentExpenses = sortedExpenses.slice(startIndex, endIndex);

    // Reset to page 1 when filter changes
    const handleFilterChange = (value) => {
        setCategoryFilter(value);
        setCurrentPage(1);
    };

    const handlePreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this expense?")) {
            deleteExpense(id);
            toast.success("Expense deleted successfully");

            // Adjust page if current page becomes empty
            if (currentExpenses.length === 1 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            }
        }
    };

    const handleEditClick = (expense) => {
        setEditingExpense(expense);
        setEditForm({
            description: expense.description,
            amount: expense.amount.toString(),
            category: expense.category,
            date: expense.date,
        });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSaveEdit = () => {
        if (!editForm.description.trim()) {
            toast.error("Description is required");
            return;
        }
        if (!editForm.amount || parseFloat(editForm.amount) <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }
        if (!editForm.category) {
            toast.error("Please select a category");
            return;
        }
        if (!editForm.date) {
            toast.error("Please select a date");
            return;
        }

        const updatedExpense = {
            ...editingExpense,
            description: editForm.description.trim(),
            amount: parseFloat(editForm.amount),
            category: editForm.category,
            date: editForm.date,
        };

        updateExpense(updatedExpense);
        toast.success("Expense updated successfully");
    };

    const handleCancelEdit = () => {
        cancelEdit();
        toast("Edit cancelled", { icon: "✖️" });
    };

    // PDF Export Function
    const handleDownloadPDF = () => {
        try {
            if (!sortedExpenses || !Array.isArray(sortedExpenses)) {
                console.error("sortedExpenses is undefined");
                toast.error("No data available for PDF");
                return;
            }

            const doc = new jsPDF();

            // ---- Title ----
            doc.setFontSize(18);
            doc.setTextColor(37, 99, 235);
            doc.text("Expense Report", 14, 22);

            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

            const filterText =
                categoryFilter === "all"
                    ? "All Categories"
                    : categoryOptions.find((opt) => opt.value === categoryFilter)?.label ||
                      categoryFilter;

            doc.text(`Filter: ${filterText}`, 14, 36);

            // ---- Safe Table Data ----
            const tableData = (sortedExpenses ?? []).map((expense) => [
                formatDate(expense.date),
                expense.description || "",
                categoryOptions.find((opt) => opt.value === expense.category)?.label ||
                    expense.category ||
                    "",
                formatCurrency(expense.amount || 0),
            ]);

            const total = sortedExpenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);

            const tableOptions = {
                startY: 42,
                head: [["Date", "Description", "Category", "Amount"]],
                body: tableData,
                foot: [["", "", "Total:", formatCurrency(total)]],
                theme: "striped",
                headStyles: {
                    fillColor: [79, 70, 229],
                    textColor: 255,
                    fontStyle: "bold",
                    halign: "left",
                },
                footStyles: {
                    fillColor: [243, 244, 246],
                    textColor: [17, 24, 39],
                    fontStyle: "bold",
                    halign: "right",
                },
                styles: {
                    fontSize: 9,
                    cellPadding: 3,
                },
                columnStyles: {
                    0: { cellWidth: 30 },
                    1: { cellWidth: 70 },
                    2: { cellWidth: 45 },
                    3: { cellWidth: 30, halign: "right", fontStyle: "bold" },
                },
                alternateRowStyles: {
                    fillColor: [249, 250, 251],
                },
                margin: { top: 42 },
            };

            // ---- SUPER IMPORTANT FIX ----
            // Ensure `tableOptions` is NEVER undefined
            autoTable(doc, tableOptions);

            const finalY = (doc.lastAutoTable?.finalY ?? 42) + 10;

            doc.setFontSize(11);
            doc.setTextColor(0);
            doc.text(`Total Expenses: ${sortedExpenses.length}`, 14, finalY);

            doc.setFontSize(13);
            doc.setTextColor(37, 99, 235);
            doc.text(`Grand Total: ${formatCurrency(total)}`, 14, finalY + 8);

            doc.save(`Expense_Report_${new Date().toISOString().split("T")[0]}.pdf`);

            toast.success("PDF downloaded successfully!");
        } catch (error) {
            console.error("PDF generation error:", error);
            toast.error("Failed to generate PDF");
        }
    };

    return (
        <div className="w-full space-y-4 mt-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-2xl font-semibold text-blue-700">Expense History</h2>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    {/* Category Filter */}
                    <div className="relative">
                        <select
                            value={categoryFilter}
                            onChange={(e) => handleFilterChange(e.target.value)}
                            className="appearance-none w-full sm:w-auto pl-4 pr-10 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer hover:border-indigo-300 transition-colors"
                        >
                            <option value="all">All Categories</option>
                            {categoryOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                            <svg
                                className="fill-current h-4 w-4"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                            >
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>

                    {/* Download PDF Button */}
                    {sortedExpenses.length > 0 && (
                        <button
                            onClick={handleDownloadPDF}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-sm hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium"
                        >
                            <Download size={18} />
                            <span className="hidden sm:inline">Download PDF</span>
                            <span className="sm:hidden">PDF</span>
                        </button>
                    )}
                </div>
            </div>

            {sortedExpenses.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
                        <AlertCircle className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No expenses found</h3>
                    <p className="text-gray-500">
                        {categoryFilter !== "all"
                            ? "Try changing the category filter or add a new expense."
                            : "Start tracking your spending by adding an expense above."}
                    </p>
                </div>
            ) : (
                <>
                    {/* Desktop Table View */}
                    <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Description
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Category
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {currentExpenses.map((expense) => (
                                        <tr
                                            key={expense.id}
                                            className={`transition-colors duration-150 ${
                                                editingExpense?.id === expense.id
                                                    ? "bg-indigo-50"
                                                    : "hover:bg-gray-50"
                                            }`}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {editingExpense?.id === expense.id ? (
                                                    <input
                                                        type="date"
                                                        name="date"
                                                        value={editForm.date}
                                                        onChange={handleEditChange}
                                                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                    />
                                                ) : (
                                                    <span className="text-sm text-gray-600">
                                                        {formatDate(expense.date)}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {editingExpense?.id === expense.id ? (
                                                    <input
                                                        type="text"
                                                        name="description"
                                                        value={editForm.description}
                                                        onChange={handleEditChange}
                                                        placeholder="Enter description"
                                                        className="w-full px-3 py-1.5 text-sm font-medium border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                    />
                                                ) : (
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {expense.description}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {editingExpense?.id === expense.id ? (
                                                    <select
                                                        name="category"
                                                        value={editForm.category}
                                                        onChange={handleEditChange}
                                                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 capitalize"
                                                    >
                                                        <option value="">Select Category</option>
                                                        {categoryOptions.map((option) => (
                                                            <option
                                                                key={option.value}
                                                                value={option.value}
                                                            >
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-opacity-10 capitalize ${getCategoryTextColor(
                                                            expense.category
                                                        )
                                                            .replace("text-", "bg-")
                                                            .replace(
                                                                "500",
                                                                "100"
                                                            )} ${getCategoryTextColor(
                                                            expense.category
                                                        )}`}
                                                    >
                                                        {expense.category}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {editingExpense?.id === expense.id ? (
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                                            $
                                                        </span>
                                                        <input
                                                            type="number"
                                                            name="amount"
                                                            value={editForm.amount}
                                                            onChange={handleEditChange}
                                                            step="0.01"
                                                            min="0"
                                                            placeholder="0.00"
                                                            className="w-full pl-8 pr-3 py-1.5 text-sm font-bold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                        />
                                                    </div>
                                                ) : (
                                                    <span className="text-sm font-bold text-gray-900">
                                                        {formatCurrency(expense.amount)}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end gap-2">
                                                    {editingExpense?.id === expense.id ? (
                                                        <>
                                                            <button
                                                                onClick={handleSaveEdit}
                                                                className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors text-sm"
                                                                title="Save Changes"
                                                            >
                                                                <Save size={16} />
                                                                Save
                                                            </button>
                                                            <button
                                                                onClick={handleCancelEdit}
                                                                className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors text-sm"
                                                                title="Cancel Edit"
                                                            >
                                                                <X size={16} />
                                                                Cancel
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button
                                                                onClick={() =>
                                                                    handleEditClick(expense)
                                                                }
                                                                className="p-1.5 rounded-md text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 transition-colors"
                                                                title="Edit Expense"
                                                            >
                                                                <Pencil size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(expense.id)
                                                                }
                                                                className="p-1.5 rounded-md text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                                                                title="Delete Expense"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Mobile Card View */}
                    <div className="lg:hidden space-y-4">
                        {currentExpenses.map((expense) => (
                            <div
                                key={expense.id}
                                className={`bg-white rounded-xl shadow-sm border border-gray-100 p-4 transition-all duration-150 ${
                                    editingExpense?.id === expense.id
                                        ? "ring-2 ring-indigo-500 bg-indigo-50"
                                        : ""
                                }`}
                            >
                                {editingExpense?.id === expense.id ? (
                                    // Edit Mode
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                                Date
                                            </label>
                                            <input
                                                type="date"
                                                name="date"
                                                value={editForm.date}
                                                onChange={handleEditChange}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                                Description
                                            </label>
                                            <input
                                                type="text"
                                                name="description"
                                                value={editForm.description}
                                                onChange={handleEditChange}
                                                placeholder="Enter description"
                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                                Category
                                            </label>
                                            <select
                                                name="category"
                                                value={editForm.category}
                                                onChange={handleEditChange}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            >
                                                <option value="">Select Category</option>
                                                {categoryOptions.map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                                Amount
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                                    $
                                                </span>
                                                <input
                                                    type="number"
                                                    name="amount"
                                                    value={editForm.amount}
                                                    onChange={handleEditChange}
                                                    step="0.01"
                                                    min="0"
                                                    placeholder="0.00"
                                                    className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-2 pt-2">
                                            <button
                                                onClick={handleSaveEdit}
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
                                            >
                                                <Save size={18} />
                                                Save
                                            </button>
                                            <button
                                                onClick={handleCancelEdit}
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                                            >
                                                <X size={18} />
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex-1">
                                                <h3 className="text-base font-semibold text-gray-900 mb-1">
                                                    {expense.description}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {formatDate(expense.date)}
                                                </p>
                                            </div>
                                            <div className="flex gap-2 ml-2">
                                                <button
                                                    onClick={() => handleEditClick(expense)}
                                                    className="p-2 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors"
                                                    title="Edit"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(expense.id)}
                                                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-opacity-10 capitalize ${getCategoryTextColor(
                                                    expense.category
                                                )
                                                    .replace("text-", "bg-")
                                                    .replace("500", "100")} ${getCategoryTextColor(
                                                    expense.category
                                                )}`}
                                            >
                                                {expense.category}
                                            </span>
                                            <span className="text-lg font-bold text-gray-900">
                                                {formatCurrency(expense.amount)}
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 pb-2">
                            <div className="text-sm text-gray-600">
                                Showing {startIndex + 1} to{" "}
                                {Math.min(endIndex, sortedExpenses.length)} of{" "}
                                {sortedExpenses.length} expenses
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handlePreviousPage}
                                    disabled={currentPage === 1}
                                    className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                                        currentPage === 1
                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                            : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-indigo-300"
                                    }`}
                                >
                                    <ChevronLeft size={18} />
                                    <span className="hidden sm:inline">Previous</span>
                                </button>
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                                        (page) => (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                                                    currentPage === page
                                                        ? "bg-indigo-600 text-white"
                                                        : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        )
                                    )}
                                </div>
                                <button
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages}
                                    className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                                        currentPage === totalPages
                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                            : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-indigo-300"
                                    }`}
                                >
                                    <span className="hidden sm:inline">Next</span>
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default ExpensesHistory;

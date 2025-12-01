import { useState } from "react";
import { useExpenses } from "../context/Context";
import { X } from "lucide-react";
import toast from "react-hot-toast";

export default function ExpensesForm({ onClose }) {
    const { addExpenses } = useExpenses();

    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("food");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const categoryOption = [
        { value: "food", label: "Food & Dining" },
        { value: "transport", label: "Transport" },
        { value: "entertainment", label: "Entertainment" },
        { value: "shopping", label: "Shopping" },
        { value: "utilities", label: "Utilities" },
        { value: "health", label: "Health & Medical" },
        { value: "other", label: "Other" },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (!description.trim()) {
                alert("Please enter a description");
                return;
            }

            if (!amount || isNaN(amount) || Number(amount) <= 0) {
                alert("Please enter a valid amount");
                return;
            }

            addExpenses({
                description: description.trim(),
                amount: Number(amount),
                category,
                date,
            });

            onClose && onClose();
            toast.success("Expense added successfully");
        } catch (error) {
            console.log(error);
            toast.error("Failed to add expense");
        } finally {
            setDescription("");
            setAmount("");
            setCategory("food");
            setDate(new Date().toISOString().split("T")[0]);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center z-50">
            {/* Modal */}
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                >
                    <X size={20} />
                </button>

                <h2 className="text-2xl font-semibold text-indigo-600 mb-6 text-center">
                    Add New Expense
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Amount
                        </label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category
                        </label>

                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        >
                            {categoryOption.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>

                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
                    >
                        {isSubmitting ? "Adding..." : "Add Expense"}
                    </button>
                </form>
            </div>
        </div>
    );
}

import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { useExpenses } from "../context/Context";
import { formatCurrency, getExpensesByCategory, getTotalExpenses } from "../utils/expenses";

function ExpenseSummary() {
    const { expenses } = useExpenses();

    const totalExpenses = getTotalExpenses(expenses);
    const categoriesData = getExpensesByCategory(expenses);

    let highestCategory = {
        name: "none",
        amount: 0,
    };

    Object.entries(categoriesData || {}).forEach(([category, amount]) => {
        if (amount > highestCategory.amount) {
            highestCategory = {
                name: category,
                amount: amount,
            };
        }
    });

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* ==================== Total expenses ==================== */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg">
                <div className="flex items-center space-x-4">
                    <div className="flex justify-center bg-indigo-200 rounded-full p-3 mb-1">
                        <Wallet size={24} className="text-indigo-500 " />
                    </div>
                </div>
                <div className="text-sm font-medium text-gray-500 uppercase">Total Expenses</div>
                <p className="text-2xl font-bold text-indigo-600">
                    {formatCurrency(totalExpenses)}
                </p>
            </div>

            {/* ==================== highest category ==================== */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg">
                <div className="flex items-center space-x-4">
                    <div className="flex justify-center bg-yellow-200 rounded-full p-3 mb-1">
                        <TrendingUp size={24} className="text-yellow-500" />
                    </div>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase">
                        Highest Category
                    </h3>
                    <p className="text-2xl font-bold text-indigo-600">
                        {highestCategory.name !== "none" ? (
                            <>
                                <span className="capitalize">{highestCategory.name}</span>
                                <span className="text-sm font-normal text-gray-500 ml-2">
                                    {formatCurrency(highestCategory.amount)}{" "}
                                </span>
                            </>
                        ) : (
                            "None"
                        )}
                    </p>
                </div>
            </div>

            {/* ==================== total entries ==================== */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg">
                <div className="flex items-center space-x-4">
                    <div className="flex justify-center bg-red-200 rounded-full p-3 mb-1">
                        <TrendingUp size={24} className="text-red-500" />
                    </div>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase">Total Entries</h3>
                    <p className="text-2xl font-bold text-indigo-600">{expenses.length}</p>
                </div>
            </div>
        </div>
    );
}

export default ExpenseSummary;

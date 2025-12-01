import ExpensesBarChart from "../components/ExpensesBarChart";
import ExpensesPieChart from "../components/ExpensesPieChart";
import { useExpenses } from "../context/Context";
import { getChartData, getExpensesMonth } from "../utils/expenses";
import { BarChart as BarIcon, PieChart as PieIcon } from "lucide-react";

export default function ExpenseChart() {
    const { expenses } = useExpenses();

    const chartData = getChartData(expenses);
    const monthlyData = getExpensesMonth(expenses);

    if (expenses.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <p className="text-gray-500 text-lg">
                    Add expenses to see your analytics visualization.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Pie Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
                <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
                    <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                        <PieIcon size={20} />
                    </div>
                    <h3 className="font-semibold text-gray-800">Category Breakdown</h3>
                </div>
                <div className="flex-1 min-h-[300px] flex items-center justify-center">
                    <ExpensesPieChart data={chartData} />
                </div>
            </div>

            {/* Bar Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
                <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
                    <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                        <BarIcon size={20} />
                    </div>
                    <h3 className="font-semibold text-gray-800">Monthly Spending</h3>
                </div>
                <div className="flex-1 min-h-[300px] flex items-center justify-center">
                    <ExpensesBarChart data={monthlyData} />
                </div>
            </div>
        </div>
    );
}

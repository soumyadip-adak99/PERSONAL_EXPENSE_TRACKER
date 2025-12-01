import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const CATEGORY_COLORS = {
    food: "#6366F1",
    transport: "#06B6D4",
    entertainment: "#A855F7",
    utilities: "#14B8A6",
    health: "#22C55E",
    shopping: "#F97316",
    other: "#64748B",
};

export default function ExpensesPieChart({ data }) {
    if (!data || data.length === 0) {
        return (
            <div className="text-center text-gray-500 flex items-center justify-center h-full">
                No expense data to display
            </div>
        );
    }

    const getColor = (name) => {
        const key = name ? name.toLowerCase().trim() : "other";
        return CATEGORY_COLORS[key] || "#8e9196";
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const { name, value } = payload[0].payload;

            const total = data.reduce((sum, item) => sum + Number(item.value), 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;

            return (
                <div className="bg-white p-4 rounded-md shadow-md border border-gray-100 z-50">
                    <p className="font-medium text-gray-800">{name}</p>
                    <p className="text-lg font-bold text-indigo-500">
                        ₹{Number(value).toFixed(2)}
                        <span className="text-sm text-gray-500 ml-2 font-normal">
                            ({percentage}%)
                        </span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <ResponsiveContainer>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={60}
                    dataKey="value"
                    paddingAngle={2}
                    labelLine={false}
                    animationDuration={800}
                    animationEasing="ease-out"
                >
                    {data.map((entry, index) => (
                        <Cell key={index} fill={getColor(entry.name)} strokeWidth={0} />
                    ))}
                </Pie>

                <Tooltip content={<CustomTooltip />} />

                <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    iconType="circle"
                    formatter={(value) => (
                        <span className="text-sm font-medium text-gray-600 ml-1">{value}</span>
                    )}
                />
            </PieChart>
        </ResponsiveContainer>
    );
}

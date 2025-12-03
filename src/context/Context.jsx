import { createContext, useContext, useEffect, useReducer } from "react";

const ExpenseContext = createContext();

const initialState = {
    expenses: JSON.parse(localStorage.getItem("expenses")) || [],
    loading: false,
    error: null,
    editingExpense: null,
};

const expensesReducer = (state, action) => {
    switch (action.type) {
        case "ADD_EXPENSE":
            return { ...state, expenses: [...state.expenses, action.payload] };

        case "DELETE_EXPENSES":
            return {
                ...state,
                expenses: state.expenses.filter((e) => e.id !== action.payload.id),
            };

        case "UPDATE_EXPENSES":
            return {
                ...state,
                expenses: state.expenses.map((e) =>
                    e.id === action.payload.id ? action.payload : e
                ),
                editingExpense: null,
            };

        case "SET_EDITING_EXPENSE":
            return {
                ...state,
                editingExpense: action.payload,
            };

        case "CANCEL_EDIT":
            return {
                ...state,
                editingExpense: null,
            };

        case "SET_EXPENSES":
            return { ...state, expenses: action.payload };

        case "SET_LOADING":
            return { ...state, loading: action.payload };

        case "SET_ERROR":
            return { ...state, error: action.payload };

        default:
            return state;
    }
};

export const ExpensesProvider = ({ children }) => {
    const [state, dispatch] = useReducer(expensesReducer, initialState);

    useEffect(() => {
        try {
            localStorage.setItem("expenses", JSON.stringify(state.expenses));
        } catch (error) {
            dispatch({ type: "SET_ERROR", payload: error });
        }
    }, [state.expenses]);

    const value = {
        ...state,

        addExpenses: (expense) => {
            const newExpense = {
                ...expense,
                id: crypto.randomUUID(),
            };
            dispatch({ type: "ADD_EXPENSE", payload: newExpense });
        },

        deleteExpense: (id) => {
            dispatch({ type: "DELETE_EXPENSES", payload: { id } });
        },

        updateExpense: (updatedExpense) => {
            dispatch({ type: "UPDATE_EXPENSES", payload: updatedExpense });
        },

        setEditingExpense: (expense) => {
            dispatch({ type: "SET_EDITING_EXPENSE", payload: expense });
        },

        cancelEdit: () => {
            dispatch({ type: "CANCEL_EDIT" });
        },
    };

    return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>;
};

export const useExpenses = () => {
    const context = useContext(ExpenseContext);

    if (!context) {
        throw new Error("useExpenses must be used with an ExpenseProvider");
    }

    return context;
};

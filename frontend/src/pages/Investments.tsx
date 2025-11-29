import { useEffect, useState } from "react";
import InvestmentForm from "../components/InvestmentForm";
import { InvestmentTable } from "../components/investments/InvestmentTable";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { Investment } from "../types";
import api from "../utils/api";

const Investments = (): JSX.Element => {
  const { user } = useAuth();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingInvestment, setEditingInvestment] = useState<Investment | null>(
    null
  );

  useEffect(() => {
    fetchInvestments();
  }, [user]);

  const fetchInvestments = async (): Promise<void> => {
    try {
      const response = await api.get<{ data: Investment[] }>("/investments");
      setInvestments(response.data.data);
    } catch (error) {
      console.error("Failed to fetch investments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (!window.confirm("Are you sure you want to delete this investment?")) {
      return;
    }
    try {
      await api.delete(`/investments/${id}`);
      setInvestments(investments.filter((inv) => inv._id !== id));
    } catch (error) {
      alert("Failed to delete investment");
    }
  };

  const handleEdit = (investment: Investment): void => {
    setEditingInvestment(investment);
    setShowForm(true);
  };

  const handleFormClose = (): void => {
    setShowForm(false);
    setEditingInvestment(null);
  };

  const handleFormSubmit = (): void => {
    fetchInvestments();
    handleFormClose();
  };

  if (loading) {
    return <LoadingSpinner message="Loading investments..." />;
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Investments</h1>
        {user?.role === "admin" && (
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-md font-medium transition-colors"
          >
            Add Investment
          </button>
        )}
      </div>
      {showForm && (
        <InvestmentForm
          investment={editingInvestment}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
        />
      )}
      <InvestmentTable
        investments={investments}
        isAdmin={user?.role === "admin"}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Investments;

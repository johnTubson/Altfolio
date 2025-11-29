import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  AdminUpdateInvestmentDto,
  AssetType,
  Investment,
  User,
} from "../types";
import api from "../utils/api";
import { UserSearchInput } from "./investments/UserSearchInput";
import { FormField } from "./ui/FormField";

const ASSET_TYPES: readonly AssetType[] = [
  "Startup",
  "Crypto Fund",
  "Farmland",
  "Collectible",
  "Other",
] as const;

interface InvestmentFormProps {
  investment: Investment | null;
  onClose: () => void;
  onSubmit: () => void;
}

interface FormData {
  assetName: string;
  assetType: AssetType;
  investedAmount: string;
  investmentDate: string;
  currentValue: string;
  owners: string[];
}

interface FormErrors {
  assetName?: string;
  investedAmount?: string;
  currentValue?: string;
  investmentDate?: string;
  owners?: string;
}

const formatInvestmentDate = (date: string | Date): string => {
  if (date instanceof Date) {
    return date.toISOString().split("T")[0] ?? "";
  }
  if (typeof date === "string") {
    try {
      return new Date(date).toISOString().split("T")[0] ?? "";
    } catch {
      return "";
    }
  }
  return "";
};

const extractOwnerIds = (owners: Investment["owners"]): string[] => {
  if (!owners) return [];
  return owners
    .map((o) => (typeof o === "string" ? o : o._id))
    .filter((id): id is string => typeof id === "string");
};

const extractOwnerUsers = (owners: Investment["owners"]): User[] => {
  if (!owners) return [];
  return owners
    .filter((o): o is User => typeof o !== "string" && o._id !== undefined)
    .map((o) => ({
      _id: o._id,
      name: o.name,
      email: o.email,
      role: o.role || "viewer",
    }));
};

const createInitialFormData = (investment: Investment | null): FormData => {
  if (!investment) {
    return {
      assetName: "",
      assetType: "Startup",
      investedAmount: "",
      investmentDate: "",
      currentValue: "",
      owners: [],
    };
  }
  return {
    assetName: investment.assetName || "",
    assetType: investment.assetType || "Startup",
    investedAmount: investment.investedAmount?.toString() || "",
    investmentDate: formatInvestmentDate(investment.investmentDate),
    currentValue: investment.currentValue?.toString() || "",
    owners: extractOwnerIds(investment.owners),
  };
};

const validateFormData = (formData: FormData): FormErrors => {
  const errors: FormErrors = {};
  if (!formData.assetName.trim()) {
    errors.assetName = "Asset name is required";
  }
  if (!formData.investedAmount || parseFloat(formData.investedAmount) < 0) {
    errors.investedAmount = "Valid invested amount is required";
  }
  if (!formData.currentValue || parseFloat(formData.currentValue) < 0) {
    errors.currentValue = "Valid current value is required";
  }
  if (!formData.investmentDate) {
    errors.investmentDate = "Investment date is required";
  }
  if (formData.owners.length === 0) {
    errors.owners = "At least one owner is required";
  }
  return errors;
};

const InvestmentForm = ({
  investment,
  onClose,
  onSubmit,
}: InvestmentFormProps): JSX.Element => {
  const initialFormData = useMemo(
    () => createInitialFormData(investment),
    [investment]
  );
  const initialSelectedUsers = useMemo(
    () => (investment ? extractOwnerUsers(investment.owners) : []),
    [investment]
  );

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedUsers, setSelectedUsers] =
    useState<User[]>(initialSelectedUsers);

  useEffect(() => {
    setFormData(initialFormData);
    setSelectedUsers(initialSelectedUsers);
  }, [initialFormData, initialSelectedUsers]);

  const handleOwnerToggle = useCallback((userId: string, user?: User): void => {
    setFormData((prev) => {
      const isSelected = prev.owners.includes(userId);
      if (isSelected) {
        setSelectedUsers((prevUsers) =>
          prevUsers.filter((u) => (u._id || u.id) !== userId)
        );
        return {
          ...prev,
          owners: prev.owners.filter((id) => id !== userId),
        };
      } else {
        if (user) {
          setSelectedUsers((prevUsers) => [...prevUsers, user]);
        }
        return {
          ...prev,
          owners: [...prev.owners, userId],
        };
      }
    });
  }, []);

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const validate = useCallback((): boolean => {
    const newErrors = validateFormData(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault();
      if (!validate()) return;

      setLoading(true);
      try {
        const payload: AdminUpdateInvestmentDto = {
          ...formData,
          investedAmount: parseFloat(formData.investedAmount),
          currentValue: parseFloat(formData.currentValue),
          investmentDate: new Date(formData.investmentDate).toISOString(),
        };

        if (investment) {
          await api.put(`/investments/${investment._id}`, payload);
        } else {
          await api.post("/investments", payload);
        }
        onSubmit();
      } catch (error) {
        const axiosError = error as {
          response?: {
            data?: { error?: string; details?: Array<{ msg?: string }> };
          };
        };
        const errorMsg =
          axiosError.response?.data?.error ||
          axiosError.response?.data?.details?.[0]?.msg ||
          "Failed to save investment";
        alert(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [formData, investment, onSubmit, validate]
  );

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800">
            {investment ? "Edit Investment" : "Add Investment"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-3xl leading-none w-8 h-8 flex items-center justify-center"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <FormField
            label="Asset Name"
            name="assetName"
            value={formData.assetName}
            onChange={handleInputChange}
            error={errors.assetName}
            required
            className="mb-6"
          />
          <FormField
            label="Asset Type"
            name="assetType"
            value={formData.assetType}
            onChange={handleInputChange}
            options={ASSET_TYPES}
            required
            className="mb-6"
          />
          <div className="grid grid-cols-2 gap-4 mb-6">
            <FormField
              label="Invested Amount ($)"
              name="investedAmount"
              type="number"
              value={formData.investedAmount}
              onChange={handleInputChange}
              error={errors.investedAmount}
              step="0.01"
              min={0}
              required
            />
            <FormField
              label="Current Value ($)"
              name="currentValue"
              type="number"
              value={formData.currentValue}
              onChange={handleInputChange}
              error={errors.currentValue}
              step="0.01"
              min={0}
              required
            />
          </div>
          <FormField
            label="Investment Date"
            name="investmentDate"
            type="date"
            value={formData.investmentDate}
            onChange={handleInputChange}
            error={errors.investmentDate}
            max={new Date().toISOString().split("T")[0]}
            required
            className="mb-6"
          />
          <div className="mb-6">
            <label className="block mb-2 text-gray-700 font-medium">
              Owners *
            </label>
            <UserSearchInput
              selectedUserIds={formData.owners}
              onToggleUser={handleOwnerToggle}
              selectedUsers={selectedUsers}
            />
            {errors.owners && (
              <span className="block text-red-500 text-sm mt-1">
                {errors.owners}
              </span>
            )}
          </div>
          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-md transition-colors font-medium disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : investment ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvestmentForm;

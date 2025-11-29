import { useEffect, useState } from "react";
import { Investment, InvestmentStats } from "../types";
import api from "../utils/api";

export const useInvestmentData = () => {
  const [stats, setStats] = useState<InvestmentStats | null>(null);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (): Promise<void> => {
    try {
      const [statsRes, investmentsRes] = await Promise.all([
        api.get<{ data: InvestmentStats }>("/investments/stats"),
        api.get<{ data: Investment[] }>("/investments"),
      ]);
      setStats(statsRes.data.data);
      setInvestments(investmentsRes.data.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  return { stats, investments, loading, refetch: fetchData };
};

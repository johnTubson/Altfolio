import { Investment } from "../../types";
import {
  formatCurrency,
  formatDate,
  formatProfitLoss,
  formatROI,
} from "../../utils/formatters";
import { Badge } from "../ui/Badge";
import { TableCell, TableRow } from "../ui/Table";

interface InvestmentTableRowProps {
  investment: Investment;
  isAdmin: boolean;
  onEdit?: (investment: Investment) => void;
  onDelete?: (id: string) => void;
}

export const InvestmentTableRow = ({
  investment,
  isAdmin,
  onEdit,
  onDelete,
}: InvestmentTableRowProps) => {
  const investmentDate =
    investment.investmentDate instanceof Date
      ? investment.investmentDate
      : new Date(investment.investmentDate);
  const roi = investment.returnOnInvestment ?? 0;
  const profitLoss = investment.profitLoss ?? 0;

  const getOwnerName = (owner: Investment["owners"][0]) => {
    return typeof owner === "string" ? owner : owner.name || owner.email;
  };

  return (
    <TableRow>
      <TableCell>{investment.assetName}</TableCell>
      <TableCell>
        <Badge variant="blue">{investment.assetType}</Badge>
      </TableCell>
      <TableCell>${formatCurrency(investment.investedAmount)}</TableCell>
      <TableCell>${formatCurrency(investment.currentValue)}</TableCell>
      <TableCell
        className={`font-medium ${
          roi >= 0 ? "text-green-600" : "text-red-600"
        }`}
      >
        {formatROI(roi)}
      </TableCell>
      <TableCell
        className={`font-medium ${
          profitLoss >= 0 ? "text-green-600" : "text-red-600"
        }`}
      >
        {formatProfitLoss(profitLoss)}
      </TableCell>
      <TableCell>{formatDate(investmentDate)}</TableCell>
      <TableCell>
        <div className="flex gap-2">
          {investment.owners?.map((owner, idx) => {
            const ownerId = typeof owner === "string" ? owner : owner._id;
            return (
              <Badge key={ownerId || idx} variant="gray">
                {getOwnerName(owner)}
              </Badge>
            );
          })}
        </div>
      </TableCell>
      {isAdmin && (
        <TableCell>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit?.(investment)}
              className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm transition-colors whitespace-nowrap"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete?.(investment._id)}
              className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm transition-colors whitespace-nowrap"
            >
              Delete
            </button>
          </div>
        </TableCell>
      )}
    </TableRow>
  );
};

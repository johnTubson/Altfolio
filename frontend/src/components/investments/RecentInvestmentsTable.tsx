import { Investment } from "../../types";
import { formatDate, formatROI } from "../../utils/formatters";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "../ui/Table";

interface RecentInvestmentsTableProps {
  investments: Investment[];
  limit?: number;
}

export const RecentInvestmentsTable = ({
  investments,
  limit = 5,
}: RecentInvestmentsTableProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Recent Investments
      </h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableHeaderCell>Asset Name</TableHeaderCell>
            <TableHeaderCell>Type</TableHeaderCell>
            <TableHeaderCell>Invested</TableHeaderCell>
            <TableHeaderCell>Current Value</TableHeaderCell>
            <TableHeaderCell>ROI</TableHeaderCell>
            <TableHeaderCell>Date</TableHeaderCell>
          </TableHeader>
          <TableBody>
            {investments.slice(0, limit).map((inv) => {
              const investmentDate =
                inv.investmentDate instanceof Date
                  ? inv.investmentDate
                  : new Date(inv.investmentDate);
              const roi = inv.returnOnInvestment ?? 0;
              return (
                <TableRow key={inv._id}>
                  <TableCell>{inv.assetName}</TableCell>
                  <TableCell>{inv.assetType}</TableCell>
                  <TableCell>${inv.investedAmount.toLocaleString()}</TableCell>
                  <TableCell>${inv.currentValue.toLocaleString()}</TableCell>
                  <TableCell
                    className={`font-medium ${
                      roi >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {formatROI(roi)}
                  </TableCell>
                  <TableCell>{formatDate(investmentDate)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

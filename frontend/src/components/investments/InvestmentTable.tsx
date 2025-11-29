import { Investment } from "../../types";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
} from "../ui/Table";
import { InvestmentTableRow } from "./InvestmentTableRow";

interface InvestmentTableProps {
  investments: Investment[];
  isAdmin: boolean;
  onEdit?: (investment: Investment) => void;
  onDelete?: (id: string) => void;
}

export const InvestmentTable = ({
  investments,
  isAdmin,
  onEdit,
  onDelete,
}: InvestmentTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableHeaderCell>Asset Name</TableHeaderCell>
        <TableHeaderCell>Type</TableHeaderCell>
        <TableHeaderCell>Invested Amount</TableHeaderCell>
        <TableHeaderCell>Current Value</TableHeaderCell>
        <TableHeaderCell>ROI</TableHeaderCell>
        <TableHeaderCell>Profit/Loss</TableHeaderCell>
        <TableHeaderCell>Investment Date</TableHeaderCell>
        <TableHeaderCell>Owners</TableHeaderCell>
        {isAdmin && <TableHeaderCell>Actions</TableHeaderCell>}
      </TableHeader>
      <TableBody>
        {investments.length === 0 ? (
          <tr>
            <TableCell
              colSpan={isAdmin ? 9 : 8}
              className="text-center py-8 text-gray-500"
            >
              No investments found
            </TableCell>
          </tr>
        ) : (
          investments.map((inv) => (
            <InvestmentTableRow
              key={inv._id}
              investment={inv}
              isAdmin={isAdmin}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </TableBody>
    </Table>
  );
};

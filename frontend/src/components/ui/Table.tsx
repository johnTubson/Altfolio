interface TableProps {
  children: React.ReactNode;
  className?: string;
}

export const Table = ({ children, className = "" }: TableProps) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-x-auto ${className}`}
    >
      <table className="min-w-full border-collapse">{children}</table>
    </div>
  );
};

interface TableHeaderProps {
  children: React.ReactNode;
}

export const TableHeader = ({ children }: TableHeaderProps) => {
  return (
    <thead>
      <tr className="bg-gray-50">{children}</tr>
    </thead>
  );
};

interface TableHeaderCellProps {
  children: React.ReactNode;
  className?: string;
}

export const TableHeaderCell = ({
  children,
  className = "",
}: TableHeaderCellProps) => {
  return (
    <th
      className={`px-4 py-3 text-left font-semibold text-gray-700 border-b-2 border-gray-200 whitespace-nowrap ${className}`}
    >
      {children}
    </th>
  );
};

interface TableBodyProps {
  children: React.ReactNode;
}

export const TableBody = ({ children }: TableBodyProps) => {
  return <tbody>{children}</tbody>;
};

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const TableRow = ({
  children,
  className = "",
  onClick,
}: TableRowProps) => {
  return (
    <tr
      className={`hover:bg-gray-50 transition-colors ${className}`}
      onClick={onClick}
    >
      {children}
    </tr>
  );
};

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  colSpan?: number;
}

export const TableCell = ({
  children,
  className = "",
  colSpan,
}: TableCellProps) => {
  return (
    <td
      className={`px-4 py-3 border-b border-gray-200 whitespace-nowrap ${className}`}
      colSpan={colSpan}
    >
      {children}
    </td>
  );
};

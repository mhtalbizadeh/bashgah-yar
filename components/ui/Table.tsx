import type { ReactNode, TdHTMLAttributes } from "react";

export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-max text-right text-sm">{children}</table>
    </div>
  );
}

export function TableHead({ children }: { children: ReactNode }) {
  return (
    <thead>
      <tr className="bg-primary text-white">{children}</tr>
    </thead>
  );
}

export function Th({ children }: { children: ReactNode }) {
  return <th className="whitespace-nowrap px-4 py-3 font-medium">{children}</th>;
}

export function TableBody({ children }: { children: ReactNode }) {
  return <tbody className="divide-y divide-slate-100">{children}</tbody>;
}

export function Tr({ children }: { children: ReactNode }) {
  return <tr className="hover:bg-slate-50">{children}</tr>;
}

export function Td({
  children,
  className = "",
  ...props
}: TdHTMLAttributes<HTMLTableCellElement> & {
  children: ReactNode;
  className?: string;
}) {
  return (
    <td
      className={`whitespace-nowrap px-4 py-3 text-slate-700 ${className}`}
      {...props}
    >
      {children}
    </td>
  );
}

interface StatCardProps {
  title: string;
  count: number;
  color?: "blue" | "yellow" | "green" | "red" | "teal";
  icon?: React.ReactNode;
}

const colorClasses = {
  blue: "bg-blue-50 border-blue-200 text-blue-700",
  yellow: "bg-yellow-50 border-yellow-200 text-yellow-700", 
  green: "bg-green-50 border-green-200 text-green-700",
  red: "bg-red-50 border-red-200 text-red-700",
  teal: "bg-teal-50 border-teal-200 text-teal-700",
};

export default function StatCard({ title, count, color = "teal", icon }: StatCardProps) {
  return (
    <div className={`rounded-2xl border-2 shadow-sm p-6 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-4xl font-bold">{count}</p>
        </div>
        {icon && (
          <div className="text-4xl opacity-20">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
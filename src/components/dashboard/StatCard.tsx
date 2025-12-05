import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
	title: string;
	value: number;
	subValue: string;
	change: string;
	trend: "up" | "down";
	icon: LucideIcon;
	gradient: string;
}

export default function StatCard({ title, value, subValue, change, trend, icon: Icon, gradient }: StatCardProps) {
	return (
		<div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all duration-300 group">
			{/* Icon */}
			<div className="flex items-start justify-between">
				<div>
					<p className="text-gray-400 text-base font-light pt-2">{title}</p>
				</div>
				<div
					className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
				>
					<Icon className="w-4 h-4 text-white" />
				</div>
			</div>

			{/* Content */}
			<div className="space-y-2">
				<h3 className="text-3xl font-bold text-white">
					{value} <span className="text-gray-400 text-base font-light">{subValue}</span>
				</h3>

				{/* Change Indicator */}
				<div className="flex items-center gap-2">
					{trend === "up" ? (
						<TrendingUp className="w-4 h-4 text-green-500" />
					) : (
						<TrendingDown className="w-4 h-4 text-red-500" />
					)}
					<span className={`text-sm ${trend === "up" ? "text-green-500" : "text-red-500"}`}>{change}</span>
				</div>
			</div>
		</div>
	);
}

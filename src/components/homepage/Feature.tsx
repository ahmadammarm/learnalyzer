import { BarChart3, Zap, Target, TrendingUp, Brain, BookOpen } from "lucide-react";
import CardSwap, { Card } from "../animation/CardSwap";

const features = [
	{
		title: "Real-Time Study Analytics",
		description:
			"Track every study session with precision. Our advanced analytics engine captures detailed insights about your learning patterns, helping you understand exactly how you study best.",
		icon: BarChart3,
		gradient: "from-blue-500 to-purple-600",
		stats: "95% accuracy",
	},
	{
		title: "AI-Powered Insights",
		description:
			"Get intelligent recommendations based on your learning behavior. Our AI analyzes your study patterns and suggests optimizations to boost your productivity and retention.",
		icon: Brain,
		gradient: "from-purple-500 to-pink-600",
		stats: "40% faster learning",
	},
	{
		title: "Goal-Oriented Learning",
		description:
			"Set ambitious learning goals and track your progress in real-time. Learnalyzer helps you stay focused and motivated by visualizing your journey toward academic excellence.",
		icon: Target,
		gradient: "from-green-500 to-blue-600",
		stats: "3x better retention",
	},
];

export default function Features() {
	return (
		<section id="features" className="relative pt-36 py-40 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
			{/* Background Elements */}
			<div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50/30"></div>
			<div className="absolute top-1/4 left-0 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl"></div>
			<div className="absolute bottom-1/4 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>

			<div className="relative max-w-7xl mx-auto">
				<div className="grid lg:grid-cols-2 gap-6 items-center">
					{/* Left Content */}
					<div className="space-y-8">
						{/* Section Header */}
						<div className="space-y-4">
							<div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
								{/* <TrendingUp className="w-4 h-4 mr-2" /> */}
								Our Features
							</div>
							<h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
								Smart Learning Analytics
							</h2>
							<p className="text-xl text-black leading-relaxed max-w-lg">
								Transform your study sessions with AI-powered insights and real-time analytics that adapt to your
								learning style.
							</p>
						</div>
					</div>

					{/* Right Content - CardSwap */}
					<div className="relative h-[400px] lg:h-[400px]">
						<CardSwap
							width={500}
							height={400}
							cardDistance={45}
							verticalDistance={60}
							delay={4000}
							pauseOnHover={true}
							skewAmount={4}
							easing="elastic"
						>
							{features.map((feature, index) => {
								const Icon = feature.icon;
								return (
									<Card key={index} customClass="shadow-2xl border-0 overflow-hidden">
										<div className="relative h-full p-8 bg-white">
											{/* Card Background Gradient */}
											<div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-5`}></div>

											{/* Card Content */}
											<div className="relative z-10 h-full flex flex-col">
												{/* Icon & Stats */}
												<div className="flex items-center justify-between mb-6">
													<div
														className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center shadow-lg`}
													>
														<Icon className="w-8 h-8 text-white" />
													</div>
													<div className="text-right">
														<div className="text-2xl font-bold text-gray-900">{feature.stats}</div>
														<div className="text-sm text-gray-500">improvement</div>
													</div>
												</div>

												{/* Title */}
												<h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-tight">
													{feature.title}
												</h3>

												{/* Description */}
												<p className="text-gray-600 leading-relaxed mb-6 flex-1">{feature.description}</p>

												{/* Bottom Decoration */}
												<div className="flex items-center space-x-2">
													<div className={`w-2 h-2 rounded-full bg-gradient-to-r ${feature.gradient}`}></div>
													<div className={`w-4 h-2 rounded-full bg-gradient-to-r ${feature.gradient} opacity-60`}></div>
													<div className={`w-8 h-2 rounded-full bg-gradient-to-r ${feature.gradient} opacity-30`}></div>
												</div>
											</div>
										</div>
									</Card>
								);
							})}
						</CardSwap>
					</div>
				</div>
			</div>

			{/* Bottom Decoration */}
			<div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
		</section>
	);
}

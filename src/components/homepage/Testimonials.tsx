import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
	{
		name: "Ardha Tavada",
		role: "Computer Science Student",
		quote:
			"StudyTrack completely transformed how I approach learning. The insights helped me identify my peak study hours and optimize my schedule accordingly.",
		avatar: "AT",
	},
	{
		name: "Ammar Musyaffa",
		role: "Computer Science Student",
		quote:
			"The analytics dashboard is incredibly intuitive. I can see exactly where I'm spending my time and adjust my study strategy in real-time.",
		avatar: "AM",
	},
	{
		name: "Adil Zakaria",
		role: "Computer Science Student",
		quote:
			"I've improved my grades by 15% since using StudyTrack. The AI recommendations are spot-on and have helped me study smarter, not harder.",
		avatar: "AZ",
	},
];

export default function Testimonials() {
	return (
		<section id="testimonials" className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-card/30">
			<div className="max-w-7xl mx-auto">
				<div className="text-center space-y-4 mb-16">
					<h2 className="text-4xl sm:text-5xl font-bold">Student Success Stories</h2>
					<p className="text-lg text-white max-w-2xl mx-auto">
						Join thousands of students who are already transforming their learning
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
					{testimonials.map((testimonial, index) => (
						<Card
							key={index}
							className="bg-background border-4 border-primary/20 hover:border-primary/40 transition-colors rounded-2xl cursor-target"
						>
							<CardContent className="pt-6 space-y-4">
								<p className="text-foreground/80 leading-relaxed italic">&quot;{testimonial.quote}&quot;</p>
								<div className="flex items-center gap-3 pt-4 border-t border-primary/10">
									<div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-sm font-semibold text-primary-foreground">
										{testimonial.avatar}
									</div>
									<div>
										<p className="font-semibold text-foreground">{testimonial.name}</p>
										<p className="text-sm text-muted-foreground">{testimonial.role}</p>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>

				{/* Navigation arrows */}
				<div className="flex justify-center gap-4">
					<Button
						variant="outline"
						size="icon"
						className="border-primary/20 hover:bg-primary/10 rounded-full h-10 w-10 bg-transparent cursor-target"
					>
						<ChevronLeft className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						size="icon"
						className="border-primary/20 hover:bg-primary/10 rounded-full h-10 w-10 bg-transparent cursor-target"
					>
						<ChevronRight className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</section>
	);
}

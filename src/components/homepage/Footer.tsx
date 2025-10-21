import { Button } from "@/components/ui/button";
import ShinyText from "../animation/ShinyText";

export default function Footer() {
	return (
		<footer className="bg-background border-primary/10 py-6 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				{/* Footer content */}
				<div className="flex justify-between items-end gap-8 mb-8">
					{/* Brand */}
					<div className="md:col-span-1">
						<ShinyText text="Learnalyzer" disabled={false} speed={5} className="text-xl font-bold" />
						<p className="text-white text-sm mt-2">Master your learning journey.</p>
					</div>

					{/* CTA */}
					<div className="md:col-span-1 flex flex-col justify-between">
						<div />
						<Button
							variant="outline"
							className="bg-primary hover:bg-primary/90 text-white font-light rounded-full w-full cursor-target"
						>
							Get Started
						</Button>
					</div>
				</div>

				{/* Bottom */}
				<div className="border-t border-primary/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-foreground/60">
					<p>&copy; 2025 Learnalyzer. All rights reserved.</p>
					<div className="flex gap-6 mt-4 md:mt-0">
						<a href="#" className="hover:text-foreground transition-colors cursor-target">
							Privacy Policy
						</a>
						<a href="#" className="hover:text-foreground transition-colors cursor-target">
							Terms of Use
						</a>
					</div>
					<div className="flex gap-6 mt-4 md:mt-0">
						<a href="#" className="hover:text-foreground transition-colors cursor-target">
							Instagram
						</a>
						<a href="#" className="hover:text-foreground transition-colors cursor-target">
							GitHub
						</a>
						<a href="#" className="hover:text-foreground transition-colors cursor-target">
							LinkedIn
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}

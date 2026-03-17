"use client";

import { House, NotebookTabs, Bell, MessageCircle, CircleUser } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/src/lib/utils";

export function NavbarComponent() {
	const pathname = usePathname();

	const hideNavbarRoutes = ["/login", "/onboarding"];

	if (hideNavbarRoutes.includes(pathname)) {
		return null;
	}

	return (
		<>
			<div className="h-20 w-full"></div>

			<div className="bg-dark fixed bottom-0 z-999 flex w-full flex-row items-center justify-around p-4 shadow-md">
				<Link href="/">
					<House
						className={cn(
							"size-7 transition-colors",
							pathname === "/" ? "text-primary" : "text-primary-foreground"
						)}
					/>
				</Link>

				<Link href="/list">
					<NotebookTabs
						className={cn(
							"size-7 transition-colors",
							pathname === "/list" ? "text-primary" : "text-primary-foreground"
						)}
					/>
				</Link>

				<Link href="/notifications">
					<Bell
						className={cn(
							"size-7 transition-colors",
							pathname === "/notifications" ? "text-primary" : "text-primary-foreground"
						)}
					/>
				</Link>

				<Link href="/messages">
					<MessageCircle
						className={cn(
							"size-7 transition-colors",
							pathname === "/messages" ? "text-primary" : "text-primary-foreground"
						)}
					/>
				</Link>

				<Link href="/profile">
					<CircleUser
						className={cn(
							"size-7 transition-colors",
							pathname === "/profile" ? "text-primary" : "text-primary-foreground"
						)}
					/>
				</Link>
			</div>
		</>
	);
}
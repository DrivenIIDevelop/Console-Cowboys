import { ReactNode } from "react";
import Navigation from "./Navigation";

export default function PageWrapper({ children }: { children: ReactNode }) {
	return <div className="flex max-h-screen">
		<Navigation />
		{children}
	</div>
}

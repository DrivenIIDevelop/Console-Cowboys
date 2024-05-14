import { ReactNode } from "react";
import Navigation from "./Navigation";
import { GetUserInfo, LoginContext } from "../loginInfo";

export default function PageWrapper({ children }: { children: ReactNode }) {
	return <div className="flex max-h-screen">
		<LoginContext.Provider value={GetUserInfo()}>
			<Navigation />
			{children}
		</LoginContext.Provider>
	</div>
}

import Header from "../components/Navigations/Header";
import Footer from "../components/Navigations/Footer";
import { Outlet } from "react-router-dom";
import SikuyAi from "../components/fraction/SikuyAi";

export default function MainLayout() {
    return (
        <div className="bg-white dark:bg-black w-full overflow-x-hidden">
            <Header />
                <main>
                    <Outlet />
                </main>
            <Footer />
        </div>
    );
}

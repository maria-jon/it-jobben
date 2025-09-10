import { Outlet } from "react-router"
import { Header } from "../fixtures/Header"
import { Footer } from "../fixtures/Footer"

export const Layout = () => {

    return (
        <>
        <header >
            <Header />
        </header>
        <main>
            <Outlet />
        </main>
        <footer>
            <Footer />
        </footer>
        </>
    )
}
import { DigiHeader, DigiHeaderNavigation, DigiHeaderNavigationItem } from "@digi/arbetsformedlingen-react";
import "../fixtures/fixtures.css"

export const Header = () => { 

    return (
        <DigiHeader
            afSystemName="IT-platsbanken"
            afHideSystemName={false}
            afMenuButtonText="Meny"
        >
            <a slot="header-logo" aria-label="Startsida" href="/"></a>
            <div slot="header-content">
            </div>
            <div slot="header-navigation">
                <DigiHeaderNavigation
                    afCloseButtonText="Stäng"
                    afCloseButtonAriaLabel="Stäng meny"
                    afNavAriaLabel="Huvudmeny"
                >
                    <DigiHeaderNavigationItem afCurrentPage={location.pathname === "/"}>
                        <a href="/">Startsida</a>
                    </DigiHeaderNavigationItem>
                    <DigiHeaderNavigationItem afCurrentPage={location.pathname.startsWith("/search")}>
                        <a href="/search">Alla jobb</a>
                    </DigiHeaderNavigationItem>
                </DigiHeaderNavigation>
            </div>
        </DigiHeader>
    )
}


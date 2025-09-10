import { FooterVariation } from "@digi/arbetsformedlingen"
import { DigiFooter } from "@digi/arbetsformedlingen-react"

import "../fixtures/fixtures.css"

export const Footer = () => {

    return (
    <DigiFooter afVariation={FooterVariation.SMALL}>
    <div slot="content-top"></div>
    <div slot="content-bottom-left"></div>
        <div slot="content-bottom-right">
            <p>Denna sida är byggd av</p>
                <a href="https://github.com/DulamaA">Antonina Dulama</a>
                <a href="https://github.com/maria-jon">Maria Jonasson</a>
                <a href="https://github.com/AgnesWilson">Agnes Wilsson</a>
        </div>
    </DigiFooter>
    )
}

import { useNavigate, useParams } from "react-router-dom";

import { DigiLayoutBlock, DigiLink, DigiTypography } from "@digi/arbetsformedlingen-react";
import { LayoutBlockVariation } from "@digi/arbetsformedlingen";

export default function AdPage() {
  const navigate = useNavigate();

  const { id } = useParams();
  return (
    <>
      <DigiLink
        afHref="/"
        afOverrideLink={true}
        afAriaLabel="Gå tillbaka"
        onAfOnClick={() => navigate(-1)}
      >	 
        ← Tillbaka
      </DigiLink>
      <DigiLayoutBlock afVariation={LayoutBlockVariation.PRIMARY}>
        <DigiTypography>
          <h2>Rubrik för annons {id}</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam magna neque, interdum vel massa eget, 
            condimentum rutrum velit. Sed vitae ullamcorper sem. Aliquam malesuada nunc sed purus mollis scelerisque. 
            Curabitur bibendum leo quis ante porttitor tincidunt. Nam tincidunt imperdiet tortor eu suscipit. Maecenas ut dui est.
          </p>
        </DigiTypography>
      </DigiLayoutBlock>
    </>
  );
}

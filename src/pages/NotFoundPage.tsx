import { isRouteErrorResponse, useRouteError, useNavigate } from "react-router-dom";
import { 
  DigiLayoutBlock,
  DigiTypography,
  DigiTypographyHeadingJumbo,
  DigiLayoutContainer,
  DigiLink
} from "@digi/arbetsformedlingen-react";
import { 
  TypographyHeadingJumboLevel, 
  TypographyHeadingJumboVariation 
} from "@digi/arbetsformedlingen";

export default function NotFoundPage() {
  const err = useRouteError();

  let title = "Oops!";
  let message = "Page not found or an error occurred.";

  if (isRouteErrorResponse(err)) {
    title = `${err.status} - ${err.statusText}`;
    message =
      typeof err.data === "string" ? err.data : err.data?.message ?? message;
  } else if (err instanceof Error) {
    message = err.message;
  }

  const navigate = useNavigate();

  return (
  <DigiLayoutBlock afVerticalPadding afMarginTop className="hero">
    <DigiTypography>
      <DigiTypographyHeadingJumbo
        afText={title}
        afLevel={TypographyHeadingJumboLevel.H1}
        afVariation={TypographyHeadingJumboVariation.PRIMARY}
      />
      <DigiLink
          afHref="/"
          afOverrideLink={true}
          afAriaLabel="Gå tillbaka"
          onAfOnClick={() => navigate(-1)}
          hideVisitedColor
        >	 
          ← Tillbaka
      </DigiLink>
      <DigiLayoutContainer afVerticalPadding afNoGutter>
        <p>{message}</p>
      </DigiLayoutContainer>
    </DigiTypography>
  </DigiLayoutBlock>
  );
}

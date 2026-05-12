import Localnav from "@/_components/localnav";
import Localfooter from "@/_components/localfooter";
import ScrollToTopOnRouteChange from "./_components/ScrollToTopOnRouteChange";

export default function ResearchLayout({ children }) {
    return (
        <>
            <ScrollToTopOnRouteChange />
            <Localnav />
            {children}
            <Localfooter />
        </>
    );
}

import Localnav from "@/_components/localnav";
import Localfooter from "@/_components/localfooter";

export default function ResearchLayout({ children }) {
    return (
        <>
            <Localnav />
            {children}
            <Localfooter />
        </>
    );
}

import Localnav from "../projects/_components/localnav";
import Localfooter from "../projects/_components/localfooter";

export default function ResearchLayout({ children }) {
    return (
        <>
            <Localnav />
            {children}
            <Localfooter />
        </>
    );
}

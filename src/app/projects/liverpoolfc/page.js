import "./_style/liverpool.scss";
import Localnav from "../_components/localnav";
import Localfooter from "../_components/localfooter";
import SectionHero from "./_components/sectionHero";
import SectionHighlight from "./_components/sectionHighlight";
import SectionProjectGoal from "./_components/sectionProjectGoal";
import SectionProblem from "./_components/sectionProblem";
import SectionResearch from "./_components/sectionResearch";
import SectionKeyInsights from "./_components/sectionKeyInsights";
import SectionDesignStrategy from "./_components/sectionDesignStrategy";
import SectionInformationArchitecture from "./_components/sectionInformationArchitecture";
import SectionFinalDesign from "./_components/sectionFinalDesign";
import SectionOutcome from "./_components/sectionOutcome";
import SectionReflection from "./_components/sectionReflection";

export const metadata = {
    title: "Liverpool FC",
    description: "Redesign Liverpool FC",
};

export default function LiverpoolfcPage() {
    return (
        <>
            <Localnav />
            <main id="main" className="main page-liverpoolfc">
                <SectionHero />
                <SectionHighlight />
                <SectionProjectGoal />
                <SectionProblem />
                <SectionResearch />
                <SectionKeyInsights />
                <SectionDesignStrategy />
                <SectionInformationArchitecture />
                <SectionFinalDesign />
                <SectionOutcome />
                <SectionReflection />
            </main>
            <Localfooter />
        </>
    );
}

import "./_style/eum.style.scss";
import SectionHero from "./_components/sectionHero";
import SectionHighlight from "./_components/sectionHighlight";
import SectionKeyScreens from "./_components/sectionKeyScreens";
import SectionProjectOverview from "./_components/sectionProjectOverview";
import SectionProjectBackground from "./_components/sectionProjectBackground";
import SectionDoubleDiamond from "./_components/sectionDoubleDiamond";
import SectionDiscover from "./_components/sectionDiscover";
import SectionDefine from "./_components/sectionDefine";
import SectionDevelop from "./_components/sectionDevelop";
import SectionDevelopMvp from "./_components/sectionDevelopMvp";
import SectionDevelopWireframe from "./_components/sectionDevelopWireframe";
import SectionDevelopUsabilityTesting from "./_components/sectionDevelopUsabilityTesting";
import SectionDeliver from "./_components/sectionDeliver";
import SectionDeliverIterationAndRedesign from "./_components/sectionDeliverIterationAndRedesign";
import SectionDeliverKeyChanges from "./_components/sectionDeliverKeyChanges";
import SectionDeliverStructureUpdate from "./_components/sectionDeliverStructureUpdate";
import SectionDeliverFinalPrototype from "./_components/sectionDeliverFinalPrototype";
import SectionSystemDefinition from "./_components/sectionSystemDefinition";
import SectionAiPipeline from "./_components/sectionAiPipeline";
import SectionFinalResult from "./_components/sectionFinalResult";

export const metadata = {
    title: "Eum",
    description: "Case Study Eum",
};

export default function EumPage() {
    return (
        <main id="main" className="main">
            <SectionHero />
            <SectionHighlight />
            <SectionKeyScreens />
            <SectionProjectOverview />
            <SectionProjectBackground />
            <SectionDoubleDiamond />
            <SectionDiscover />
            <SectionDefine />
            <SectionDevelop />
            <SectionDevelopMvp />
            <SectionDevelopWireframe />
            <SectionDevelopUsabilityTesting />
            <SectionDeliver />
            <SectionDeliverIterationAndRedesign />
            <SectionDeliverKeyChanges />
            <SectionDeliverStructureUpdate />
            <SectionDeliverFinalPrototype />
            <SectionSystemDefinition />
            <SectionAiPipeline />
            <SectionFinalResult />
        </main>
    );
}

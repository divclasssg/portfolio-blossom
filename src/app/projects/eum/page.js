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
import SectionDevelopReview from "./_components/sectionDevelopReview";
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
import Localnav from "../_components/localnav";
import Link from "next/link";

export const metadata = {
    title: "Eum",
    description: "Case Study Eum",
};

export default function EumPage() {
    return (
        <>
            <Localnav />
            <main id="main" className="main page-eum">
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
                <SectionDevelopReview />
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
            <footer className="localfooter">
                <div className="localfooter-content">
                    <h2>parkseik</h2>
                    <ul>
                        <li>
                            <Link href="/">home</Link>
                        </li>
                        <li>
                            <Link href="/about">about</Link>
                        </li>
                        <li>
                            <span>project</span>
                            <ul>
                                <li>
                                    <Link href="/projects/eum">eum, 2026</Link>
                                </li>
                                <li>
                                    <Link href="/projects/cronometer">
                                        cronometer, 2025 -- 2026
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/liverpoolfc">liverpool fc, 2025</Link>
                                </li>
                            </ul>
                        </li>
                    </ul>
                    <p className="copyright">&copy; 2025 -- 2026 parkseik. All rights reserved.</p>
                </div>
            </footer>
        </>
    );
}

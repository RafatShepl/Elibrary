import Hero from "../components/Hero"
import HighLights from "../components/HighLights"
import FeatureBooks from "../components/feature-book"

export default function Home(){
    return <div className="mt-2.5 col">
        
        <Hero/>
        <HighLights/>
        <FeatureBooks/>

    </div>
}
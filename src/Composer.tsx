import { useState, useEffect } from "react";
import { useParams } from "react-router";

const Composer = () => {

    const parameters = useParams();
    const [composer, setComposer] = useState<any>({});

    useEffect(() => {

        const getComposer = async () => {
            const composersRequest = await fetch(`https://api.openopus.org/composer/list/search/${parameters.name?.split(" ")[0]}.json`);
            const composersList = await composersRequest.json();
            const composerId = composersList.composers.find((composer: any) => (composer.name == parameters.name)).id;
            const composerRequest = await fetch(`https://api.openopus.org/composer/list/ids/${composerId}.json`);
            const composerFacts = await composerRequest.json();
            const worksRequest = await fetch(`https://api.openopus.org/work/list/composer/${composerId}/genre/all.json`);
            const worksList = await worksRequest.json();

            setComposer({...composerFacts.composers[0], works: worksList.works});
        }

        getComposer()
            .catch((error) => (console.log(error)));

    }, []);

    return (
        <div className="composer-details">
            <p> Name: {composer.complete_name} </p>
            <p> Era: {composer.epoch} </p>
            <p> Active: {composer.death == null ? "✔️" : "❌"} </p>
            <p> Works: {composer.works?.length} </p>
            <img src={composer.portrait} />
        </div>
    );

}

export default Composer;
import { useState, useEffect } from "react";
import { Link } from "react-router";
import { PieChart, Pie, FunnelChart, Funnel, LabelList, Tooltip } from "recharts";
import "./App.css";

const Display = () => {

  const [composers, setComposers] = useState<any[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [eraSelection, setEraSelection] = useState<string>("");
  const [onlyActive, setOnlyActive] = useState<boolean>(false);
  const [worksWritten, setWorksWritten] = useState<number>(0);

  useEffect(() => {

    const getComposers = async () => {
      const composersRequest = await fetch("https://api.openopus.org/work/dump.json");
      const composersList = await composersRequest.json();
      setComposers(composersList.composers);
    }

    getComposers()
      .catch((error) => (console.log(error)));

  }, []);

  const erasCount = Object.entries(composers.reduce((erasCount, composer) => {
    erasCount[composer.epoch] = (erasCount[composer.epoch]||0) + 1;
    return erasCount;
  }, {})).map(([era, count]) => ({era, count}));

  const activeCount = Object.entries(composers.reduce((activeCount, composer) => {
    activeCount[composer.death == null ? "Active" : "Not Active"] = (activeCount[composer.death == null ? "Active" : "Not Active"]||0) + 1;
    return activeCount;
  }, {})).map(([active, count]) => ({active, count}));

  return (
    <div className="App">
      <div className="search-filters">
        <label htmlFor="search-text"> Search for a Composer: </label>
        <input id="search-text" type="text" placeholder="Search for a Composer" onChange={(e) => (setSearchText(e.target.value))} value={searchText} />
        <br />
        <label htmlFor="era-selection"> Choose an Era: </label>
        <select id="era-selection" onChange={(e) => (setEraSelection(e.target.value))} value={eraSelection}>
          <option value=""> Select an Era </option>
          <option value="Medieval"> Medieval </option>
          <option value="Renaissance"> Renaissance </option>
          <option value="Baroque"> Baroque </option>
          <option value="Early Romantic"> Early Romantic </option>
          <option value="Romantic"> Romantic </option>
          <option value="Late Romantic"> Late Romantic </option>
          <option value="20th Century"> 20th Century </option>
          <option value="Post-War"> Post-War </option>
          <option value="21st Century"> 21st Century </option>
        </select>
        <br />
        <label htmlFor="only-active"> Show only active Composers: </label>
        <input type="checkbox" onChange={(e) => (setOnlyActive(e.target.checked))} checked={onlyActive} />
        <br />
        <label htmlFor="works-written"> Pick the smallest amount of Works written: {worksWritten} </label>
        <input id="works-written" type="range" min="0" max="300" step="25" onChange={(e) => (setWorksWritten(Number(e.target.value)))} value={worksWritten} />
        <p> <i>Since there are {composers.length} composers with {composers.reduce((total, composer) => (total + composer.works.length), 0)} works from {(new Set(composers.map((composer) => (composer.epoch)))).size} eras in our database, just the most popular composers will be shown when no filters are active.</i> </p>
      </div>
      <div className="composers-list">
        {(searchText == "" && eraSelection == "" && onlyActive == false && worksWritten == 0) ?
          composers.map((composer: any) => (
            (composer.popular == "1") ?
              <div className="composer-details" key={composer.name}>
                <p> <b>Name: {composer.complete_name}</b> <Link to={`/composer/${composer.name}`}>📜</Link> </p>
              </div>
            :
              null
          ))
          :
          composers.filter((composer: any) => (composer.complete_name.toLowerCase().includes(searchText.toLowerCase()) == true))
            .filter((composer: any) => (composer.epoch == eraSelection || eraSelection == ""))
            .filter((composer: any) => ((composer.death == null && onlyActive == true) || (composer.death != null && onlyActive == false)))
            .filter((composer: any) => (composer.works.length >= worksWritten))
            .map((composer: any) => (
              <div className="composer-details" key={composer.name}>
                <p> <b>Name: {composer.complete_name}</b> <Link to={`/composer/${composer.name}`}>📜</Link> </p>
              </div>
            ))
        }
      </div>
      <div>
        <PieChart width={600} height={400}>
          <Tooltip />
          <Pie data={erasCount} dataKey="count" nameKey="era" label={({era, count}) => (`${era}: ${count}`)} />
        </PieChart>
        <PieChart width={600} height={400}>
          <Tooltip />
          <Pie data={activeCount} dataKey="count" nameKey="active" label={({active, count}) => (`${active}: ${count}`)} />
        </PieChart>
        <FunnelChart width={600} height={400}>
          <Tooltip />
          <Funnel dataKey="count" data={erasCount} isAnimationActive>
            <LabelList position="right" fill="#000" stroke="none" dataKey="era" />
          </Funnel>
        </FunnelChart>
        <FunnelChart width={600} height={400}>
          <Tooltip />
          <Funnel dataKey="count" data={activeCount} isAnimationActive>
            <LabelList position="right" fill="#000" stroke="none" dataKey="active" />
          </Funnel>
        </FunnelChart>
      </div>
    </div>
  );

};

export default Display;

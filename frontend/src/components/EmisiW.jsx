import { useState } from "react";

const EmisiW = () => {
  const [selectedMap, setSelectedMap] = useState("percapita");

  const maps = {
    percapita: "https://ourworldindata.org/explorers/co2?tab=map&region=Asia&hideControls=true&Gas+or+Warming=CO%E2%82%82&Accounting=Territorial&Fuel+or+Land+Use+Change=Gas&Count=Per+capita&country=~IDN",
    percountry: "https://ourworldindata.org/explorers/co2?tab=map&region=Asia&hideControls=true&Gas+or+Warming=CO%E2%82%82&Accounting=Territorial&Fuel+or+Land+Use+Change=Gas&Count=Per+country&country=~IDN",
    cumulative: "https://ourworldindata.org/explorers/co2?tab=map&region=Asia&hideControls=true&Gas+or+Warming=CO%E2%82%82&Accounting=Territorial&Fuel+or+Land+Use+Change=Gas&Count=Cumulative&country=~IDN"
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between items-center w-full mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Emissions in The World</h2>
        <select
          className="p-2 border rounded-lg"
          value={selectedMap}
          onChange={(e) => setSelectedMap(e.target.value)}
        >
          <option value="percapita">Per Capita</option>
          <option value="percountry">Per Country</option>
          <option value="cumulative">Cumulative</option>
        </select>
      </div>
      <iframe
        src={maps[selectedMap]}
        loading="lazy"
        style={{ width: "100%", height: "600px", border: "none" }}
        allow="web-share; clipboard-write"
      ></iframe>
    </div>
  );
};

export default EmisiW;
import React, { useEffect, useState } from "react";

import image from "../../images/hero/hero-main.png";
import EnhancedTable from "../table/EnhancedTable";
import "./hero.css";
interface HeroProps {
  showNetworkLatency: boolean;
  // toggleNetworkLatency: () => void;
}
interface HeroState {
  apiValue: [];
}
const Hero = (props: HeroProps) => {
  const [apiValue, setApiValue] = useState([]);
  useEffect(() => {
    const values = sessionStorage.getItem("responseTime") || "[]";
    const jso = JSON.parse(values);
    setApiValue(jso);
  }, [props.showNetworkLatency]);

  return (
    <>
      {props.showNetworkLatency ? (
        <div id={"table-full"}>
          <EnhancedTable
            networkapis={apiValue.reverse()}
            tableHeading="API Calls and Performance"
          />
        </div>
      ) : (
        <img
          src={image}
          className="img-fluid full-width"
          alt="The more you read the more you know"
        />
      )}
    </>
  );
};

export default Hero;

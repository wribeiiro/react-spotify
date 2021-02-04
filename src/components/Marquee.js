import React, { Component } from "react";

import "./styles.css";

function Marquee({text}) {
    return (
        <div className="marquee">
            <span>{text}</span>
        </div>
    )
}

export default Marquee
import React from "react";
import ReactDOM from "react-dom";
let age = "23";
let name = "Dmitry";
let output = <span>{name} is {age} years old</span>;
ReactDOM.render(output, document.querySelector("#myDiv"));
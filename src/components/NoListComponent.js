import React from 'react';
import { Link } from "react-router-dom";

const NoMatchRouteComponent = () => (
  <div className="row errorContainer">
    <img className="img-fluid" src="/404.jpg" alt="lost" />
    <h1>404</h1>
    <h2>Not Found</h2>
    <Link to="/" className="btn btn-primary btn-block">
      Go Home
    </Link>
  </div>
);

export default NoMatchRouteComponent;

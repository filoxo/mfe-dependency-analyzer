import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import About from "./about.component.js";

function Home({ name }) {
  return <h2>{name} is mounted!</h2>;
}

function Users() {
  return <h2>Users</h2>;
}

export default function Root(props) {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/users">Users</Link>
      </nav>
      <Switch>
        <Route path="/about">
          <About />
        </Route>
        <Route path="/users">
          <Users />
        </Route>
        <Route path="/">
          <Home name={props.name} />
        </Route>
      </Switch>
    </Router>
  );
}

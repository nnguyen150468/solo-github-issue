import React, { useState } from "react";
import logo from "./github.png";
import {Link, useHistory} from 'react-router-dom'


export default function NavBar(props,...rest) {
    let [searchTerm, setSearchTerm] = useState('');
    let history = useHistory();

    const fetchSearch = async (searchterm) => {
        let res = await fetch(`https://api.github.com/search/repositories?q=${searchterm}&page=1`, {
            method: "GET",
            headers: {
                "Accept": 'application/vnd.github.mercy-preview+json'
            }
        })
        let data = await res.json();
        console.log('search results:',data)
        props.setRepos(data);
        props.setSearchRepoTerm(searchTerm);
        console.log('props.history:',history)
        history.push('/searchResults')
    }


  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <a className="navbar-brand" href="#">
        <img src={logo} alt="logo" />
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item active">
            <Link className="nav-link" to="/">Home <span className="sr-only">(current)</span></Link>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              Link
            </a>
          </li>
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Dropdown
            </a>
            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
              <a className="dropdown-item" href="#">
                Action
              </a>
              <a className="dropdown-item" href="#">
                Another action
              </a>
              <div className="dropdown-divider"></div>
              <a className="dropdown-item" href="#">
                Something else here
              </a>
            </div>
          </li>
          <li className="nav-item">
            <a className="nav-link disabled" href="#">
              Disabled
            </a>
          </li>
        </ul>
        <form
          className="form-inline my-2 my-lg-0"
          onSubmit={e => {
            e.preventDefault();
            fetchSearch(searchTerm);
          }}
        >
          <input
            className="form-control mr-sm-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
            onChange={e => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
          <button
            className="btn btn-outline-success my-2 my-sm-0"
            type="submit"
          >
            Search
          </button>
        </form>
      </div>
    </nav>
  );
}
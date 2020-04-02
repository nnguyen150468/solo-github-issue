import React, {useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Moment from "react-moment";
import Book from "./book.JPG";
import Star from "./star.JPG";
import Circle from "./circle.JPG"
import Pagination from "react-js-pagination";
import {Link} from 'react-router-dom'

const moment = require("moment");

export default function SearchResults(props) {
    let htmlItems = ''
    let [page, setPage] = useState(1)

    const handleSearchPageChange =  async (pageN) => {
        setPage(pageN);
        let res = await fetch(`https://api.github.com/search/repositories?q=${props.searchRepoTerm}&per_page=10&page=${pageN}`, {
        method: "GET",
        headers: {
            "Content-Type": 'application/vnd.github.mercy-preview+json'
        }
    });
        let data = await res.json();
        props.setRepos(data);
}


    if(props.repos){
        htmlItems = props.repos.items.map((item) => {
            return (
              <div key={item.id} className="row border-bottom mt-3">
                <div className="col-lg-12">
                  <Link to={`/repos/${item.full_name}/issues`} className="display-5 text-primary"
                  onClick={() => props.fetchIssues(item.full_name)}>
                    <img src={Book} alt="book" />
                    {item.full_name}
                  </Link>
                  <div>{item.description}</div>
                  <div className="container">
                    <div className="row" style={{ marginBottom: "2%" }}>
                      <div
                        className="col-lg-2"
                        style={{ display: "flex" }}
                      >
                        &#9733;
                        {item.watchers_count}
                      </div>
                      <div
                        className="col-lg-3"
                        style={{ display: "flex" }}
                      >
                        <span style={{color: "#F1E05A"}}>&#9679;</span>
                        {item.language}
                      </div>
                      <div
                        className="col-lg-7"
                        style={{ display: "flex"}}
                      >
                        Update {moment(item.updated_at).fromNow()}
                      </div>
                    </div>
                  </div>
                </div>
        
                <hr />
              </div>
            );
          });
    }
 

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-4">
        <table className="table table-bordered">
            <thead></thead>
            <tbody>
                <tr className="font-weight-bold">
                    <td>Repositories</td>
                </tr>
                <tr>
                    <td>Code</td>
                </tr>
                <tr>
                    <td>Commits</td>
                </tr>
                <tr>
                    <td>Issues</td>
                </tr>
                <tr>
                    <td>Discussions</td>
                </tr>
                <tr>
                    <td>Packages</td>
                </tr>
                <tr>
                    <td>Marketplace</td>
                </tr>
                <tr>
                    <td>Topics</td>
                </tr>
                <tr>
                    <td>Wikis</td>
                </tr>
                <tr>
                    <td>Users</td>
                </tr>
            </tbody>
        </table>
        </div>

        <div className="col-8">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
            <h1 className="h2"></h1>
            <div className="btn-toolbar mb-2 mb-md-0">
              <button className="btn btn-sm btn-outline-secondary dropdown-toggle">
                <span data-feather="calendar"></span>
                Best match
              </button>
            </div>
          </div>
          {htmlItems}
          <div className="d-flex justify-content-center mt-3">
            <Pagination
              activePage={page}
              itemsCountPerPage={10}
              totalItemsCount={props.repos.total_count}
              pageRangeDisplayed={5}
              itemClass="page-item"
              linkClass="page-link"
              onChange={e => handleSearchPageChange(e)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

import React, {useState, useEffect} from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, Button } from "react-bootstrap/";
import moment from "moment";
import Badge from 'react-bootstrap/Badge'
import Pagination from "react-js-pagination";
import {Link} from 'react-router-dom'
import NewIssueButton from '../components/NewIssueButton'

export default function IssuesPage(props) {
    const [issues, setIssues] = useState(null);
    const [singleRepo, setSingleRepo] = useState(null);
    let [page, setPage] = useState(1);
    let fullName = props.fullName;
    let nameSplit = props.fullName.split("/");
    let owner = nameSplit[0];
    let repo = nameSplit[1];

    const handlePageChange =  async (pageN) => {
        setPage(pageN);
        let res = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues?page=${pageN}`, {
        method: "GET",
        headers: {
            "Content-Type": 'application/vnd.github.mercy-preview+json'
        }
    });
        let data = await res.json();
        props.setIssues(data);
        console.log(`issues page ${pageN}:`,data)
}

    const fetchIssues = async () => {
        let url = `https://api.github.com/repos/${fullName}/issues`;
        let res = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": 'application/vnd.github.mercy-preview+json'
        }
        });
        let data = await res.json();
        console.log('issues:',data);
        setIssues(data);

        let urlRepo = `https://api.github.com/repos/${fullName}`;
        let resRepo = await fetch(urlRepo, {
        method: "GET",
        headers: {
            "Content-Type": 'application/vnd.github.mercy-preview+json'
        }
    });
        let dataRepo = await resRepo.json();
        console.log('single Repo:',dataRepo);
        setSingleRepo(dataRepo);
  }

    useEffect(()=> {
        fetchIssues();
    }, [])

    const renderIssues = () => {
            return issues.map(issue => {
                return (
                    <tr key={issue.id}>
                        <td className="d-flex justify-content-between">
                            <div className="col-md-8 d-flex flex-column justify-content-between">
                                <h5><Link to={`/repos/${owner}/${repo}/issues/${issue.number}`} style={{color:"black"}}>{issue.title}</Link> 
                                    {issue.labels.map(label => 
                                    <Badge className="m-1" key={label.id} style={{backgroundColor: `#${label.color}`}}>{label.name}</Badge>)}</h5>
                                <footer className="text-muted">#{issue.number} opened {moment(issue.updated_at).fromNow()} by {issue.user.login} </footer>
                            </div>
                            <div>
                                <img style={{width:100, borderRadius:100}} 
                                src={issue.user.avatar_url} />
                            </div>
                        </td>
                    </tr>
                )
            })
        }

        return (!issues || !singleRepo)? <div>Loading issues...</div> : (
            <div> 
                <div id="grad" className="jumbotron jumbotron-fluid">
                    <div className="container text-center">
                        <h3>Learn Git and Github without any code!</h3>
                         <p className="lead">
                        Using the Hello World guide, you'll start a branch, write comments,
                        and open a pull request.
                        </p>
                        <a href="https://guides.github.com/activities/hello-world/">
                            <Button variant="success">Read the guide </Button>
                        </a>
                    </div>
                </div>
                <div className="container px-5">
                    <Card className="p3 mb-3">
                        <Card.Body
                            
                            className="text-center"
                        >
                            <h5 style={{ fontWeight: "bold" }}>
                            {" "}
                            👋Want to contribute to {singleRepo.full_name}?
                            </h5>
                            <p>
                            If you have a bug or an idea, read the contributing guidelines
                            before opening an issue.<br></br>
                            If you're ready to tackle some open issues, we've collected some
                            good first issues for you.
                            </p>
                        </Card.Body>
                    </Card>
                <div className="left">
                    <h5>View Issues From {singleRepo.full_name}</h5>
              <h6>{singleRepo.description}</h6>
                    <div className="right">
                </div>
                 </div>
                 <table className="table table-bordered table-hover">
                     <thead style={{backgroundColor: "#F6F8FA"}}>
                        <tr>
                            <td className="d-flex justify-content-between">
                                <h5 className="align-self-center">{singleRepo.open_issues_count} Open </h5> <NewIssueButton owner={owner} repo={repo}/></td>
                        </tr>
                     </thead>
                     <tbody>
                     {renderIssues()}
                     </tbody>
                 </table>
                 <div className="d-flex justify-content-center">
                 <Pagination
                    activePage={page}
                    itemsCountPerPage={10}
                    totalItemsCount={singleRepo.open_issues}
                    pageRangeDisplayed={5}
                    itemClass="page-item"
                    linkClass="page-link"
                    onChange={(e)=>handlePageChange(e)}
                    /></div>
            </div>
            </div>
        )
}

import React, {useState, useEffect} from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import Card from "react-bootstrap/Card";
import Moment from "react-moment";
import moment from 'moment';
import Button from 'react-bootstrap/Button';
import {useParams} from 'react-router-dom';
import Comments from '../components/Comments'
import NewIssueButton from '../components/NewIssueButton'

const ReactMarkdown = require('react-markdown')


export default function SingleIssuePage(props) {
    let {owner, repo, issueNum} = useParams();
    const [singleIssue, setSingleIssue] = useState(null)

    const fetchSingleIssue = async () => {
        let res = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues/${issueNum}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/vnd.github.mercy-preview+json"
        }
    });
        let data = await res.json();
        setSingleIssue(data);
        console.log(`single issue:`, data)
        console.log('singleIssue.user.login', data.user.login)
        console.log('singleIssue',singleIssue)
    }

    useEffect(()=>{
        fetchSingleIssue();
        console.log(owner, repo, issueNum)
        
    }, [])

    const renderSingleIssue = () => {
        return (!singleIssue? <div>Loading</div> : (
            <div className="row">
                <div className="col-md-2 text-center">
                    <img src={singleIssue.user.avatar_url} style={{width: 100}} />
                </div>
                <Card className="col-md-10" key={singleIssue.id}>
                <Card.Header>
                    {singleIssue.user.login} commented {moment(singleIssue.created_at).fromNow()}
                </Card.Header>
                <Card.Body>
                    <ReactMarkdown
                    source={singleIssue.body}
                    escapeHtml={false} />
                </Card.Body>
            </Card>
            </div>
        ))
    }

    return (!singleIssue? <div>Loading</div> :  (
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
                <div className="row">
                <div className="col-10">
                <h3>{singleIssue.title} <span className="text-muted">#{singleIssue.number}</span></h3>
                </div>
                <div className="col-2"><NewIssueButton owner={owner} repo={repo} /></div>
                </div>
                <div className="row">
                    <div className="col-10 mb-5"><span className="font-weight-bold">{singleIssue.user.login}</span> opened this issue {moment(singleIssue.created_at).fromNow()}</div>
                </div>
                {renderSingleIssue()}
                {singleIssue.comments?  (<div><Comments owner={owner} repo={repo} issueNum={issueNum}/></div>) : <div>No comments</div> }
             </div>
        </div>
    ))
}

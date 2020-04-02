import React, {useState} from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import {useHistory, useParams} from 'react-router-dom'

export default function NewIssuePage(props) {
    let {owner, repo} = useParams();
    let history = useHistory();
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

    const postNewIssue = async (e) => {
        e.preventDefault();
        console.log('newIssuePage',owner,repo)
        let url = `https://api.github.com/repos/${owner}/${repo}/issues`;
        let issue = {title: title, body: body};
        let res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/vnd.github.mercy-preview+json",
                "Authorization": `token ${props.token}`
            },
            body: JSON.stringify(issue)
        });
        let data = await res.json();
        console.log('new issue posted:',data)

        const fullname = `/${owner}/${repo}`
        let issueUrl = `https://api.github.com/repos/${fullname}/issues`;
        let issueRes = await fetch(issueUrl, {
          method: "GET",
          headers: {
            "Content-Type": 'application/vnd.github.mercy-preview+json'
        }
        });
        let issueData = await issueRes.json();
        console.log('issues:',issueData);
        props.setIssues(issueData);
    
        let urlRepo = `https://api.github.com/repos/${fullname}`;
        let resRepo = await fetch(urlRepo, {
          method: "GET",
          headers: {
            "Content-Type": 'application/vnd.github.mercy-preview+json'
        }
      });
        let dataRepo = await resRepo.json();
        console.log('single Repo:',dataRepo);
        props.setSingleRepo(dataRepo);

        // props.setIssues(data);
        console.log('history',history);
        history.push(`/repos/${owner}/${repo}/issues`)
    }

    return (
        <Form onSubmit={postNewIssue} className="container p-5">
        <Form.Group controlId="formBasicEmail">
          <Form.Label>New Issue Title</Form.Label>
          <Form.Control type="input" onChange={e=>setTitle(e.target.value)} placeholder="Enter title" />
          <Form.Text className="text-muted">
            Required
          </Form.Text>
        </Form.Group>
        <Form.Group>
        <Form.Label>Content</Form.Label>
        <Form.Control as="textarea" onChange={e=>setBody(e.target.value)} placeholder="Describe your issue" />
          <Form.Text className="text-muted">
            Required
          </Form.Text>
        </Form.Group>
        <Button variant="success" type="submit">
          Submit
        </Button>
      </Form>
    )
}

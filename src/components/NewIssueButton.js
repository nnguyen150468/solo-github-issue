import React from 'react'
import Button from 'react-bootstrap/Button';
import {Link} from 'react-router-dom'

export default function NewIssueButton(props) {
    return (
        <Link to={`/repos/${props.owner}/${props.repo}/issues/new`}>
            <Button variant="success">New issue</Button>
            </Link>
        
    )
}

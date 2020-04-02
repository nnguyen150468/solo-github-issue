import React, {useState, useEffect} from 'react'
import Card from "react-bootstrap/Card";
import moment from 'moment';
const ReactMarkdown = require('react-markdown')



export default function Comments(props) {
    const [comments, setComments] = useState(null)

    const fetchComments = async () => {
        let res = await fetch(`https://api.github.com/repos/${props.owner}/${props.repo}/issues/${props.issueNum}/comments`, {
            method: "GET",
            headers: {
                "Content-Type": "application/vnd.github.mercy-preview+json"
            }
        });
        let data = await res.json();
        console.log('comments:',data);
        setComments(data);
    }

    useEffect(()=> {
        fetchComments();
    }, [])

    return (!comments? <div>There are no comments</div> : comments.map(comment => (
        <div key={comment.id} className="row">
        <div className="col-md-2 text-center">
            <img src={comment.user.avatar_url} style={{width: 100}} />
        </div>
            <Card className="col-md-10" >
                <Card.Header>
                    {comment.user.login} commented {moment(comment.created_at).fromNow()}
                </Card.Header>
                <Card.Body>
                    <ReactMarkdown
                    source={comment.body}
                    escapeHtml={false} />
                </Card.Body>
            </Card>
               
        </div>
    )))
}

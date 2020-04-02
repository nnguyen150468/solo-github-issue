import React, {useState, useEffect} from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import HomePage from './pages/HomePage'
import SearchResults from './pages/SearchResults'
import IssuesPage from './pages/IssuesPage'
import SingleIssuePage from './pages/SingleIssuePage'
import NewIssuePage from './pages/NewIssuePage'
import {Route, Switch, Link} from 'react-router-dom'
import Navbar from './components/Navbar'


const clientID = process.env.REACT_APP_CLIENT_ID;

function App() {
  const [token, setToken] = useState('');
  const [repos, setRepos] = useState({});
  const [singleRepo, setSingleRepo] = useState({})
  const [searchRepoTerm, setSearchRepoTerm] = useState('');
  const [fullName, setFullName] = useState('');
  const [issues, setIssues] = useState(null);
  const [issueNum, setIssueNum] = useState('');
  const [singleIssue, setSingleIssue] = useState({});

  const getToken = () => {
    const existingToken = sessionStorage.getItem('token');
    const accessToken = (window.location.search.split("=")[0] === "?access_token") ? window.location.search.split("=")[1] : null;
    
    if (!accessToken && !existingToken) {
      window.location.replace(`https://github.com/login/oauth/authorize?scope=user:email,repo&client_id=${clientID}`)
    }
  
    if (accessToken) {
      if(accessToken.includes("&scope")){
        let cleanToken = accessToken.split("&")[0];
        sessionStorage.setItem("token", cleanToken);
        setToken(cleanToken);  
      }
    }
  
    if (existingToken) {
      setToken(existingToken);
    }
  }
  
  useEffect(() => {
    getToken();
  }, [])

  const fetchIssues = async (fullname) => {
    setFullName(fullname);
    let url = `https://api.github.com/repos/${fullname}/issues`;
    let res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": 'application/vnd.github.mercy-preview+json'
    }
    });
    let data = await res.json();
    console.log('issues:',data);
    setIssues(data);

    let urlRepo = `https://api.github.com/repos/${fullname}`;
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


  return (
    <div>  
     <Navbar setRepos={setRepos} repos={repos} setSearchRepoTerm={setSearchRepoTerm} token={token}/>
     <Switch>
      <Route path={`/`} exact component={HomePage} />
      <Route path="/searchResults" render={(props)=><SearchResults {...props} searchRepoTerm={searchRepoTerm} repos={repos} setRepos={setRepos} fetchIssues={fetchIssues}/>}/>
      <Route path={`/repos/:owner/:repo/issues`} exact render={(props)=><IssuesPage {...props} issues={issues} setIssues={setIssues} singleRepo={singleRepo} fullName={fullName} setIssueNum={setIssueNum} setSingleIssue={setSingleIssue}  />}/>
      <Route path="/repos/:owner/:repo/issues/new" exact render={(props)=><NewIssuePage {...props} token={token} setIssues={setIssues} setSingleRepo={setSingleRepo}   />}/>
      <Route path="/repos/:owner/:repo/issues/:issueNum" exact render={(props)=><SingleIssuePage {...props} token={token} setIssues={setIssues}  />}/>
     </Switch>
    </div>
  );
}

export default App;

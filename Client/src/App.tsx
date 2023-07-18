/*@once*/
import { Component, onMount, useContext } from 'solid-js';
import { createSignal } from "solid-js";
import { Routes, Route } from "@solidjs/router"
import logo from './logo.svg';
import styles from './App.module.css';
import Home from './pages/Home';
import About from './pages/About';
import MainLayout from './layout/MainLayout'
import Error from './pages/Error';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import ListProblems from './pages/ListProblems';
import Problem from './pages/Problem';
import FAQ from './pages/FAQ';
import Translation from './pages/Translation';
import Vote from './pages/Vote';
import Activity from './pages/Activity';
import { DisplayMessageContext, DisplayMessageProvider, DisplayMessageProviderType } from './hooks/createDisplayMessage';
import DisplayMessage from './components/DisplayMessage';
import Leaderboard from './pages/Leaderboard';
import SignUp from './pages/SignUp';
import StockToken from './pages/stockToken';
import ValidateEmail from './pages/ValidateEmail';
import Stats from './pages/Stats';
import MetaTags from './components/MetaTags';
import Status from './pages/Status';
import ContributeMenu from './pages/ContributeMenu';
import Contribution from './pages/Contribution';
import CreateContribution from './pages/CreateContribution';

console.log("test")

const App: Component = () => {
  return (
    <div class={styles.App}>
      <MetaTags
        title="WeekGolf"
        description='WeekGolf is a website about code golf'
      />
      <DisplayMessageProvider>
        <DisplayMessage/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/home" element={<Home/>}/>
          <Route path="/stockToken" element={<StockToken />}/>
          <Route path="/" element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/about" element={<About />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/problems" element={<ListProblems />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/translate" element={<Translation />} />
            <Route path="/vote" element={<Vote />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/problem" element={<Problem />} />
            <Route path="/statistics" element={<Stats />} />
            <Route path="/status" element={<Status />} />
            <Route path="/contribute-menu" element={<ContributeMenu />} />
            <Route path="/contribution" element={<Contribution />} />
            <Route path="/create-contribution" element={<CreateContribution editContribution={false}/>} />
            <Route path="/edit-contribution" element={<CreateContribution editContribution={true}/>} />
            <Route path="/*" element={<Error />} />
          </Route>
          <Route path="/sign-up" element={localStorage.getItem('token') !== null && localStorage.getItem('token') !== undefined ? <MainLayout children={<ListProblems/>}/> : <SignUp /> } />
          <Route path="/login" element={localStorage.getItem('token') !== null && localStorage.getItem('token') !== undefined ? <MainLayout children={<ListProblems/>}/> : <SignUp login={true}/> } />
          <Route path="/validate-email" element={localStorage.getItem('token') !== null && localStorage.getItem('token') !== undefined ? <MainLayout children={<ListProblems/>}/> : <ValidateEmail /> } />
        </Routes>
      </DisplayMessageProvider>
    </div>
  );
};

export default App;

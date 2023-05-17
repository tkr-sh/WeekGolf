// Imports
//// Express config
import { Router, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import session from "express-session";
//// DB congif
import pool from '../../../config/initDB';
//// Middleware
import { verifyToken } from '../middleware/verifyToken';
import { authObligatory } from '../middleware/authObligatory';
//// Routes
import passport from './auth';
import { getLangs, getPersonnalUpvotes, getPhase, getStatus, submitLanguage, voteLanguage } from './lang';
import { getLastProblem, getPersonalNote, getProblem, getProblems, getPublicNoteProblem, noteProblem, updateRank } from './problems';
import { getCodeStats, getHistory, getPreviousSolution, getSolution, getSolutions, submitSolution } from './solutions';
import { createAccountRequest, getActivity, getCommentsOfUser, getId, getName, getPerformances, getPfp, getProfile, getUsers, login, updateInfo, verifyCode } from './user';
import { getLeaderboard, getLeaderboardProblem } from './leaderboard';
import { getPersonnalUpvotesComments, postComment, voteComment, getComments } from './comment';
import { discordCallback, githubCallback, stackCallback } from './authCallBack';
import { getFriends, getRelation, updateRelation } from './friend';
import { uplaodImage } from './img';
import { updateDiscordDisplay, getDiscordInfo, initLinkDiscordAccount, linkDiscordAccount } from './discord';
import dotenv from 'dotenv';
import { meanLanguages, topLanguages, weekInfo } from './bot';

// Configure the .env
dotenv.config()



console.log(process.env)
console.log(process.env.SESSION_KEY)


// Set up session middleware for discord link
const sessionMiddleware = session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
});

// Set up Multer to handle file uploads
const upload = multer({ dest: 'uploads/' });


/**
 * Defining the rate limits
 */
// Every hour
const rate1h8req = rateLimit({windowMs: 60 * 60 * 1000, max: 8}); // Maximum 8 requests every hour
const rate1h256req = rateLimit({windowMs: 60 * 60 * 1000, max: 256}); // Maximum 256 requests every hour
const rate1h512req = rateLimit({windowMs: 60 * 60 * 1000, max: 512}); // Maximum 512 requests every hour
const rate1h1024req = rateLimit({windowMs: 60 * 60 * 1000, max: 1024}); // Maximum 1024 requests every hour
// Every 10 minutes
const rate10m64req = rateLimit({windowMs: 10 * 60 * 1000, max: 64}); // Maximum 64 requests every 10 minutes
const rate10m128req = rateLimit({windowMs: 10 * 60 * 1000, max: 128}); // Maximum 128 requests every 10 minutes
const rate10m256req = rateLimit({windowMs: 10 * 60 * 1000, max: 256}); // Maximum 256 requests every 10 minutes
const rate10m512req = rateLimit({windowMs: 10 * 60 * 1000, max: 512}); // Maximum 512 requests every 10 minutes
// Every minute
const rate1m64req = rateLimit({windowMs: 60 * 1000, max: 64}); // Maximum 64 requests every minute
const rate1m32req = rateLimit({windowMs: 60 * 1000, max: 32}); // Maximum 32 requests every minute
const rate1m16req = rateLimit({windowMs: 60 * 1000, max: 16}); // Maximum 16 requests every minute
const rate1m8req = rateLimit({windowMs: 60 * 1000, max: 8}); // Maximum 8 requests every minute
const rate1m4req = rateLimit({windowMs: 60 * 1000, max: 4}); // Maximum 4 requests every minute
const rate1m2req = rateLimit({windowMs: 60 * 1000, max: 2}); // Maximum 2 requests every minute


// Define the router
const router = Router();


// Authentification
//// GitHub
router.get("/auth/github", passport.authenticate("github", { scope: ["profile", "email"] }));
router.get("/auth/github/callback",
    passport.authenticate("github", {
        session: false,
        failureRedirect: "http://localhost:3000/",
	}),
	githubCallback
);

//// Discord
router.get("/auth/discord", passport.authenticate("discord", { scope: ["profile", "email"] }));
router.get("/auth/discord/callback",
    passport.authenticate("discord", {
        session: false,
        failureRedirect: "https://localhost:3000/",
    }),
    discordCallback
);


////// Linking discord account with WeekGolf account
router.get("/auth/discord-init-link", sessionMiddleware, initLinkDiscordAccount);
router.get("/auth/discord-link", sessionMiddleware, linkDiscordAccount);


//// Stack
router.get("/auth/stack", passport.authenticate("stack-exchange"));
router.get("/auth/stack/callback",
    passport.authenticate("stack-exchange", {
        session: false,
        failureRedirect: "https://localhost:3000/",
    }),
    stackCallback
);









// API
router.use('/api/v1/*', verifyToken);


// Leaderboard
router.get("/api/v1/leaderboard", rate1m64req, getLeaderboard)
router.get("/api/v1/leaderboard-problem", rate1m64req, getLeaderboardProblem)
// Comment
router.get("/api/v1/comments-user", rate1m64req, getCommentsOfUser);
router.get("/api/v1/problem-comments", rate1m64req, getComments);
router.get("/api/v1/upvoted-comments", authObligatory, rate1m64req, getPersonnalUpvotesComments);
router.post("/api/v1/vote-comment", authObligatory, rate1m64req, voteComment);
router.post("/api/v1/comment", authObligatory, rate1m8req, postComment);
// Solution
router.get('/api/v1/history', rate1m32req, getHistory);
router.get('/api/v1/solution', rate1m64req, rate10m512req, rate1h1024req, getSolution);
router.get('/api/v1/code-stats', rate1m64req, rate10m512req, rate1h1024req, getCodeStats);
router.get('/api/v1/solutions', rate1m64req, rate10m128req, rate1h512req, getSolutions);
router.post('/api/v1/submit-solution', authObligatory, rate1m8req, rate10m64req, rate1h256req, submitSolution);
router.get('/api/v1/previous-solution', authObligatory, rate1m8req, rate10m64req, rate1h256req, getPreviousSolution);
// Problem
router.get('/api/v1/last-problem', rate1m64req, getLastProblem);
router.get('/api/v1/problems', rate1m8req, getProblems);
router.get('/api/v1/problem', rate1m32req, getProblem);
router.post('/api/v1/note', authObligatory, rate1m16req, noteProblem);
router.get('/api/v1/note', rate1m32req, getPublicNoteProblem);
router.get('/api/v1/personal-note', authObligatory, rate1m32req, getPersonalNote);
// Lang
router.get('/api/v1/languages', rate1m16req, getLangs);
router.get('/api/v1/phase', rate1m16req, getPhase);
router.post('/api/v1/submit-language', authObligatory, rate1m16req, submitLanguage);
router.post('/api/v1/vote-language', authObligatory, rate1m64req, rate10m256req, rate1h1024req, voteLanguage);
router.get('/api/v1/personnal-upvotes', rate1m16req, getPersonnalUpvotes);
router.get('/api/v1/status', rate1m8req, getStatus);
// User
router.get('/api/v1/pfp', rate1m64req, getPfp);
router.post('/api/v1/login', rate1m8req, rate10m64req, login);
router.get('/api/v1/activity', rate1m64req, rate10m512req, getActivity);
router.get('/api/v1/id', rate1m32req, getId);
router.get('/api/v1/comments', rate1m64req, rate10m512req, getCommentsOfUser);
router.get('/api/v1/name', rate1m32req, getName);
router.get('/api/v1/profile', rate1m32req, rate10m256req, rate1h1024req, getProfile);
router.get('/api/v1/performances', rate1m64req, rate10m512req, getPerformances);
router.post('/api/v1/code', rate1m4req, verifyCode);
router.post('/api/v1/create-account', rate1m4req, createAccountRequest);
router.post('/api/v1/info', authObligatory,  rate1m16req, updateInfo);
router.get('/api/v1/users', rate1m8req, getUsers);
// Discord
router.get('/api/v1/discord', authObligatory,  rate1m16req, getDiscordInfo);
router.put('/api/v1/discord-display', authObligatory,  rate1m16req, updateDiscordDisplay);
// Bot discord
router.get('/api/v1/week-info', rate1m16req, weekInfo);
router.get('/api/v1/mean-languages', rate1m16req, meanLanguages);
router.get('/api/v1/top-languages', rate1m16req, topLanguages);
// Friend
router.get('/api/v1/relation', authObligatory, rate1m32req, rate1h1024req, getRelation)
router.put('/api/v1/relation', authObligatory, rate1m16req, rate1h256req, updateRelation);
router.get('/api/v1/friends', rate1m16req, rate1h256req, getFriends);
// Extra
router.post('/api/v1/upload-image', authObligatory, upload.single('image'), rate1m4req, rate1h8req, uplaodImage);



export default router;

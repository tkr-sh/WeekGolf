import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as DiscordStrategy } from 'passport-discord';
import { Strategy as StackExchangeStrategy } from 'passport-stack-exchange';
// import { OAuth2Strategy } from 'passport-oauth';
import passport from 'passport';
import * as dotenv from 'dotenv';
dotenv.config();


const CALLBACK_URL = "http://localhost:5000/auth/"

console.log(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_CLIENT_SECRET)
console.log(process.env)



/**
 * Github Strategy
 */
passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        // callbackURL: CALLBACK_URL + "github/callback", // Callback URL
        callbackURL: CALLBACK_URL + "github/callback", // Callback URL
        passReqToCallback: true, // Add the Req to the callback function
        session: false, // Don't enable Session
    },
    (req, accessToken, refreshToken, profile, done) => {
        req.githubId = profile.id;
        console.log(profile)
        console.log(profile.id)
        done(null, profile);
    }
));



/**
 * Discord Strategy
 * 
 */
const scopes = ['identify', 'email'];
passport.use(new DiscordStrategy({
        clientID: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
        callbackURL: CALLBACK_URL + "discord/callback",
        scope: scopes,
        passReqToCallback: true, // Add this line
        session: false, // Don't enable Session
    },
    (req, accessToken, refreshToken, profile, done) => {
        req.discordId = profile.id;
        console.log(profile)
        console.log(profile.id)
        done(null, profile);
    }
));




passport.use(new StackExchangeStrategy({
        clientID: process.env.STACK_CLIENT_ID,
        clientSecret: process.env.STACK_CLIENT_SECRET,
        callbackURL: CALLBACK_URL + "stack/callback",
        stackAppsKey: process.env.STACK_APPS_KEY,
        site: 'stackoverflow',
        passReqToCallback: true, // Add this line
        session: false, // Don't enable Session
    },
    (req, accessToken, refreshToken, profile, done) => {
        req.stackId = profile.id;
        done(null, profile);
    }
));
// */

// // passport.serializeUser((user, done) => {
//     done(null, user.googleId || user.id);
// });


// passport.deserializeUser((googleId, done) => {
//     database.findOne({ googleId : googleId }, (err, user) => {
//         done(null, user);
//     });
// });




export default passport;
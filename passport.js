const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const GithubStrategy = require("passport-github2").Strategy;
// const FacebookStrategy = require("passport-facebook").Strategy;
const passport = require("passport");
const User = require('./models/user-model');

const GOOGLE_CLIENT_ID =process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

GITHUB_CLIENT_ID = "your id";
GITHUB_CLIENT_SECRET = "your id";

FACEBOOK_APP_ID = "your id";
FACEBOOK_APP_SECRET = "your id";
// passport.serializeUser((user, done) => {
//     done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//     User.findById(id).then((user) => {
//         done(null, user);
//     });
// });

passport.use(
  new GoogleStrategy(
    {
      clientID: "1026657935833-6lfk0uq729onkat0c4ksp92ok2e7f7ho.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "/auth/google/callback",
    },
   (accessToken, refreshToken, profile, done) => {
        // check if user already exists in our own db
        console.log(profile);
        console.log("Abid Ahmed");
        User.findOne({googleId: profile.id}).then((currentUser) => {
            if(currentUser){
                // already have this user
               // console.log('user is: ', currentUser);
                done(null, currentUser);
            } else {
                // if not, create user in our db
                new User({
                    googleId: profile.id,
                    displayName: profile.displayName,
                    thumbnail: profile.photos[0].value.toString(),
                    chatApi:0,
                    plandId:"none",
                }).save().then((newUser) => {
                    console.log('created new user: ', newUser);
                    done(null, newUser);
                });
            }
        });
    })
);

// passport.use(
//   new GithubStrategy(
//     {
//       clientID: GITHUB_CLIENT_ID,
//       clientSecret: GITHUB_CLIENT_SECRET,
//       callbackURL: "/auth/github/callback",
//     },
//     function (accessToken, refreshToken, profile, done) {
//       done(null, profile);
//     }
//   )
// );

// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: FACEBOOK_APP_ID,
//       clientSecret: FACEBOOK_APP_SECRET,
//       callbackURL: "/auth/facebook/callback",
//     },
//     function (accessToken, refreshToken, profile, done) {
//       done(null, profile);
//     }
//   )
// );

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
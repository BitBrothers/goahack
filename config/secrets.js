/**
* IMPORTANT * IMPORTANT * IMPORTANT * IMPORTANT * IMPORTANT * IMPORTANT *
*
* NEVER COMMIT THIS FILE
*
* If you have already commited this file to GitHub with your keys, then
* refer to https://help.github.com/articles/remove-sensitive-data
*/

module.exports = {

 db: process.env.MONGODB|| 'mongodb://warren:warren123@kahana.mongohq.com:10072/test_test',

 sessionSecret: process.env.SESSION_SECRET || 'CodejediGameStarts',

 mailgun: {
   user: process.env.MAILGUN_USER || 'postmaster@sandbox697fcddc09814c6b83718b9fd5d4e5dc.mailgun.org',
   password: process.env.MAILGUN_PASSWORD || '29eldds1uri6'
 },
 
 mandrill: {
   user: process.env.MANDRILL_USER || 'codejedi',
   password: process.env.MANDRILL_PASSWORD || 'E1K950_ydLR4mHw12a0ldA'
 },

 sendgrid: {
   user: process.env.SENDGRID_USER || 'hslogin',
   password: process.env.SENDGRID_PASSWORD || 'hspassword00'
 },

 
 github: {
   clientID: process.env.GITHUB_ID || '44870aefc5ea45ef10cf',
   clientSecret: process.env.GITHUB_SECRET || '558eaf87781d159be0375388df7fd364835e2859',
   callbackURL: '/auth/github/callback',
   passReqToCallback: true
 },

 twilio: {
   sid: process.env.TWILIO_SID || 'AC6f0edc4c47becc6d0a952536fc9a6025',
   token: process.env.TWILIO_TOKEN || 'a67170ff7afa2df3f4c7d97cd240d0f3'
 },

 clockwork: {
   apiKey: process.env.CLOCKWORK_KEY || '9ffb267f88df55762f74ba2f517a66dc8bedac5a'
 },

 stripe: {
   apiKey: process.env.STRIPE_KEY || 'sk_test_BQokikJOvBiI2HlWgH4olfQ2'
 },

 venmo: {
   clientId: process.env.VENMO_ID || '1688',
   clientSecret: process.env.VENMO_SECRET || 'uQXtNBa6KVphDLAEx8suEush3scX8grs',
   redirectUrl: process.env.VENMO_REDIRECT_URL || 'http://localhost:3000/auth/venmo/callback'
 },
   amazon: {
   accessKeyId: "AKIAIWHGTAKSSBVVQPUQ", 
   secretAccessKey: "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", 
   region: "us-east-1"
   }
};
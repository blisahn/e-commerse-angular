export default {
    // this is an our json object that represents out Open Id Client account, we 
    // also use these informations to have control on Okta Integration

    oidc: {
        clientId: '<Okta Id>',// public identifier of the client app
        issuer: '<Okta Issuer>',// lets you do authorizing process
        redirectUri: 'https://localhost:4200/login/callback',// redirect you after you login
        scopes: ['openid', 'profile', 'email'] // OpenId Connect (OIDC) scpopes provide access to 
        // information about user such as name, phone, email etc,
        // Set of attributes known as "claims ".
    }

    // we have to install Okta SDK to for 
    // Okta Sign-In Widget(JavaScript library for application login),
    // we have to add this to angular.json file's styles: [] array

    /**
     * npm install @okta/okta-signin-widget@6.2.0
     * npm install @okta/okta-angular@5.2.0
     * npm install @okta/okta-auth-js@6.4.0
     */

}

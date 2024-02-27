import { Component, Inject, OnInit } from '@angular/core';

import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
// we have to crete okta-signin-widget.d.ts to export this file
import OktaSignIn from '@okta/okta-signin-widget';

// config info to connect apis
import myAppConfig from '../../config/my-app-config';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  oktaSignin: any;

  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) {

    //  new widget and it's configuration;
    this.oktaSignin = new OktaSignIn({
      logo: 'assets/images/logo.png',
      baseUrl: myAppConfig.oidc.issuer.split('/oauth2')[0],
      clientId: myAppConfig.oidc.clientId,
      redirectUri: myAppConfig.oidc.redirectUri,
      authParams: {
        pkce: true, // Proof Key for Code Exchange (*)
        issuer: myAppConfig.oidc.issuer,
        scopes: myAppConfig.oidc.scopes
      }
    });
  }
  // PKCE is recommended approcah for controlling 
  // access between app and auth server
  // Protects against Authorization Code Interception Attacks

  ngOnInit(): void { 
    // remove previous elements that user passed to form
    this.oktaSignin.remove();

    // render element for give element id (#...)
    this.oktaSignin.renderEl(
      { el: '#okta-sign-in-widget' }, // should be the same with div tag because it will render it
      (response: any) => {
        if (response.status === 'SUCCESS') {
          // it will redirect you to a main page because of redirectUri from your myAppConfig
          this.oktaAuth.signInWithRedirect();
        }
      },
      (error: any) => {
        // throw error if its occur
        throw error;
      }
    );
  }




}

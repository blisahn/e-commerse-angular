import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';
import { environment } from 'src/environments/environment';
/** we are 
 * creating a service for pupular our <option> fields in checkoutcomponent.html
 */
@Injectable({
  providedIn: 'root'
})
export class Luv2ShopFormService {
  /**
   * we are declarin our fileds to have control on our countries and states
   * - for populating our component.html file with real data
   */

  private countriesUrl = environment.luv2ShopApiUrl + '/countries';
  private statesUrl = environment.luv2ShopApiUrl + '/states';

  // and also we are @Injectin httpCLient to have a acces on our API
  constructor(private httpClient: HttpClient) { }


  // this array should return an Observable <Number[]>
  getCreditCardMonths(startMonth: number): Observable<number[]> {
    let data: number[] = [];

    // build an array for "Month" dropdown list
    // start at desired startMonth and loop until 12

    for (let theMonth = startMonth; theMonth <= 12; theMonth++) {
      data.push(theMonth);
    }
    // operator turns array to an observable
    // we are using observable array because our components will subscribe(); to this data 
    return of(data);
  }

  getCreditCardYears(): Observable<number[]> {
    let data: number[] = [];

    /**
     * build and array for "Year" dropdown list
     * start at current year and loop for next 10
     */

    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;

    for (let theYear = startYear; theYear <= endYear; theYear++) {
      data.push(theYear);
    }

    return of(data);
  }


  // creating a method for retreive countries from rest api
  getCountries(): Observable<Country[]> {

    // get the data from JSON
    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    );
  }

  // creatint a method for retreive states from rest api
  getStates(theCountryCode: string): Observable<State[]> {
    // search url
    const searchStatesUrl = `${this.statesUrl}/search/findByCountryCode?code=${theCountryCode}`;
    // get the data from JSON
    return this.httpClient.get<GetResponseStates>(searchStatesUrl).pipe(
      map(response => response._embedded.states)
    );
  }
}
interface GetResponseCountries {
  _embedded: {
    countries: Country[];
  }
}
interface GetResponseStates {
  _embedded: {
    states: State[];
  }
}

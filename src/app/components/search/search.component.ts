import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
// we have to inject the router because we are doing our navigation via router (see app.module.ts)
  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  // and we are adding the method from the search-component.html
  doSearch(value:string){
    // and here is your debug statement
    console.log(`value=${value}`);
    // this code lets us the send data to the Produt-Component.ts because we set this path to land the data that passed to the 
    // product component(see app module)
    this.router.navigateByUrl(`/search/${encodeURIComponent(value)}`); 
    
  }
}

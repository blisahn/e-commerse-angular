import { Component, OnInit } from '@angular/core';
import { ProductCategory } from 'src/app/common/product-category';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-category-menu',
  templateUrl: './product-category-menu.component.html',
  styleUrls: ['./product-category-menu.component.css'],
})
export class ProductCategoryMenuComponent implements OnInit {
  /**We are creating a new array for keeping the data that comes from 
   * REST API and also we have to @Inject out service (ProductService) at this point
   */
  productCategories: ProductCategory[] = [];
  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.listProductCategories();
  }
  // then we are creating a new method to recieve category types from the API
  // then we have to call this method in the ngOnInit() scope because it act likes a
  // @PostConstruct in Spring Applications
  listProductCategories() {
    // and we need to create an inner method to recieve information from ProductService
    // get ProductCategories()    
      this.productService.getProductCategories().subscribe(
        data => {
          console.log('Product Categories= '+JSON.stringify(data));
          this.productCategories = data;
        }
      );
  }
}

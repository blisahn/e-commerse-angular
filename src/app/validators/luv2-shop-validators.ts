import { FormControl, ValidationErrors } from "@angular/forms";

export class Luv2ShopValidators {
    /**
     * 
     * @param control we are taking FormControl instance to check
     * ValkidationErrors is a built-in angular api that lets you throw an 
     * Validation Error.
     */
    static notOnlyWhiteSpaces(control: FormControl): ValidationErrors | null {
        // check if the string only has white spaces
        if ((control.value != null) && (control.value.trim().length === 0)) {
            // invalid, return an error object
            return { 'notOnlyWhiteSpaces': true };
        } else {
            // valid return null
            return null;
        }
    }
}

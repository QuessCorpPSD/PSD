import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
    selector: 'app-category',
    imports: [CommonModule],
    templateUrl: './category.component.html',
    styleUrl: './category.component.css',
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CategoryComponent {

}

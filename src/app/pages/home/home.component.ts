import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';

import {MatGridListModule} from '@angular/material/grid-list';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,RouterModule,NgChartsModule,MatGridListModule,CanvasJSAngularChartsModule ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  date=new Date();
  
  chartOptions = {
	  animationEnabled: true,
	  exportEnabled: true,
	  
	  data: [{
		type: "stepLine",
		dataPoints: [
		  { x: new Date(2021, 0, 1), y: 1792 },
		  { x: new Date(2021, 1, 1), y: 1326 },
		  { x: new Date(2021, 2, 1), y: 1955 },
		  { x: new Date(2021, 3, 1), y: 1727 },
		  { x: new Date(2021, 4, 1), y: 1085 },
		  { x: new Date(2021, 5, 1), y: 1523 },
		  { x: new Date(2021, 6, 1), y: 1257 },
		  { x: new Date(2021, 7, 1), y: 1520 },
		  { x: new Date(2021, 8, 1), y: 1853 },
		  { x: new Date(2021, 9, 1), y: 1738 },
		  { x: new Date(2021, 10, 1), y: 1754 },
		  { x: new Date(2021, 11, 1), y: 1624 }
		]
	  }]
}
 

}



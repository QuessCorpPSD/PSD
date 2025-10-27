import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AgGridAngular } from "ag-grid-angular";
import type { ColDef } from "ag-grid-community";
import {
    AllCommunityModule,
  ModuleRegistry,
  themeAlpine,
  themeBalham,
  themeMaterial,
  themeQuartz,
} from "ag-grid-community";

    
    ModuleRegistry.registerModules([ AllCommunityModule ]);
@Component({
    selector: 'app-dash',
    imports: [AgGridAngular, FormsModule, CommonModule],
    templateUrl: './dash.component.html',
    styleUrl: './dash.component.css',
    encapsulation: ViewEncapsulation.None
    
})
export class DashComponent {
 themes = [
    { label: "themeQuartz", theme: themeQuartz },
    { label: "themeBalham", theme: themeBalham },
    { label: "themeMaterial", theme: themeMaterial },
    { label: "themeAlpine", theme: themeAlpine },
  ];
  theme = themeQuartz;

  columnDefs: ColDef[] = [
    { field: "make" },
    { field: "model" },
    { field: "price" },
  ];

  defaultColDef: ColDef = {
    editable: true,
    flex: 1,
    minWidth: 100,
    filter: true,
  };

  rowData: any[] = (() => {
    const rowData: any[] = [];
    for (let i = 0; i < 10; i++) {
      rowData.push({
        make: "Toyota",
        model: "Celica",
        price: 35000 + i * 1000,
      });
      rowData.push({ make: "Ford", model: "Mondeo", price: 32000 + i * 1000 });
      rowData.push({
        make: "Porsche",
        model: "Boxster",
        price: 72000 + i * 1000,
      });
    }
    return rowData;
  })();
}

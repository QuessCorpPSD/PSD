import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component,  CUSTOM_ELEMENTS_SCHEMA,  Input,  OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet  } from '@angular/router';
import { EncryptionService } from '../../../Shared/encryption.service';

@Component({
  selector: 'app-gridview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gridview.component.html',
  styleUrl: './gridview.component.css',
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridviewComponent implements OnInit {
  
  @Input() data!:any;
  constructor(private route:Router,private _encry:EncryptionService){

  }
  ngOnInit(): void {
    console.log(this.data);
  }

  // onCardClick(event:any,lot,hc,companycode) {
  //  this.route.navigate(['/Master/AllottedLot'],{ 
  //   queryParams: { lot: lot, hc: hc,companycode:companycode } 
  // });
  // }

  onCardClick(item:any) {
    var a=JSON.stringify(item);
    const en=this._encry.encrypt(a);
   
    this.route.navigate(['/Master/AllottedLot'],{ 
     queryParams: { items:en } 
   });
   }
}

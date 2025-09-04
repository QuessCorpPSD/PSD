import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-model',
  standalone: true,
  imports: [],
  templateUrl: './model.component.html',
  styleUrl: './model.component.css'
})
export class ModelComponent implements OnInit {
   @Input() message!:string;
   @Input() submessage!:string;
   @Input() fontColor: string = 'black';
   @Input() type:string=''; 
 @Output() closed = new EventEmitter<void>();

ngOnInit(): void {
  console.log(this.type);
  console.log(this.fontColor);
}
  closePopup(){
    
    this.closed.emit();
  }
}

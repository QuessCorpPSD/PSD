import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-model',
  standalone: true,
  imports: [],
  templateUrl: './model.component.html',
  styleUrl: './model.component.css'
})
export class ModelComponent {
   @Input() message!:string;
   @Input() submessage!:string;
closePopup(){

}
}

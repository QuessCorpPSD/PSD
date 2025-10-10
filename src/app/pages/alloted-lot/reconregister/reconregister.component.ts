import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-reconregister',
    imports: [CommonModule],
    templateUrl: './reconregister.component.html',
    styleUrl: './reconregister.component.css'
})
export class ReconregisterComponent {
  @Input() title: string = 'Modal Title';
  @Input() show: boolean = false;
  @Output() close = new EventEmitter<void>();
onClose(){}
}

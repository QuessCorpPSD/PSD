import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
export interface IListBoxItem {
  value: string;
  text: string;
}


export interface AttributeItem {
  text: string;
  value?: any;   // optional if needed
}
export interface IItemsMovedEvent {
  available: Array<{}>;
  selected: Array<{}>;
  movedItems: Array<{}>;
  from: 'selected' | 'available';
  to: 'selected' | 'available';
}
@Component({
  selector: 'paycodedragdrop',
  imports: [DragDropModule,CommonModule],
  templateUrl: './paycodedragdrop.component.html',
  styleUrl: './paycodedragdrop.component.css'
})
export class PaycodedragdropComponent implements OnInit{
  availableItems: Array<IListBoxItem> = [];
  filteredAvailableItems: Array<IListBoxItem> = [];
  selectedItems: Array<IListBoxItem> = [];
  listBoxForm!: FormGroup;
  finalHeaders: any;
  SelectedRows: Array<AttributeItem> = [];
  isLoading = false;
   @Output() close = new EventEmitter<void>();
  @Input() Company_Code?: string;
  @Input() pay_period?: string;
  IsAdd: boolean = false;
  @Input() set availables(items: Array<{}>) {
    this.availableItems = [...(items || []).map((item: {}, index: number) => ({
      value: item[this.valueField].toString(),
      text: item[this.textField],
    }))];
  }

  @Input() set selects(items: Array<{}>) {
    this.selectedItems = [...(items || []).map((item: {}, index: number) => ({
      value: item[this.valueField].toString(),
      text: item[this.textField],
    }))];
  }

  // field to use for value of option
  @Input() valueField = 'value';
  // field to use for displaying option text
  @Input() textField = 'text';
  // text displayed over the available items list box
  availableText = 'Available UserNames';
  // text displayed over the selected items list box
  @Input() selectedText = 'Selected UserNames';
  // set placeholder text in available items list box
  @Input() availableFilterPlaceholder = 'Search & Select available PayCode';
  // set placeholder text in selected items list box
  @Input() selectedFilterPlaceholder = ' Search & Selected PayCode';
  @Input() AttributeType?: string;
  @Input() ScreenName?: string;
  @Input() SelectedAttributeRows: any[] = [];

  // event called when items are moved between boxes, returns state of both boxes and item moved
  @Output() itemsMoved: EventEmitter<IItemsMovedEvent> = new EventEmitter<IItemsMovedEvent>();

  constructor(public fb: FormBuilder) {
    this.listBoxForm = this.fb.group({
      availableSearchInput: [''],
      selectedSearchInput: [''],
    });
  }
    ngOnInit(): void {

    this.filteredAvailableItems = [...this.availableItems]

    console.log('1', this.filteredAvailableItems);

    this.listBoxForm.get("availableSearchInput")?.valueChanges.subscribe(response => {
      const searchText = response?.trim().toLowerCase() ?? "";
      // Step 1: Start from all available items
      let filtered = [...this.availableItems];
      // Step 2: Apply search filter (if any)
      if (searchText !== "") {
        filtered = filtered.filter(x =>
          x.text.toLowerCase().includes(searchText)
        );
      }

      // Step 3: Remove items that are already selected
      filtered = filtered.filter(a =>
        !this.selectedItems.some(s => s.value === a.value)
      );
      // Step 4: Assign to UI list
      this.filteredAvailableItems = filtered;
      console.log('2', this.filteredAvailableItems);
    });

  }
   drop(event: CdkDragDrop<IListBoxItem[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
    // clear marked available items and emit event
    this.itemsMoved.emit({
      available: this.availableItems,
      selected: this.selectedItems,
      movedItems: event.container.data.filter((v, i) => i === event.currentIndex),
      from: 'available',
      to: 'selected',
    });
  }
}

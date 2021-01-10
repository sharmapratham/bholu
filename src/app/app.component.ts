import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'getDimension';
  depth = 0;
  height = 0;
  dynamicForm: FormGroup;
  submitted = false;

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  datasource = new MatTableDataSource();

  calculatedValues = [];

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.dynamicForm = this.formBuilder.group({
      numberOfBoxes: ['', Validators.required],
      boxes: new FormArray([]),
    });
  }

  // convenience getters for easy access to form fields
  get f() {
    return this.dynamicForm.controls;
  }
  get t() {
    return this.f.boxes as FormArray;
  }

  onChangeboxes(e) {
    console.log(e);
    const numberOfBoxes = e.value || 0;
    if (this.t.length < numberOfBoxes) {
      for (let i = this.t.length; i < numberOfBoxes; i++) {
        this.t.push(
          this.formBuilder.group({
            width: ['', Validators.required],
            shelves: [''],
          })
        );
      }
    } else {
      for (let i = this.t.length; i >= numberOfBoxes; i--) {
        this.t.removeAt(i);
      }
    }
  }

  onSubmit() {
    for (
      let index = 0;
      index < this.dynamicForm.value['boxes'].length;
      index++
    ) {
      this.dynamicForm.value['boxes'][index]['topbottom'] =
        this.dynamicForm.value['boxes'][index]['width'] -
        36 +
        ' x ' +
        this.depth;
      this.calculatedValues.push([
        {
          item: 'Top Bottom',
          dimension:
            this.dynamicForm.value['boxes'][index]['width'] -
            36 +
            ' x ' +
            this.depth,
          quantiity: 2,
          thickness: '18mm',
        },
        {
          item: 'Side',
          dimension: this.height + ' x ' + this.depth,
          quantiity: 2,
          thickness: '18mm',
        },
        {
          item: 'Back Ply',
          dimension:
            this.dynamicForm.value['boxes'][index]['width'] -
            18 +
            ' x ' +
            (this.height - 18),
          quantiity: 1,
          thickness: '6mm',
        },
      ]);
      if (this.dynamicForm.value['boxes'][index]['shelves'] > 0) {
        this.calculatedValues[index].push({
          item: 'Shelves',
          dimension:
            this.dynamicForm.value['boxes'][index]['width'] -
            36 +
            ' x ' +
            (this.depth - 54),
          quantiity: this.dynamicForm.value['boxes'][index]['shelves'],
          thickness: '18mm',
        });
      } else {
        this.calculatedValues[index].push({
          item: 'Shelves',
          dimension: 'N/A',
          quantiity: 0,
          thickness: 'N/A',
        });
      }
    }
    console.log(
      this.calculatedValues,
      this.dynamicForm.value
      // 'SUCCESS!! :-)\n\n' + JSON.stringify(this.dynamicForm.value, null, 4)
    );
  }
}

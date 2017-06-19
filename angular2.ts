
// простой код на angular полная версия на https://github.com/fenvenfen/angularTodo

import { Component, OnInit } from '@angular/core';

let newid = 0;    

@Component({
  selector: 'todo-list',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
   
    public  todos : any[];
    public key: any;
    public direction: any;
    constructor() {
      this.todos = [];
    } 
   ngOnInit() {
      
    }
   add(newtodo : string) : boolean {
      newid = this.todos.length + 1;
      let dotoObject = {
          id: newid,
          name: newtodo
      }
      this.todos.push(dotoObject);
      console.log('Add new items: id', newid, '  text:',  newtodo,  'Register array', this.todos);
      return false;
    }
   remove(name: string) : void {
      var index = this.todos.indexOf(name, 0);
      if (index !== undefined) {
        this.todos.splice(index, 1);
      }
         console.log('Dalete  items  ', this.todos[index], 'Register array   ', this.todos );
    }
     
    sort(param: string): void {
      this.key = param;
    }   
 }

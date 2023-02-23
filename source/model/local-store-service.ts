import { TodoItem } from "../utils/todo-item.js"

interface valueObjectType{
    name : string,
    isCompleted : boolean,
    id? : number
}

export function localStore() {
    return {

        createTodoLocal : function (value : string) {
            const existingList : valueObjectType[] = getTodoLocal()
            existingList.push(new TodoItem(value))
            setTodoLocal(existingList)
        },

        editTodoLocal : function (previousValue : string, newValue : string, isCompleted = false) {
            const existingList : valueObjectType[] = getTodoLocal()
            existingList.splice(existingList.indexOf(returnRequiredObject(previousValue,existingList)),
            1, new TodoItem(newValue,isCompleted))
            setTodoLocal(existingList)
        },

        deleteTodoLocal : function (value : string) {
            const existingList : valueObjectType[] = getTodoLocal()
            existingList.splice(existingList.indexOf(returnRequiredObject(value,existingList)), 1)
            setTodoLocal(existingList)
        },

        deleteAllLocal : function () {
            setTodoLocal([])
        }

    }
}

export function getTodoLocal() : valueObjectType[] {
    return JSON.parse(`${localStorage.getItem("todo") || []}`)
}

function setTodoLocal (taskValue : valueObjectType[]) {
    localStorage.setItem("todo", JSON.stringify(taskValue))
}

function returnRequiredObject(value : string, existingList : valueObjectType[]) : valueObjectType {
    for(let elem of existingList){
        if(elem.name === value)
        return elem; 
    }  
}

console.log(getTodoLocal())
import { TodoItem } from "../utils/todo-item"

type existingListType = { name : string, isCompleted? : boolean, id? : number}[]

export function localStore() {
    return {

        createTodoLocal : function (value : string) {
            const existingList = getTodoLocal()
            existingList.push(new TodoItem(value))
            setTodoLocal(existingList)
        },

        editTodoLocal : function (previousValue : string, newValue : string, isComplete = false) {
            const existingList = getTodoLocal()
            existingList.splice(existingList.indexOf(returnRequireObject(previousValue,existingList)), 1, new TodoItem(newValue,isComplete))
            setTodoLocal(existingList)
        },

        deleteTodoLocal : function (value : string) {
            const existingList = getTodoLocal()
            existingList.splice(existingList.indexOf(returnRequireObject(value,existingList)), 1)
            setTodoLocal(existingList)
        },

        deleteAllLocal : function () {
            setTodoLocal([])
        }

    }
}

export function getTodoLocal() {
    return JSON.parse(`${localStorage.getItem("todo") || []}`)
}

function setTodoLocal (taskValue : existingListType) {
    localStorage.setItem("todo", JSON.stringify(taskValue))
}

function returnRequireObject(value : string, existingList : existingListType){
    for(let elem of existingList){
        if(elem.name === value){
            return elem
        }
    }
}

getTodoLocal()
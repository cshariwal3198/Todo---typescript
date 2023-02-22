import {TodoItem} from "../utils/todo-item"

const todoApiURL = "https://mk-todo-web-api.azurewebsites.net/api/ChethanTodoItems"
const deleteApiURL = "https://mk-todo-web-api.azurewebsites.net/ChethanTodoItems/deleteAll"

const optionHeader = {
    "Content-type": "application/json",
}

class OptionObject{
    constructor(method : string, body?: Object, header? : Object){
       return {
        method,
        body,
        header,
       }
    }
}

export function cloudStore(){
    return {

        getTodoCloud: async function(){
            return (await fetch(todoApiURL)).json()
        },

        postMethod : async function(value : string){
            return (await setTodoCloud(todoApiURL,new OptionObject("POST",
                new TodoItem(value),optionHeader))).json()
        },

        putMethod : function (index : number, editedValue : string, isComplete : boolean = false) {
            return setTodoCloud(`${todoApiURL}/${index}`,
                new OptionObject("PUT",new TodoItem(editedValue,isComplete,index),optionHeader))
        },
        
        deleteMethodCloud : async function (index : number) {
            return await setTodoCloud(`${todoApiURL}/${index}`, new OptionObject("DELETE"))
        },

        deleteAllCloud : async function () {
            return await setTodoCloud(deleteApiURL,new OptionObject("DELETE"))
        },
    }
}

async function setTodoCloud (apiURL : URL | string, options : Object) : Promise<any>{
    try {
        return await fetch(apiURL, options)
    } catch (error) {
        console.log("Something went wrong...!!")
    }
}


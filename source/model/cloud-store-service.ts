import { TodoItem, IvalueObjectType, OptionHeaderType } from '../utils/todo-item.js'

const todoApiURL = 'https://mk-todo-web-api.azurewebsites.net/api/ChethanTodoItems'
const deleteApiURL = 'https://mk-todo-web-api.azurewebsites.net/ChethanTodoItems/deleteAll'

const optionHeader : OptionHeaderType = {
    "Content-type": "application/json",
}

class OptionObject {
    method;
    body;
    headers;
    constructor( method : string, body? : IvalueObjectType, header? : OptionHeaderType ){
        this.method = method;
        this.body = JSON.stringify(body);
        this.headers = header;
    }
}

function cloudStore(){
    return {
        getTodoCloud : async function() {
            return (await fetch(todoApiURL)).json()
        },

        postMethod : async function(value : string) {
            return (await setTodoCloud(todoApiURL,new OptionObject('POST',
                new TodoItem(value),optionHeader))).json()
        },

        putMethod : function (index : number, editedValue : string, isCompleted : boolean = false) {
            return setTodoCloud(`${todoApiURL}/${index}`,
                new OptionObject('PUT',new TodoItem(editedValue,isCompleted,index),optionHeader))
        },
        
        deleteMethodCloud : async function (index : number) {
            return await setTodoCloud(`${todoApiURL}/${index}`, new OptionObject('DELETE'))
        },

        deleteAllCloud : async function () {
            return await setTodoCloud(deleteApiURL,new OptionObject('DELETE'))
        },
    }
}

async function setTodoCloud (apiURL : string, options : OptionObject) : Promise<any>{
    try {
        return await fetch(apiURL, options)
    } catch (error) {
        console.log('Something went wrong...!!!')
    }
}

export  { cloudStore }
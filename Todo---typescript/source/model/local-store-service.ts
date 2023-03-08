import { TodoItem, IValueObjectType } from '../utils/todo-item.js'

export function localStore() {
    return {
               
        createTodoLocal: function (value: string) {
            const existingList = getTodoLocal()
            existingList.push(new TodoItem(value))
            setTodoLocal(existingList)
        },

        editTodoLocal: function (previousValue: string, newValue: string, isCompleted?: boolean) {
            const existingList = getTodoLocal()
            existingList.splice(existingList.indexOf(returnRequiredObject(previousValue, existingList)),
                1, new TodoItem(newValue, isCompleted))
            setTodoLocal(existingList)
        },

        deleteTodoLocal: function (value: string) {
            const existingList = getTodoLocal()
            existingList.splice(existingList.indexOf(returnRequiredObject(value, existingList)), 1)
            setTodoLocal(existingList)
        },

        deleteAllLocal: function () {
            setTodoLocal([])
        }

    }
}

export function getTodoLocal(): IValueObjectType[] {
    return JSON.parse(`${localStorage.getItem('todo') || []}`)
}

function setTodoLocal(taskValue: IValueObjectType[]) {
    localStorage.setItem('todo', JSON.stringify(taskValue))
}

function returnRequiredObject(value: string, existingList: IValueObjectType[]): IValueObjectType {
    const resultArray = existingList.filter(task => {
        if(task.name === value) return task;
    })
    return resultArray[1]
}
returnRequiredObject('task',getTodoLocal())
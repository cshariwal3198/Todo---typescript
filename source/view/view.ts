import { appController } from "../controller/app-controller"

const form = document.querySelector(".form") as HTMLFormElement
const taskContainer = document.querySelector(".div-to-display") as HTMLDivElement
const taskInputBlock = document.querySelector(".form-input") as HTMLInputElement
const inputError = document.querySelector("#error-div") as HTMLDivElement
const allClear = document.querySelector(".all-clear") as HTMLButtonElement

function view(){
    return {

        prepareTask : function(value : {id : number | string, name : string, isCompleted : boolean}) : void{
            let paraBlock = createNewElement("p")
            let span = createNewElement("span",value.name)
            appendElementToParent(paraBlock,span)
            appendElementToParent(paraBlock,createDeleteButton())
            appendElementToParent(paraBlock,createEditButton())
            appendElementToParent(taskContainer,paraBlock)
            taskInputBlock.value = ""
        },

        showEmptyInputError: function () {
            if (!taskInputBlock.value) {
                inputError.innerHTML = "** please enter a task"
                return false
            } else {
                inputError.innerHTML = ""
                return true
            }
        }
    }
}


function createNewElement(elementName : string,text?: string) : HTMLElement{
    const newElement = document.createElement(elementName)
    text && (newElement.innerText = text)
    return newElement
}

function appendElementToParent(parent : HTMLElement, child : HTMLElement) : void{
    parent.appendChild(child)
}

function createEditButton() : HTMLElement{
    const editButton = createNewElement("button","Edit")
    editButton.addEventListener("click", ()=> console.log("edit"))
    return editButton
}

function createDeleteButton() : HTMLElement{
    const deleteButton = createNewElement("button","X")
    deleteButton.addEventListener("click", ()=>console.log("delete"))
    return deleteButton
}

export {view}
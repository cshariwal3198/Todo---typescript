import { appController, valueObjectType } from "../controller/app-controller.js"

const form = document.querySelector(".form") as HTMLFormElement
const taskContainer = document.querySelector(".div-to-display") as HTMLDivElement
const taskInputBlock = document.querySelector(".form-input") as HTMLInputElement
const inputError = document.querySelector("#error-div") as HTMLDivElement
const allClear = document.querySelector(".all-clear") as HTMLButtonElement

let {deleteSingleTask, editSelectedTask, varifyCheck} = appController()

function view(){
    return {

        prepareTask : function(value : valueObjectType) : void{
            let paraBlock = createNewElement("p")
            let span = createNewElement("span",value.name)
            appendElementToParent(paraBlock,span)
            appendElementToParent(paraBlock, createCheckBoxElement("change", value))
            appendElementToParent(paraBlock,createDeleteButton("click", value))
            appendElementToParent(paraBlock,createEditButton("click", span, value))
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


function createNewElement(elementName : string, text?: string) : HTMLElement{
    const newElement = document.createElement(elementName)
    text && (newElement.innerText = text)
    return newElement
}

function appendElementToParent(parent : HTMLElement, child : HTMLElement) : void{
    parent.appendChild(child)
}

function createEditButton(event : string, span : HTMLSpanElement, value : valueObjectType) : HTMLElement{
    const editButton = createNewElement("button","Edit") as HTMLButtonElement
    editButton.addEventListener("click", ()=>editSelectedTask(editButton,span,value.id as number))
    return editButton
}

function createDeleteButton(event : string, value : valueObjectType) : HTMLElement{
    const deleteButton = createNewElement("button","X")
    deleteButton.addEventListener(event, ()=>deleteSingleTask((deleteButton.parentNode as HTMLElement),value))
    return deleteButton
}

function createCheckBoxElement(event : string, value : valueObjectType){
    const check = createNewElement("input") as HTMLInputElement
    check.type = "checkbox"
    check.addEventListener(event, () => varifyCheck(check, value))
    return check;
}

export {view}
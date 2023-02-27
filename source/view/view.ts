import { appController, IvalueObjectType } from "../controller/app-controller.js"

const taskContainer = document.querySelector(".div-to-display") as HTMLDivElement
const taskInputBlock = document.querySelector(".form-input") as HTMLInputElement
const inputError = document.querySelector("#error-div") as HTMLDivElement

let { deleteSingleTask, editSelectedTask, adjustCheckValue } = appController()

function view(){
    return {

        prepareTask : function(value : IvalueObjectType) : void{
            let paraBlock = createNewElement("p")
            let span = createNewElement("span",value.name)
            appendElementToParent(paraBlock,span)
            appendElementToParent(paraBlock, createCheckBoxElement("change", span, value))
            appendElementToParent(paraBlock,createDeleteButton("click", value))
            appendElementToParent(paraBlock,createEditButton("click", span, value))
            appendElementToParent(taskContainer,paraBlock)
            taskInputBlock.value = ""
        },

        showEmptyInputError: function () : boolean {
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
    const newElement = document.createElement(elementName) as HTMLElement
    text && (newElement.innerText = text)
    return newElement
}

function appendElementToParent(parent : HTMLElement, child : HTMLElement) : void{
    parent.appendChild(child)
}

function createEditButton(event : string, span : HTMLSpanElement, value : IvalueObjectType) : HTMLElement{
    const editButton = createNewElement("button","Edit") as HTMLButtonElement
    value.isCompleted && (editButton.disabled = true)
    editButton.addEventListener(event, ()=>editSelectedTask(editButton,span,value.id as number))
    return editButton;
}

function createDeleteButton(event : string, value : IvalueObjectType) : HTMLElement{
    const deleteButton = createNewElement("button","X") as HTMLButtonElement
    deleteButton.addEventListener(event, ()=>deleteSingleTask((deleteButton.parentNode as HTMLElement),value))
    return deleteButton;
}

function createCheckBoxElement(event : string, span : HTMLSpanElement, value : IvalueObjectType){
    const check = createNewElement("input") as HTMLInputElement
    check.type = "checkbox"
    value.isCompleted && (check.checked = true, span.style.textDecoration = "line-through")
    check.addEventListener(event, () => adjustCheckValue(check, value))
    return check;
}

export {view}
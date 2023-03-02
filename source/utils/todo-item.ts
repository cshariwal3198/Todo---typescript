class TodoItem{

    name;
    isCompleted;
    id;

    constructor(name: string, isCompleted? : boolean, index? : number){
        this.id = index;
        this.name = name;
        this.isCompleted = isCompleted || false;
    }
}

interface IvalueObjectType{
    name : string,
    isCompleted? : boolean,
    id? : number
}

type OptionHeaderType = {
    [key : string] : string
}

export { TodoItem, IvalueObjectType, OptionHeaderType }
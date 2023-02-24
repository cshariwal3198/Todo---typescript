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

interface valueObjectType{
    name : string,
    isCompleted? : boolean,
    id? : number
}

export { TodoItem, valueObjectType }
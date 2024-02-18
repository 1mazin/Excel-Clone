for(let i=0;i<rows;i++){
    for(let j=0;j<cols;j++){
        let cell=document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
        cell.addEventListener("blur",(e)=>{
            let address=addressBar.value;
            let [activeCell,cellProp]=getCell(address)
            let enteredData=activeCell.innerText;
            if(enteredData === cellProp.value) return;

            cellProp.value=enteredData
            //if data modified remove parent child relation,updae children with hardcoded value
            removeChildFromParent(cellProp.formula)
            cellProp.formula = ""
            updateChildrenCell(address)
        })
    }
}

let formulaBar=document.querySelector(".formula-bar");
formulaBar.addEventListener("keydown",(e)=>{
    let inputFormula=formulaBar.value
    if(e.key==="Enter" && formulaBar.value){
        let address = addressBar.value;
        //if change in relation break old parent child relation evaluate and add new relation
        let [cell,cellProp]=getCell(address)

        if(inputFormula != cellProp.formula) removeChildFromParent(cellProp.formula)
        let ans=evaluateFormula(inputFormula)

        //update UI and DB
        setCellUIprop(ans,inputFormula,address)
        addChildToParent(inputFormula)
    
    console.log(sheetDB)
    updateChildrenCell(address)
}
})
function updateChildrenCell(parentAddress) {
    let [parentCell,parentCellProp]=getCell(parentAddress);
    let children=parentCellProp.children;
    for(let i = 0;i<children.length;i++){
        let childAddress = children[i];
        let [childCell,childCellProp] = getCell(childAddress)
        let childFormula = childCellProp.formula;
        let ans=evaluateFormula(childFormula);
        setCellUIprop(ans,childFormula,childAddress);
        updateChildrenCell(childAddress)
    }
    
}


function addChildToParent(formula) {
    let childAddress = addressBar.value;
    let encodedFormula = formula.split(" ");
    console.log(encodedFormula)
    for(let i = 0;i<encodedFormula.length;i++){
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue >= 65 && asciiValue <= 90 ){
            let [parentCell,parentCellProp] = getCell(encodedFormula[i]);

            parentCellProp.children.push(childAddress);
            //console.log(parentCell.value)
        }
    }
    
}

function removeChildFromParent(formula) {
    let childAddress = addressBar.value;
    let encodedFormula = formula.split(" ");
    for(let i = 0;i<encodedFormula.length;i++){
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue >= 65 && asciiValue <= 90 ){
            let [parentCell,parentCellProp] = getCell(encodedFormula[i]);
            let idx = parentCellProp.children.indexOf(childAddress);
            parentCellProp.children.splice(idx,1)
           
        }
    }
    
}
function evaluateFormula(formula){
    let encodedFormula=formula.split(" ");
    for(let i=0;i<encodedFormula.length;i++){
        let asciiValue=encodedFormula[i].charCodeAt(0);
        if(asciiValue>=65 && asciiValue<=90 ){
            let [cell,cellProp]=getCell(encodedFormula[i]);
            encodedFormula[i]=cellProp.value;

        }
       
    }
    let decodedFormula=encodedFormula.join(" ");
    return eval(decodedFormula);
}

function setCellUIprop(evaluatedValue,formula,address) {
    let [cell,cellProp]=getCell(address)

    //ui update
    cell.innerText=evaluatedValue;
    //db update
    cellProp.value=evaluatedValue;
    cellProp.formula=formula;
}
//storage
let sheetDB=[];
for(let i=0;i<rows;i++){
    let sheetRow=[]
    for(let j=0;j<cols;j++){
      let cellProp={
        bold:false,
        italic:false,
        underline:false,
        alignment:"left",
        fontFamily:"monospace",
        fontSize:"14",
        fontColor:"#000000",
        BGcolor:"#000000",
        value:"",
        formula:"",
        children:[],

      }
      sheetRow.push(cellProp)
    }
    sheetDB.push(sheetRow)
}




//Selectors for cell properties
let bold = document.querySelector(".bold");
let italic = document.querySelector(".italic");
let underline = document.querySelector(".underline")
let fontSize = document.querySelector(".font-size-prop")
let fontFamily = document.querySelector(".font-family-prop")
let fontColor = document.querySelector('.font-color-prop')
let BGcolor = document.querySelector('.bg-color-prop')
let alignment = document.querySelectorAll(".alignment")
let leftAlign = alignment[0];
let rightAlign = alignment[1];
let centerAlign = alignment[2];


let activeColorProp = "#d1d8e0"
let inactiveColorProp = "#ecf0f1"


//attach property listener
bold.addEventListener("click",(e)=>{
   
    let [cell,cellProp] = getCell(addressBar.value);

    //Modification
    cellProp.bold =! cellProp.bold; //data upadate in sheetsdb
    //UI changes
    cell.style.fontWeight = cellProp.bold?"bold":"normal";
    bold.style.backgroundColor = cellProp.bold?activeColorProp:inactiveColorProp;

})
italic.addEventListener("click",(e)=>{
   
    let [cell,cellProp] = getCell(addressBar.value);

    //Modification
    cellProp.italic =! cellProp.italic; //data upadate in sheetsdb
    //UI changes
    cell.style.fontStyle = cellProp.italic?"italic":"normal";
    italic.style.backgroundColor = cellProp.italic?activeColorProp:inactiveColorProp;

})


underline.addEventListener("click",(e)=>{
   
    let [cell,cellProp] = getCell(addressBar.value);

    //Modification
    cellProp.underline =! cellProp.underline; //data upadate in sheetsdb
    //UI changes
    cell.style.textDecoration = cellProp.underline?"underline":"none";
    underline.style.backgroundColor = cellProp.underline?activeColorProp:inactiveColorProp;

})
fontSize.addEventListener("change",(e)=>{
    let address=addressBar.value
    let [cell,cellProp] = getCell(address);
    cellProp.fontSize = fontSize.value //db update
    cell.style.fontSize = cellProp.fontSize+"px"
    fontSize.value = cellProp.fontSize;
})
fontFamily.addEventListener("change",(e)=>{
    let address = addressBar.value
    let [cell,cellProp] = getCell(address);
    cellProp.fontFamily = fontFamily.value //db update
    console.log(cellProp.fontFamily)
    cell.style.fontFamily = cellProp.fontFamily
    
})
fontColor.addEventListener("change",(e)=>{
    let address = addressBar.value
    let [cell,cellProp] = getCell(address);
    cellProp.fontColor = fontColor.value //db update
    cell.style.color = cellProp.fontColor;
    fontColor.value = cellProp.fontColor;
})
BGcolor.addEventListener("change",(e)=>{
    let address = addressBar.value
    let [cell,cellProp] = getCell(address);
    cellProp.BGcolor = BGcolor.value //db update
    cell.style.backgroundColor = cellProp.BGcolor;
    BGcolor.value = cellProp.BGcolor;
})
alignment.forEach((alignElem)=> {
    alignElem.addEventListener("click",(e)=>{
        let address = addressBar.value
        let [cell,cellProp] = getCell(address);
        let alignValue = e.target.classList[0];
        //console.log(alignValue)
        cellProp.alignment = alignValue  //data update
        cell.style.textAlign = cellProp.alignment//ui change
        switch (alignValue) {
            case "left":
                leftAlign.style.backgroundColor=activeColorProp;
                centerAlign.style.backgroundColor=inactiveColorProp;
                rightAlign.style.backgroundColor=inactiveColorProp;
                break;
            case "right":
                rightAlign.style.backgroundColor=activeColorProp;
                leftAlign.style.backgroundColor=inactiveColorProp;
                centerAlign.style.backgroundColor=inactiveColorProp;
               
                break;
            case "center":
                centerAlign.style.backgroundColor=activeColorProp;
                leftAlign.style.backgroundColor=inactiveColorProp;
                rightAlign.style.backgroundColor=inactiveColorProp;
                break;
        }
    })
    
});
let allCells=document.querySelectorAll(".cell");
for(let i=0;i<allCells.length;i++){
    addListenerToAttachCellProperties(allCells[i]);

}


function addListenerToAttachCellProperties(cell){
    cell.addEventListener("click",(e)=>{
        let address = addressBar.value;
        let [rid,cid] = decodeAddress(address)
        let cellProp = sheetDB[rid][cid]

         //Apply cell properties
         cell.style.fontWeight = cellProp.bold?"bold":"normal";
         cell.style.fontStyle = cellProp.italic?"italic":"normal";
         cell.style.textDecoration = cellProp.underline?"underline":"none";
         cell.style.fontSize = cellProp.fontSize+"px";
         cell.style.fontFamily = cellProp.fontFamily;
         cell.style.color = cellProp.fontColor;
         cell.style.backgroundColor = cellProp.BGcolor === "#000000" ? "transparent" : cellProp.BGcolor;
         cell.style.textAlign = cellProp.alignment;


        //apply ui properties
        bold.style.backgroundColor = cellProp.bold?activeColorProp:inactiveColorProp;
        italic.style.backgroundColor = cellProp.italic?activeColorProp:inactiveColorProp;
        underline.style.backgroundColor = cellProp.underline?activeColorProp:inactiveColorProp;
        fontColor.value = cellProp.fontColor;
        fontSize.value = cellProp.fontSize;
        fontFamily.value = cellProp.fontFamily
        
        BGcolor.value = cellProp.BGcolor;

        switch (cellProp.alignment) {
            case "left":
                leftAlign.style.backgroundColor = activeColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;
            case "right":
                rightAlign.style.backgroundColor = activeColorProp;
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
               
                break;
            case "center":
                centerAlign.style.backgroundColor = activeColorProp;
                leftAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;
        }
        let formulaBar=document.querySelector(".formula-bar")
        formulaBar.value=cellProp.formula
        cell.value=cellProp.value
        
    })
    //work
}


function getCell(address){
   let [rid,cid] = decodeAddress(address);
   //Access cell 
   let cell = document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
   let cellProp = sheetDB[rid][cid];
   return [cell,cellProp]
}

function decodeAddress(address){
    let rID = Number(address.slice(1)-1);
    let cID = Number(address.charCodeAt(0))-65;
    return [rID,cID];

}
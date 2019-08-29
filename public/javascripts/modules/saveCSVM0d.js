console.log('saveCSVM0d');
//const ResTblBdy = document.getElementById('resTblBdy');
console.log('ResTblBdy===>', ResTblBdy)

const SaveCSV = document.getElementById('saveCSV');
const SaveCSVPost = document.getElementById('saveCSVPost');
const SearchDBbtn = document.getElementById('searchDB');

SearchDBbtn.addEventListener('click', function () {
   
    
})

if (document.getElementById('resTblBdy').childNodes.length <= 0) {
    SaveCSVPost.style.display="none";
    SaveCSV.style.display="none"
} else {
    SaveCSVPost.style.display="block; float: left";
    SaveCSV.style.display="block; float: left"
}
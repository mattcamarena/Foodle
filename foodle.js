// Board Variables
var canvas = document.getElementById( "grid" );
var context = canvas.getContext( "2d" );
var words = ["Apple","Melon","lemon","mango","peach","papay","berry", "anise","bacon","bagel","basil","bread","chili","yeast","wheat","water","syrup","steak","onion","olive","liver","salsa","salad","punch","roast","mochi"]
var food = "";
var wordMap = new Map();
var solved = 0;
// Initialize 6x5 2D array heightxwidth w Empty strings
var boardValues = new Array(6);
var boardColors = new Array(6);
for (var i = 0; i < 6; i++) {
	boardValues[i] = new Array(5);
	boardColors[i] = new Array(5);
	for(var j = 0; j < 5; j++){
		boardValues[i][j] = "";
		boardColors[i][j] = "black";
	}
}

setWordMap(words[Math.floor(Math.random()*words.length)]);
// On first open hold empty 5/6 grid
redraw_canvas(context);
//draw_clear_canvas(context,100,'grey');
//fillSquareColor(context,0,1,'green');


// Word of day + map of word
function setWordMap(word){
	food = word.toLowerCase();

	for(const letter of food){
		if(wordMap.has(letter)){
			wordMap.set(letter,wordMap.get(letter)+1);
		}else{
		wordMap.set(letter,1);
		}
	}

}

// Need to fix this deals with user input
var aa = 0;
var bb = 0;

// EVENT LISTENER
// WHERE IT LISTENS TO USER INPUT
document.addEventListener('keydown', function(event){

	if(solved == 1) return;

	if(event.keyCode > 65 && event.keyCode < 91){
		if(bb < 5){
			boardValues[aa][bb] = String.fromCharCode(event.keyCode);
			redraw_canvas(context);
			bb++;
		}
	}else if(event.keyCode == 8){ // backspace needs to clear letter still
		if(bb > 0){
			bb--;
			boardValues[aa][bb] = "";
			redraw_canvas(context);
		}
	}else if(event.keyCode == 13){ //enter
		if(aa == 6) return;

		if(bb == 5){
			if(check_valid_word(boardValues[aa][0]+boardValues[aa][1]+boardValues[aa][2]+boardValues[aa][3]+boardValues[aa][4])){
				var res = foodle(boardValues[aa][0]+boardValues[aa][1]+boardValues[aa][2]+boardValues[aa][3]+boardValues[aa][4]);

				for(var i = 0; i < 5; i++){
					boardColors[aa][i] = res[i];
				}
				bb = 0;
				aa++;
				redraw_canvas(context);
			}			
		}
	}
})

//assuming correct input in length
function foodle(str){
	str = str.toLowerCase();
	var res = ["","","","",""];
	var tempMap = new Map(wordMap);

	//green first
	for(var i = 0; i < 5; i++){
		if(food[i] == str[i]){
			res[i] = "green";
			tempMap.set(food[i],tempMap.get(food[i])-1);
		}
	}
	//yellow/black?
	for(var i = 0; i < 5; i++){
		if(res[i] == ""){//only care if its empty
			if(tempMap.has(str[i])){
				var ok = str[i];
				if(tempMap.get(ok) > 0){
					res[i] = "#b59f3b";
					tempMap.set(ok,tempMap.get(ok)-1);
				}else{
					res[i] = "#3a3a3c";
				}
			}else{
				res[i] = "#3a3a3c";
			}
		}
	}

	if(res[0] == 'green'){
		for(var i = 0; i < 4; i++){
			if(res[i] != res[i+1]){
				return res;
			}
		}
	}else{
		return res;
	}
	solved = 1;
	return res;
}

function check_valid_word(word){
	// check that the word is in the word map
	return true;
}
function redraw_canvas(board){
	fillSquareColors(board);
	fix_Grid(board);
	add_letters(board);
}

function fillSquareColors(board){
	
	board.save();
	for(var i = 0; i < 6; i++){
		for(var j = 0; j < 5; j++){
			board.beginPath();
			board.fillStyle = boardColors[i][j];
			board.rect(100*j,100*i,100,100);
			board.fill();
		}
	}
	board.restore();
}

function fix_Grid(board){
	
	board.save();
	board.strokeStyle =  'grey';
	var gapSize = 100;
	let width = board.canvas.width;
	let height= board.canvas.height;
	for(var i = 0; i < width; i+= gapSize){ //vertical
		board.beginPath();
		board.moveTo(i,0);
		board.lineTo(i,height);
		board.lineWidth = 1;
		board.stroke();
	}
	
	for (var i = 0; i < height; i += gapSize ){ // horizontal
        board.beginPath();
        board.moveTo( 0, i );
        board.lineTo( width, i );
        board.lineWidth = 1;
        board.stroke();
    }
    board.restore();
}


function add_letters(board){
	board.save();
	board.font = "80px Arial"
	board.fillStyle = 'lightgray';
	for(var i = 0; i < 6; i++){
		for(var j = 0; j < 5; j++){
			board.fillText(boardValues[i][j],(j*100+15),(i)*100+75);
		}
	}
	board.restore();
}

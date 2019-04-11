$( document ).ready(function() {

	const selectionBar = $('#selection-bar');
	const numChromosomes = 24;

	for(let i=0; i<numChromosomes; i++) {
		let id = 'chromosome' + (i+1);
		let img = "<img id='"+ id +"' src='../karyotypePics/JPG/chromosome" + (i+1) + ".jpg' />";
		selectionBar.append(img);
		$('#' + id).on("click", (i) => initChromosome(i+1));
	}

})

const initChromosome = (idx) => {
	console.log(idx)
}
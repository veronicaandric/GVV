class MenuTwo {
	constructor(data, xpos, ypos) {
		this.gene = data;
		//console.log(data);
		return this.initMenu(data, xpos, ypos);
	}

	initMenu(data, xpos, ypos) {
		const x = xpos || view.center.x;
		const y = ypos || 600;
		//1250 for the table top

		if(!data){
			return null;
		}

		let menu = new Group({ name: 'menu' });

		let options = Object.keys(data); 
		console.log("The options are: "+options);
		// switch statement for variant circle colour
		/*
		var obj = this.gene;
		var name = completeArc.name.replace('_completeArc','');
		var pathogenicity = obj[name]['pathogenicity'];

		switch(pathogenicity) {
        
			case "benign":
				x = 'green';
				break;
						
			case "likely benign":
				x = '#90EE90';
				break;
						
			case "likely pathogenic":
				x = 'red';
				break;
						
			case "pathogenic":
				x = '#8B0000';
				break;
						
			case "vus":
				x = 'yellow';
				break;
				
			default:
				 x = 'black'
				break;      
		}*/

		var location = 20;

		options.forEach( (option, i) => {
			var variantCircle = new Path.Circle(new Point(x+205, y+location), 10);
			var x_pos = x+205;
			var y_pos = y+location;
			location = location + 10;
			variantCircle.fillColor = 'green'; // see switch above
			console.log("The variance selected is"+option);
			//this.createArc({option: option});
			this.addTouchEvents(variantCircle, option, x_pos,y_pos);
			variantCircle.onMouseDown= function(event) {
				variantCircle.scale(2);
			}
			variantCircle.onMouseLeave= function(event) {
				variantCircle.scale(0.5);
			}
		})

		return menu;
	}

	addTouchEvents(completeArc, variance, x, y) {
            var obj = this.gene;
            //var name = Object.keys(obj);
            //console.log(name);
            var definitions = Object.keys(obj[variance]['definitions']);

		var count = 0;
		var path;
		var i;
		/*
		var popupPoint;
		var popupText;
		var mypath;
			path = new Path();
			path.strokeColor = '#00000';
			popupPoint = new Point(700,600);
			popupText = new PointText(popupPoint);
			popupText.fillColor = 'red';
			popupText.fontSize= 20;
			popupText.content = definitions[0];
			popupText.content = definitions[1];*/
			//mypath = new Path();
			//mypath.strokeColor = 'black';
			//mypath.add(new Point(700, 650)); 
			//mypath.add(new Point(700, 550)); 
			//mypath.add(new Point(750, 550));
			//mypath.add(new Point(750, 650));
			//mypath.closed = true;
			//popupText.visible = false;
			//mypath.visible = false;
			//path.visible = false;
			var tool = new Tool();
			//var tool2 = new Tool();
			//var newgroup = new Group([tool1, tool2]);
			//tool.fixedDistance = 25;
			var rectangles = new Group();
			var popupText = new Group();
			var popupText;
			var path = new Path();
			path.strokeColor = 'black';
		
		completeArc.onClick = function(event){
			//completeArc.fillColor.brightness = 1.0;
			//popupText.visible = true;
			//mypath.visible = true;
			for(i = 0; i < definitions.length; i++){
				var top = (50*i)+50;
				var bottom = (50*i)+100;
			rectangles.addChild(new Path.Rectangle(new Rectangle(new Point(50, top), new Point(150, bottom))));
			rectangles.strokeColor = 'black';
			rectangles.fillColor = 'white';
			popupText.addChild(new PointText(new Point(210, bottom)));
			popupText.children[i].content = definitions[i];
			popupText.fillColor = 'black';
		}
			popupText.position = (700, 700);
			rectangles.position = (700, 700);
			path.visible = true;
			//path.add(656,610);

			console.log(popupText);

			// Very strong evidence of pathogenicity
			/*var PVS1 = "PVS1: Null variant (nonsense, frameshift, canonical +/−1 or 2 splice sites, initiation codon, single or multi-exon deletion) in a gene where loss of function (LOF) is a known mechanism of disease";

			// Strong evidence of pathogenicity

			var PS1 = "PS1: Same amino acid change as a previously established pathogenic variant regardless of nucleotide change";

			var PS2 = "PS2: De novo (both maternity and paternity confirmed) in a patient with the disease and no family history";

			var	PS3 = 'PS3: Well-established in vitro or in vivo functional studies supportive of a damaging effect on the gene or gene product';

			var	PS4 = 'PS4: The prevalence of the variant in affected individuals is significantly increased compared to the prevalence in controls';

			// Moderate evidence of pathogenicity

			var PM1 = 'PM1: Located in a mutational hot spot and/or critical and well-established functional domain (e.g. active site of an enzyme) without benign variation';

			var PM2 = 'PM2: Absent from controls (or at extremely low frequency if recessive) (see Table 6) in Exome Sequencing Project, 1000 Genomes or ExAC';

			var PM3 = 'PM3: For recessive disorders, detected in trans with a pathogenic variant';

			var PM4 = 'PM4: Protein length changes due to in-frame deletions/insertions in a non-repeat region or stop-loss variants';

			var PM5 = 'PM5: Novel missense change at an amino acid residue where a different missense change determined to be pathogenic has been seen before';

			var PM6 = 'PM6: Assumed de novo, but without confirmation of paternity and maternity';

			// Supporting evidence of pathogenicity

			var PP1 = 'PP1: Co-segregation with disease in multiple affected family members in a gene definitively known to cause the disease';

			var PP2 = 'PP2: Missense variant in a gene that has a low rate of benign missense variation and where missense variants are a common mechanism of disease';

			var PP3 = 'PP3: Multiple lines of computational evidence support a deleterious effect on the gene or gene product (conservation, evolutionary, splicing impact, etc)';

			var PP4 = 'PP4: Patient’s phenotype or family history is highly specific for a disease with a single genetic etiology';

			var PP5 = 'PP5: Reputable source recently reports variant as pathogenic but the evidence is not available to the laboratory to perform an independent evaluation';

			// Stand-Alone evidence of benign impact

			var BA1 = 'BA1: Allele frequency is above 5% in Exome Sequencing Project, 1000 Genomes, or ExAC';

			// Strong evidence of benign impact

			var BS1 = 'BS1: Allele frequency is greater than expected for disorder';

			var BS2 = 'BS2: Observed in a healthy adult individual for a recessive (homozygous), dominant (heterozygous), or X-linked (hemizygous) disorder with full penetrance expected at an early age';

			var BS3 = 'BS3: Well-established in vitro or in vivo functional studies shows no damaging effect on protein function or splicing';

			var BS4 = 'BS4: Lack of segregation in affected members of a family';

			// Supporting evidence of benign impact

			var BP1 = 'BP1: Missense variant in a gene for which primarily truncating variants are known to cause disease';

			var BP2 = 'BP2: Observed in trans with a pathogenic variant for a fully penetrant dominant gene/disorder; or observed in cis with a pathogenic variant in any inheritance pattern';

			var BP3 = 'BP3: In-frame deletions/insertions in a repetitive region without a known function';

			var BP4 = 'BP4: Multiple lines of computational evidence suggest no impact on gene or gene product (conservation, evolutionary, splicing impact, etc)';

			var BP5 = 'BP5: Variant found in a case with an alternate molecular basis for disease';

			var BP6 = 'BP6: Reputable source recently reports variant as benign but the evidence is not available to the laboratory to perform an independent evaluation';

			var BP7 = 'BP7: A synonymous (silent) variant for which splicing prediction algorithms predict no impact to the splice consensus sequence nor the creation of a new splice site AND the nucleotide is not highly conserved';*/

			//const def = [PVS1,PS1,PS2,PS3,PS4,PM1,PM2,PM3,PM4,PM5,PM6,PP1,PP2,PP3,PP4,PP5,"BA1",BS1,BS2,BS3,BS4,BP1,BP2,BP3,BP4,BP4,BP5,BP6,BP7];
			//const intersection = def.filter(value => definitions.includes(value));
			//console.log(intersection)

			for(i = 0; i < definitions.length; i++){
				popupText.children[i].onClick = function(event){
					this.strokeColor = 'red';
					/*var text = new PointText(new Point(650, 625));
					text.justification = 'center';
					text.fillColor = 'white';
					text.content = intersection;*/
				}
			}
		}

		/*
		mypath.onClick = function(event){
			//tool.attach();
			//controlDrag();
			tool = new Tool();
			tool.fixedDistance = 25;
		}*/
		
		//function controlDrag(){

			rectangles.onMouseDrag = function(event) {
				this.position = event.point;
				popupText.position = event.point;
				path.removeSegment(count);
				path.add(x,y);
				path.add(event.point.x - 25, event.point.y);
				path.sendToBack();
				count++;
				//tool.detach();
			}
		//}
		//console.log(popupText);

		/*for(i =0; i<definitions.length; i++){
			popupText.children[i].onClick = function(event){
			this.strokeColor = 'red';
		}
		}*/
	}
}

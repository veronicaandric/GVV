class Menu {
	constructor(menuOpts) {
		console.log(menuOpts)
		return this.initMenu(menuOpts);
	}

	initMenu(menuOpts, user) {
		if(!menuOpts.data){
			return null;
		}

		let menu = new Group({ name: 'menu' });

		let options = Object.keys(menuOpts.data); 
		let arcAngle = 0;
		let currFiberAngle = 0;
		let innerRadius = 115;

		options.forEach( (option, i) => {

			//reference circle for drawing menu
			let menuRef = new Path.Circle({ center: view.center, radius: (innerRadius + 90)/*175*/, name: 'menuRef' });
			menuRef.remove();

			//reference circle for drawing arc names
			let textRef = new Path.Circle({ center: view.center, radius: (innerRadius + 45)/*130*/, name: 'textRef' });
			textRef.strokeWidth = 3;
			textRef.strokeColor = new Color(0, 0, 0, 1.0);;
			menu.addChild( textRef );
			textRef.remove();

			//draw menu bounds
			if( !menu.children['menuBounds'] ) {
				menu.addChild( this.getMenuBounds(menuRef) );
			}

			//get arc length and arc text position
			let arcParameters = this.getArcParameters({
				menuRef_length: menuRef.length,
				textRef_length: textRef.length,
				numArcs: options.length,
				option: option,
				arcType: ''
			})

			//create experimental group arc
			menu.addChild( this.createArc({
					option: option, 
					menuRef: menuRef, 
					textRef: textRef, 
					numArcs: options.length, 
					arcLength: arcParameters.arcLength, 
					arcAngle: arcAngle, 
					textPos: arcParameters.textPos, 
					innerRadius: innerRadius, 
					pathogenicity: menuOpts.data[option]['pathogenicity'],
					arcType: ''
				})
			)

			// get arc rotation angle for next arc
			arcAngle = this.getArcAngle(option, arcAngle, '', options.length);
		})

		return menu;
	}

	getArcParameters(args) {
		let arcLength = 0;
		let textPos = 0;

		if(args.numArcs > 1) {
			arcLength = args.menuRef_length/args.numArcs;
			textPos = args.textRef_length/args.numArcs;
		}
		else {
			textPos = args.textRef_length;
		}

		return { arcLength: arcLength, textPos: textPos };
	}

	getArcAngle(option, arcAngle, arcType, numArcs) {
		let angle = 0;

		angle = arcAngle + (360/numArcs);

		return angle;
	}

	createArc(args) {
		//init arc
		var tempGroupArc = new Path();
		tempGroupArc.moveTo(args.menuRef.position);
		tempGroupArc.lineTo(args.menuRef.getPointAt(0));

		if( args.numArcs > 1 ){
			tempGroupArc.arcTo( args.menuRef.getPointAt(args.arcLength/2), args.menuRef.getPointAt(args.arcLength) );
			tempGroupArc.closePath();
			tempGroupArc.rotate( args.arcAngle, args.menuRef.position );	
		}
		else{
			tempGroupArc.arcTo(args.menuRef.getPointAt( args.menuRef.length / 2 ), args.menuRef.getPointAt( args.menuRef.length - 0.1 ));
			tempGroupArc.closePath()
		}

		//style arc
		let groupArc = this.styleArc( tempGroupArc, args.menuRef, args.innerRadius, args.pathogenicity );
		groupArc.name = args.option + '_arc';

		//arc text
		let arcText = this.createArcText(args.option, args.textRef, args.textPos, args.arcAngle);

		let completeArc = new Group({ name: args.option + '_completeArc', children: [groupArc, arcText] });

		this.addTouchEvents(completeArc, groupArc, args.user);

		return completeArc;
	}

	styleArc(tempGroupArc, menuRef, innerRadius, pathogenicity) {
		tempGroupArc.strokeColor = new Color(0, 0, 0, 1.0);
		tempGroupArc.strokeWidth = 0.3;
		tempGroupArc.fillColor = { hue: 50, saturation: 1, brightness: 0.8, alpha: 0.7 };

		//inner cutout for tangible
		let cutout = new Path.Circle({ center: menuRef.position, radius: innerRadius });
		let groupArc = tempGroupArc.subtract( cutout );

		tempGroupArc.remove();
		cutout.remove();

		return groupArc;
	}

	createArcText(option, textRef, textPos, arcAngle) {
		let arcText = new PointText({
		    point: [textRef.getPointAt(textPos/2).x + 3, textRef.getPointAt(textPos/2).y - (option.split('\n').length * 6)], //center text y-pos using #lines as offset
		    content: option,
		    fillColor: new Color(0, 0, 0, 1.0),
		    fontFamily: 'Calibri',
		    justification: 'center',
		    fontSize: '1em',
		    fontWeight: 'bold',
		    name: 'arcText',
		    rotation: 270 + (((textPos/2)/textRef.length)*360)
		});
		arcText.rotate( arcAngle, textRef.position );

		return arcText;
	}

	addTouchEvents(completeArc, groupArc, user) {
		// console.log(completeArc.name)
		completeArc.on({
        	mousedown: event => {
      		groupArc.fillColor.brightness = 1.0;
        	},
        	mouseup: event => {
				var pos = user.getMenu().position;

				//remove menu
				// scene.remove('menu' + user.getID());

				switch(completeArc.name.replace('_completeArc', '')){
					
					case 'User':
					case 'Collaboration':
					case 'Histogram':
						//have to update through socket because TUIOMANAGER is not accessible through the MENU class
						let mode = completeArc.name.replace('_completeArc', '');
						sendToServer({ cmd: 'setMasterMode', target: 'table', data: { userID: user.getID(), mode: mode } });
						sendToServer({ cmd: 'setMasterMode', target: 'mobile', data: { userID: user.getID(), mode: mode } });
					break;

					case 'normalized':
						user.updateMenu({ mode: 'default', x: pos.x, y: pos.y, options: user.getGroupNames(), normalization: true });
						sendToServer({ cmd: 'updatePage', target: 'mobile', data: { id: user.getID(), name: 'fiberMenu' } });
					break;
					
					case 'non-normalized':
						user.updateMenu({ mode: 'default', x: pos.x, y: pos.y, options: user.getGroupNames(), normalization: false });
						sendToServer({ cmd: 'updatePage', target: 'mobile', data: { id: user.getID(), name: 'fiberMenu' } });
					break;

					case 'Unreplicated\nLength':
						user.getAllGroups().forEach( group => { group.sortFibers('unreplicatedLength') });
						user.updateMenu({ mode: 'default', x: pos.x, y: pos.y, options: user.getGroupNames() });
					break;

					case 'Fork\nLength':
						user.getAllGroups().forEach( group => { group.sortFibers('forkLength') });
						user.updateMenu({ mode: 'default', x: pos.x, y: pos.y, options: user.getGroupNames() });
					break;

					case 'Replicated\nLength':
						user.getAllGroups().forEach( group => { group.sortFibers('replicatedLength') });
						user.updateMenu({ mode: 'default', x: pos.x, y: pos.y, options: user.getGroupNames() });
					break;

					case 'Total\nLength':
						user.getAllGroups().forEach( group => { group.sortFibers('totalLength') });
						user.updateMenu({ mode: 'default', x: pos.x, y: pos.y, options: user.getGroupNames() });
					break;

					case 'Explore\nFibers':
						user.updateMenu({ subMode: 'explore', x: pos.x, y: pos.y, options: ['Back'] });
						sendToServer({ cmd: 'updateMenuHeading', target: 'mobile', data: { userID: user.getID(), name: 'Explore Fibers' } });

						// canvasZoom.activate();
						user.getAlternateCanvas().activate();
						var instructions = new PointText({
						   point: [ view.bounds.centerX, view.bounds.bottom - 10 ],
						   content: 'Rotate actible to select fiber for exploration.',
						   fillColor: new Color(0, 0, 0, 1),
						   fontFamily: 'Calibri',
						   fontWeight: 'normal',
						   justification: 'center',
						   fontSize: '1.5em',
						   name: 'instructions'
						});
						canvasMain.activate();
					break;

					case 'Save\nSnapshot':
						user.updateMenu({ subMode: 'explore', x: pos.x, y: pos.y, options: ['Back', 'Save\nSnapshot'] });

						//get exploration fiber
						let explorationFiber = user.getMTmanager().getExplorationFiber();
						
						if(explorationFiber){
							//activate exploration canvas
							// canvasZoom.activate();
							user.getAlternateCanvas().activate();

							//get snapshot segment of exploration fiber
							let snapshotSegments = [];
							explorationFiber.children.forEach( segment => {
								if( segment.isInside(view.bounds) ){
									snapshotSegments.push(segment);
								}
							})

							//create snapshot
							let numSnapshots = user.getSelectedFibers(user.getSelectedFiberIndex()).getSnapshots().length;
							let dataPath = null;
							
							if(explorationFiber.data.subgroup === ''){
								dataPath = explorationFiber.data.exp + '/' + explorationFiber.name.replace('fiber_','').replace('_extended', '') + '.txt';
							}
							else{
								dataPath = explorationFiber.data.exp + '/' + explorationFiber.data.subgroup + '/' + explorationFiber.name.replace('fiber_','').replace('_extended', '') + '.txt';
							}

							user.getSelectedFibers(user.getSelectedFiberIndex())
								.createSnapshot(
									numSnapshots,
									user.getFiberData()[ explorationFiber.data.exp ][ dataPath ].extended,
									snapshotSegments[0].data.start, 
									snapshotSegments[snapshotSegments.length-1].data.end
									);

							//re-draw fibers on exploration canvas
							// sendToServer({ cmd: 'initFiberExplore', target: 'table', data: { userID: user.getID() } });
							user.updateFiberExploration();

							sendToServer({ 
								cmd: 'addSnapshot', 
								target: 'wall', 
								data: { 
									userID: user.getID(), 
									fiber: {
			                     index: user.getSelectedFiberIndex(),
			                     numSnapshots: numSnapshots,
			                     startPixel: snapshotSegments[0].data.start,
			                     endPixel: snapshotSegments[snapshotSegments.length-1].data.end,
			                     data: user.getFiberData()[ explorationFiber.data.exp ][ dataPath ].extended
			                  }
			               } 
							});
						}
					break;

					case 'Adjust\nThresholds':
						user.updateMenu({ subMode: 'thresholds', x: pos.x, y: pos.y, options: ['Back'] });
						sendToServer({ cmd: 'updateMenuHeading', target: 'mobile', data: { userID: user.getID(), name: 'Adjust Thresholds' } });

						// canvasZoom.activate();
						user.getAlternateCanvas().activate();
						var instructions = new PointText({
						   point: [ view.bounds.centerX, view.bounds.bottom - 10 ],
						   content: 'Rotate actible to select fiber for adjusting thresholds.',
						   fillColor: new Color(0, 0, 0, 1),
						   fontFamily: 'Calibri',
						   fontWeight: 'normal',
						   justification: 'center',
						   fontSize: '1.5em',
						   name: 'instructions'
						});
						canvasMain.activate();
						
					break;

					case 'Replicated\nThreshold':
					case 'Protein 1\nThreshold':
					case 'Protein 2\nThreshold':
					case 'Fork Pixels in\nReplicated\nZone':
					case 'Fork Pixels in\nUnreplicated\nZone':
					case 'Smoothing\nValue':
						user.updateMenu({
							subMode: 'thresholds2', x: pos.x, y: pos.y, options: ['Back', 'Update\n' + completeArc.name.replace('_completeArc', '')]
						});
						sendToServer({ cmd: 'updateMenuHeading', target: 'mobile', data: { userID: user.getID(), name: completeArc.name.replace('_completeArc', '') } });
						
						if(user.getSelectedFiberIndex()){
							user.createThresholdsModifier( completeArc.name.replace('_completeArc', ''), user.getSelectedFibers(user.getSelectedFiberIndex()) );
						}
						else{
							user.createThresholdsModifier( completeArc.name.replace('_completeArc', '') );
						}
					break;

					case 'Update\nReplicated\nThreshold':
					case 'Update\nProtein 1\nThreshold':
					case 'Update\nProtein 2\nThreshold':
					case 'Update\nFork Pixels in\nReplicated\nZone':
					case 'Update\nFork Pixels in\nUnreplicated\nZone':
					case 'Update\nSmoothing\nValue':
						if( (scene.getMode() === 'tutorial') || (scene.getMode() === 'main' && user.getMenu('mode') === 'thresholdMenu') ){
							user.updateMenu({ subMode: 'thresholds', x: pos.x, y: pos.y, options: ['Replicated\nThreshold', 'Protein 1\nThreshold', 
								'Protein 2\nThreshold', 'Fork Pixels in\nReplicated\nZone', 'Fork Pixels in\nUnreplicated\nZone', 'Smoothing\nValue'] 
							});
						}
						else{
							user.updateMenu({ subMode: 'thresholds', x: pos.x, y: pos.y, options: ['Back', 'Replicated\nThreshold', 'Protein 1\nThreshold', 
								'Protein 2\nThreshold', 'Fork Pixels in\nReplicated\nZone', 'Fork Pixels in\nUnreplicated\nZone', 'Smoothing\nValue'] 
							});
							sendToServer({ cmd: 'updateMenuHeading', target: 'mobile', data: { userID: user.getID(), name: 'Adjust Thresholds' } });
						}

						//activate adjustment canvas
						// canvasZoom.activate();
						user.getAlternateCanvas().activate();

						//get threshold to be modified & parse new threshold value
						let thresholdType = completeArc.name.replace('Update\n', '').replace('_completeArc', '');
						let valueArr = scene.getItemByName('currVal').content.split(' ');
						let newVal = Number(valueArr[valueArr.length-1]);

						//apply new threshold value to tutorial fiber
						if( scene.getMode() === 'tutorial' ){
							user.setThresholds(newVal, thresholdType);
							sendToServer({ cmd: 'getData', target: 'R', data: { thresholds: user.getThresholds(), group: 'tutorial', file: 'tut_data.txt' } });
						}
						else{
							//apply new threshold value to single fiber and send to R for analysis
							if( user.getSelectedFiberIndex() !== null ){
								user.getSelectedFibers(user.getSelectedFiberIndex()).setThresholds(newVal, thresholdType);
								sendToServer({ 
									cmd: 'getData', target: 'R', 
									data: { 
										userID: user.getID(),
										thresholds: user.getSelectedFibers(user.getSelectedFiberIndex()).getThresholds(), 
										group: user.getSelectedFibers(user.getSelectedFiberIndex()).getExp(), 
										file: user.getSelectedFibers(user.getSelectedFiberIndex()).getSubgroup() + '/' + 
												user.getSelectedFibers(user.getSelectedFiberIndex()).getID() + '.txt'
									} 
								});
							}
							//apply new threshold value to all fibers
							//re-analysis of fibers is done after user confirms via mobile menu
							else{
								user.setThresholds(newVal, thresholdType);
								sendToServer({ 
									cmd: 'updateMenuHeading', target: 'mobile', 
									data: { userID: user.getID(), name: thresholdType, subMode: user.getMenu('subMode') } 
								});
							}
						}
						
						//reset scene
						scene.removeAll();

						//activate main canvas
						canvasMain.activate();
					break;

					case 'Relocate\nFibers':
						user.updateMenu({ subMode: 'relocate', x: pos.x, y: pos.y, options: ['Back'] });
						sendToServer({ cmd: 'updateMenuHeading', target: 'mobile', data: { userID: user.getID(), name: 'Relocate Fibers' } });

						// canvasZoom.activate();
						user.getAlternateCanvas().activate();
						var instructions = new PointText({
						   point: [ view.bounds.centerX, view.bounds.bottom - 10 ],
						   content: 'Rotate actible to select fiber for relocation.',
						   fillColor: new Color(0, 0, 0, 1),
						   fontFamily: 'Calibri',
						   fontWeight: 'normal',
						   justification: 'center',
						   fontSize: '1.5em',
						   name: 'instructions'
						});
						canvasMain.activate();
					break;

					case 'Confirm\nRelocation':
						sendToServer({ cmd: 'confirmRelocation', target: 'wall', 
							data: { userID: user.getID(), currIndex: user.getSelectedFiberIndex(), newIndex: user.getFiberRelocateIndex() }
						});
						sendToServer({ cmd: 'updateMenuHeading', target: 'mobile', data: { userID: user.getID(), name: '' } });

						user.updateSelectedFibers({ type: 'relocate', currIndex: user.getSelectedFiberIndex(), newIndex: user.getFiberRelocateIndex() });

						//activate alternate canvas
						// canvasZoom.activate();
						user.getAlternateCanvas().activate();
						user.setSelectedFiberIndex(null);
						user.setFiberRelocateIndex(null);
						scene.removeAll();
						canvasMain.activate();

						user.updateMenu({ subMode: null, x: pos.x, y: pos.y, options: ['Explore\nFibers', 'Relocate\nFibers', 'Adjust\nThresholds'] });
					break;

					case 'Back':
						//if click 'back' during fiber exploration
						if( user.getMenu('subMode') === 'explore' ) {
							user.updateMenu({ subMode: null, x: pos.x, y: pos.y, options: ['Explore\nFibers', 'Relocate\nFibers', 'Adjust\nThresholds'] });
							sendToServer({ cmd: 'updateMenuHeading', target: 'mobile', data: { userID: user.getID(), name: '' } });

							//remove exploration fiber & clear exploration canvas
							// if(hammer.getExplorationFiber()){
								// canvasZoom.activate();
								user.getAlternateCanvas().activate();
								user.setSelectedFiberIndex(null);
								scene.removeAll();
								user.getMTmanager().resetExplorationFiber();
								canvasMain.activate();
							// }
						}
						//if click 'back' during fiber relocation
						else if( user.getMenu('subMode') === 'relocate' ) {
							user.updateMenu({ subMode: null, x: pos.x, y: pos.y, options: ['Explore\nFibers', 'Relocate\nFibers', 'Adjust\nThresholds'] });
							sendToServer({ cmd: 'updateMenuHeading', target: 'mobile', data: { userID: user.getID(), name: '' } });
							sendToServer({ cmd: 'redrawUserFibers', target: 'wall', data: { userID: user.getID() } });
							// sendToServer({ cmd: 'removeFiberBg', target: 'wall', data: { userID: user.getID(), fiber: { index: user.getSelectedFiberIndex() }}});

							// canvasZoom.activate();
							user.getAlternateCanvas().activate();
							user.setSelectedFiberIndex(null);
							user.setFiberRelocateIndex(null);
							scene.removeAll();
							canvasMain.activate();
						}
						//if click 'back' during threshold manipulation
						else if( user.getMenu('subMode') === 'thresholds' ) {
							user.updateMenu({ subMode: null, x: pos.x, y: pos.y, options: ['Explore\nFibers', 'Relocate\nFibers', 'Adjust\nThresholds'] });
							sendToServer({ cmd: 'updateMenuHeading', target: 'mobile', data: { userID: user.getID(), name: '' } });

							// canvasZoom.activate();
							user.getAlternateCanvas().activate();
							user.setSelectedFiberIndex(null);
							scene.removeAll();
							canvasMain.activate();
						}
						/*else if( user.getMenu('subMode') === 'Replicated\nThreshold' || user.getMenu('subMode') === 'Protein 1\nThreshold' ||
							user.getMenu('subMode') === 'Protein 2\nThreshold' || user.getMenu('subMode') === 'Fork Pixels in\nReplicated Zone' ||
							user.getMenu('subMode') === 'Fork Pixels in\nUnreplicated Zone' || user.getMenu('subMode') === 'Smoothing\nValue' ) {*/
						else if( user.getMenu('subMode') === 'thresholds2' ) {
							if( user.getMenu('mode') === 'thresholdMenu') {
								user.updateMenu({ subMode: 'thresholds', x: pos.x, y: pos.y, options: ['Replicated\nThreshold', 'Protein 1\nThreshold', 
									'Protein 2\nThreshold', 'Fork Pixels in\nReplicated\nZone', 'Fork Pixels in\nUnreplicated\nZone', 'Smoothing\nValue'] 
								});
							}
							else {
								user.updateMenu({ subMode: 'thresholds', x: pos.x, y: pos.y, options: ['Back', 'Replicated\nThreshold', 'Protein 1\nThreshold', 
									'Protein 2\nThreshold', 'Fork Pixels in\nReplicated\nZone', 'Fork Pixels in\nUnreplicated\nZone', 'Smoothing\nValue'] 
								});
								sendToServer({ cmd: 'updateMenuHeading', target: 'mobile', data: { userID: user.getID(), name: 'Adjust Thresholds' } });

								// canvasZoom.activate();
							}

							user.getAlternateCanvas().activate();
							scene.removeAll();	
							canvasMain.activate();
						}
					break;

					default:
						if( user.getAllSubgroupNames().includes( completeArc.name.replace('_completeArc', '') ) ){
		         			let selectedSubgroup = null;

		         			//recursively get selected subgroup
		         			user.getAllGroups().forEach( exp => {
		         				
		         				let subgroups = exp.getAllSubgroups();
		         				
		         				let getSelecetedSubgroup = children => {
		         					children.forEach( child => {
		         						if( child.name === completeArc.name.replace('_completeArc', '') ){
			         						// console.log(child);
			         						selectedSubgroup = child;
			         					}
			         					else{
			         						if( child.hasOwnProperty('depth') ) {
			         							getSelecetedSubgroup(child.children);
			         						}
			         					}
		         					})
		         				}
		         				
		         				getSelecetedSubgroup(subgroups);
		         			})

		         			//get all fibers from selected subgroup and its nested subgroups
		         			let selectedSubgroupFibers = [];

		         			let getSelectedSubgroupFibers = children => {
		         				children.forEach( child => {
			         				if( child.hasOwnProperty('depth') ){
			         					getSelectedSubgroupFibers(child.children);
			         				}
			         				else{
			         					selectedSubgroupFibers.push(child);
			         				}
			         			});
		         			}

		         			if(selectedSubgroup){
		         				getSelectedSubgroupFibers(selectedSubgroup.children);
		         			}

		         			//check if all subgroup fibers already selected--if so, deselect all
		         			// --> this could be done by checking the user menu or the user class
		         			// --> the latter is used below
		         			// --> simple test is to check legth of selected fibers array
		         			// --> since a fiber can only be selected once
		         			// let check = false; // F: all fibers have not been already selected

		         			if( selectedSubgroupFibers.length === user.getSelectedFibers().length ){
		         				// check = true;
		         				//deselect all fibers
		         				selectedSubgroupFibers.forEach( fiber => {
		         					//remove selected fiber highlight
		         					user.getMenu().getItem({
		         						data: val => {
											if(val){
												return (val.exp === fiber.getExp()) && (val.subgroup === fiber.getSubgroup());
											}
										},
										name: val => { 
											if(val){ 
												return val.includes(fiber.getName());
											}
										}
									}).selected = false;

		         					// remove fiber from user selected fibers
									user.updateSelectedFibers({ 
										type: 'remove', 
										fiber: { 
											name: fiber.getName(), 
											exp: fiber.getExp(),
											subgroup: fiber.getSubgroup(),
											thresholds: fiber.getThresholds()
										} 
									});
		         				})
			         				
		         			}
		         			else{
		         				//add all fibers that have not already been selected
		         				selectedSubgroupFibers.forEach( function(fiber) {
		         					if( !this.includes(fiber.name) ){

		         						//highlight selected fiber
		         						user.getMenu().getItem({
			         						data: val => {
												if(val){
													return (val.exp === fiber.getExp()) && (val.subgroup === fiber.getSubgroup());
												}
											},
											name: val => { 
												if(val){ 
													return val.includes(fiber.getName());
												}
											}
										}).selected = true;

		         						// add fiber to user selected fibers
										user.updateSelectedFibers({ 
											type: 'add', 
											fiber: { 
												name: fiber.getName(), 
												exp: fiber.getExp(),
												subgroup: fiber.getSubgroup(),
												thresholds: fiber.getThresholds()
											} 
										});
		         					}
		         				}, user.getSelectedFibers().map( fiber => { return fiber.getName() } ) );
		         				
		         			}
		         			
						}
						else{
							user.updateMenu({ mode: completeArc.name.replace('_completeArc', ''), x: pos.x, y: pos.y, options: user.getGroupNames() });
		         			sendToServer({ cmd: 'updateMenuHeading', target: 'mobile', data: { userID: user.getID(), name: user.getMenu('mode') } });
		         		}
					break;
				}
				// if(completeArc.name.replace('_completeArc', '') === 'normalized'){	
				// 	user.updateMenu({ mode: 'default', x: pos.x, y: pos.y, options: user.getGroupNames(), normalization: true });
				// 	sendToServer({ cmd: 'updatePage', target: 'mobile', data: { id: user.getID(), name: 'fiberMenu' } });
				// }

				// else if(completeArc.name.replace('_completeArc', '') === 'non-normalized'){
				// 	user.updateMenu({ mode: 'default', x: pos.x, y: pos.y, options: user.getGroupNames(), normalization: false });
				// 	sendToServer({ cmd: 'updatePage', target: 'mobile', data: { id: user.getID(), name: 'fiberMenu' } });
				// }

				// else if(completeArc.name.replace('_completeArc', '') === 'Unreplicated\nLength'){
				// 	user.getAllGroups().forEach( group => {
				// 		group.sortFibers('unreplicatedLength');
				// 	})

				// 	user.updateMenu({ mode: 'default', x: pos.x, y: pos.y, options: user.getGroupNames() });
				// }

				// else if(completeArc.name.replace('_completeArc', '') === 'Fork\nLength'){
				// 	user.getAllGroups().forEach( group => {
				// 		group.sortFibers('forkLength');
				// 	})

				// 	user.updateMenu({ mode: 'default', x: pos.x, y: pos.y, options: user.getGroupNames() });
				// }

				// else if(completeArc.name.replace('_completeArc', '') === 'Replicated\nLength'){
				// 	user.getAllGroups().forEach( group => {
				// 		group.sortFibers('replicatedLength');
				// 	})

				// 	user.updateMenu({ mode: 'default', x: pos.x, y: pos.y, options: user.getGroupNames() });
				// }
				
				// else if(completeArc.name.replace('_completeArc', '') === 'Total\nLength'){
				// 	user.getAllGroups().forEach( group => {
				// 		group.sortFibers('totalLength');
				// 	})

				// 	user.updateMenu({ mode: 'default', x: pos.x, y: pos.y, options: user.getGroupNames() });
				// }

				// else if(completeArc.name.replace('_completeArc', '') === 'Adjust\nThresholds'){
				// 	user.updateMenu({ 
				// 		subMode: 'thresholds', 
				// 		x: pos.x, 
				// 		y: pos.y, 
				// 		options: [
				// 			'Back', 
				// 			'Replicated\nThreshold', 
				// 			'Protein 1\nThreshold', 
				// 			'Protein 2\nThreshold', 
				// 			'Fork Pixels in\nReplicated Zone', 
				// 			'Fork Pixels in\nUnreplicated Zone', 
				// 			'Smoothing\nValue'
				// 		] 
				// 	});
				// 	sendToServer({ cmd: 'updateMenuHeading', target: 'mobile', data: { userID: user.getID(), name: 'Adjust Thresholds' } });
				// }

				//if click 'back' during threshold manipulation
				// else if(completeArc.name.replace('_completeArc', '') === 'Back' && user.getMenu('subMode') === 'thresholds') {
				// 	user.updateMenu({ subMode: null, x: pos.x, y: pos.y, options: ['Explore\nFibers', 'Relocate\nFibers', 'Adjust\nThresholds'] });
				// 	sendToServer({ cmd: 'updateMenuHeading', target: 'mobile', data: { userID: user.getID(), name: '' } });
				// }

				// else if(completeArc.name.replace('_completeArc', '').includes('Threshold')) {
				// 	user.updateMenu({ 
				// 		subMode: 'thresholds', 
				// 		x: pos.x, 
				// 		y: pos.y, 
				// 		options: ['Back', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] 
				// 	});
				// }

				// else if(completeArc.name.replace('_completeArc', '') === 'Explore\nFibers'){
				// 	user.updateMenu({ subMode: 'explore', x: pos.x, y: pos.y, options: ['Back', 'Save\nSnapshot'] });
				// 	sendToServer({ cmd: 'updateMenuHeading', target: 'mobile', data: { userID: user.getID(), name: 'Explore Fibers' } });
				// }

				//if click 'back' during fiber exploration
				// else if(completeArc.name.replace('_completeArc', '') === 'Back' && user.getMenu('subMode') === 'explore') {
				// 	user.updateMenu({ subMode: null, x: pos.x, y: pos.y, options: ['Explore\nFibers', 'Relocate\nFibers', 'Adjust\nThresholds'] });
				// 	sendToServer({ cmd: 'updateMenuHeading', target: 'mobile', data: { userID: user.getID(), name: '' } });

				// 	//remove exploration fiber & clear exploration canvas
				// 	if(hammer.getExplorationFiber()){
				// 		canvasZoom.activate();
				// 		user.updateSelectedFiberIndex(null);
				// 		scene.removeAll();
				// 		hammer.resetExplorationFiber();
				// 		canvasMain.activate();
				// 	}
				// }

				// else if(completeArc.name.replace('_completeArc', '') === 'Save\nSnapshot') {
				// 	user.updateMenu({ subMode: 'explore', x: pos.x, y: pos.y, options: ['Back', 'Save\nSnapshot'] });

				// 	//get exploration fiber
				// 	let explorationFiber = hammer.getExplorationFiber();
					
				// 	if(explorationFiber){
				// 		//activate exploration canvas
				// 		canvasZoom.activate();

				// 		//get snapshot segment of exploration fiber
				// 		let snapshotSegments = [];
				// 		explorationFiber.children.forEach( segment => {
				// 			if( segment.isInside(view.bounds) ){
				// 				snapshotSegments.push(segment);
				// 			}
				// 		})

				// 		//create snapshot
				// 		let numSnapshots = user.getSelectedFibers(user.getSelectedFiberIndex()).getSnapshots().length;
				// 		let dataPath = null;
						
				// 		if(explorationFiber.data.subgroup === ''){
				// 			dataPath = explorationFiber.data.exp + '/' + explorationFiber.name.replace('fiber_','').replace('_extended', '') + '.txt';
				// 		}
				// 		else{
				// 			dataPath = explorationFiber.data.exp + '/' + explorationFiber.data.subgroup + '/' + explorationFiber.name.replace('fiber_','').replace('_extended', '') + '.txt';
				// 		}

				// 		user.getSelectedFibers(user.getSelectedFiberIndex())
				// 			.createSnapshot(
				// 				numSnapshots,
				// 				fiberData[ explorationFiber.data.exp ][ dataPath ].extended,
				// 				snapshotSegments[0].data.start, 
				// 				snapshotSegments[snapshotSegments.length-1].data.end
				// 				);

				// 		//re-draw fibers on exploration canvas
				// 		sendToServer({ 
				// 			cmd: 'initFiberExplore', 
				// 			target: 'table', 
				// 			data: { 
				// 				userID: user.getID(), 
				// 				fiber: {
				// 					mode: user.getMenu('mode'),
				// 					subMode: user.getMenu('subMode'),
		  //                    name: explorationFiber.name.replace('fiber_','').replace('_extended', ''), 
		  //                    exp: explorationFiber.data.exp, 
		  //                    subgroup: explorationFiber.data.subgroup,
		  //                    index: explorationFiber.data.index 
		  //                 }
		  //              } 
				// 		});

				// 		sendToServer({ 
				// 			cmd: 'addSnapshot', 
				// 			target: 'wall', 
				// 			data: { 
				// 				userID: user.getID(), 
				// 				fiber: {
				// 					mode: user.getMenu('mode'),
				// 					subMode: user.getMenu('subMode'),
		  //                    name: explorationFiber.name.replace('fiber_','').replace('_extended', ''), 
		  //                    exp: explorationFiber.data.exp, 
		  //                    subgroup: explorationFiber.data.subgroup,
		  //                    index: user.getSelectedFiberIndex(),
		  //                    numSnapshots: numSnapshots,
		  //                    startPixel: snapshotSegments[0].data.start,
		  //                    endPixel: snapshotSegments[snapshotSegments.length-1].data.end,
		  //                    data: fiberData[ explorationFiber.data.exp ][ dataPath ].extended
		  //                 }
		  //              } 
				// 		});
				// 	}

					/*//test
					var dataPath = fiberToExplore.data.exp + '/' + fiberToExplore.data.subgroup + '/' + fiberToExplore.name.replace('fiber_','').replace('_extended', '') + '.txt'

					user.getFiberGroup( fiberToExplore.data.exp )
						.getFiberByName( fiberToExplore.name.replace('_extended', '') )
						.createExtendedFiber( fiberData[ fiberToExplore.data.exp ][ dataPath ].extended, null, snapshotSegments[0].data.start, snapshotSegments[snapshotSegments.length-1].data.end );

					let extendedFiber = user.getFiberGroup( fiberToExplore.data.exp )
						.getFiberByName( fiberToExplore.name.replace('_extended', '') )
						.getExtendedFiber();
					extendedFiber.bounds.width = view.bounds.width;
	            extendedFiber.position = [view.center.x, view.center.y + 20];
	            scene.add(extendedFiber);
	            //end test*/

					// canvasMain.activate();


				// }

				//if(completeArc.name.includes('exp')){
				// else{
				// 	user.updateMenu({ mode: completeArc.name.replace('_completeArc', ''), x: pos.x, y: pos.y, options: user.getGroupNames() });
		  //        sendToServer({ cmd: 'updateMenuHeading', target: 'mobile', data: { id: user.getID(), name: user.getMenu('mode') } });
				// }

	        	groupArc.fillColor.brightness = 0.8;
	      }
    	})
	}

	getFiberParameters(args) {
		let expBreak = 0.5;
		let arcLength = 0;
		let fiberAngle = 0;

		let tempFiberArc = new Path();
		tempFiberArc.moveTo(args.fiberRef.getPointAt(expBreak));

		if(args.arcType === 'exp'){
			if(args.numArcs > 1){
				if(args.user.getMenu('mode') === 'default'){
					arcLength = (args.groupFiberCount/args.totalFiberCount) * args.fiberRef.length;
					fiberAngle = ( (args.groupFiberCount/args.totalFiberCount)*360 / args.groupFiberCount);
				}
				else{
					if(args.user.getMenu('mode') === args.option){
						arcLength = args.fiberRef.length * args.selectedExpArcSize;
						fiberAngle = (360*args.selectedExpArcSize) / args.groupFiberCount;
					}
					else{
						arcLength = (args.groupFiberCount/args.totalFiberCount)*(args.fiberRef.length*(1 - args.selectedExpArcSize));
						fiberAngle = ((args.groupFiberCount/args.totalFiberCount)*(360*(1-args.selectedExpArcSize)))/args.groupFiberCount;
					}
				}
				tempFiberArc.arcTo( args.fiberRef.getPointAt((arcLength-expBreak)/2), args.fiberRef.getPointAt(arcLength-expBreak) );
				tempFiberArc.rotate( args.arcAngle, args.fiberRef.position );
				
			}
			else{
				tempFiberArc.arcTo(args.fiberRef.getPointAt( args.fiberRef.length / 2 ), args.fiberRef.getPointAt( args.fiberRef.length - 0.1 ));
				fiberAngle = ( (args.groupFiberCount/args.totalFiberCount)*360 / args.groupFiberCount);
			}			
		}
		else if(args.arcType === 'subgroup'){
			arcLength = (args.groupFiberCount/args.totalFiberCount) * args.fiberRef.length * args.selectedExpArcSize;
			fiberAngle = (360*args.selectedExpArcSize) / args.totalFiberCount;

			tempFiberArc.arcTo( args.fiberRef.getPointAt((arcLength-expBreak)/2), args.fiberRef.getPointAt(arcLength-expBreak) );
			tempFiberArc.rotate( args.arcAngle, args.fiberRef.position );
		}
		else{
		}

		tempFiberArc.remove();

		return { arc: tempFiberArc, angle: fiberAngle };
	}

	addFiber(i, option, fiber, groupFiberCount, tempFiberArc, currFiberAngle, user, drawingOpts) {

		let regions;
		user.getMenu('normalization') === true ? regions = fiber.getNormalizedRegions().clone() : regions = fiber.getRegions().clone();
		
		user.getSelectedFibers().forEach( selectedFiber => {
			if( regions.name.includes(selectedFiber.getName()) && (regions.data.exp === selectedFiber.getExp()) && (regions.data.subgroup === selectedFiber.getSubgroup()) ){
				regions.selected = true;
			}
		})

		// regions.name += ('_' + option + '_' + fiber.getSubgroup());
		regions.bounds.bottomCenter = tempFiberArc.getPointAt( (tempFiberArc.length / groupFiberCount) * (i+0.5) );
		regions.rotate( currFiberAngle - 90,  regions.bounds.bottomCenter);

		//make other experimental fibers thinner when expanding selected experiment
		if(drawingOpts){
			regions.children.forEach( item => {
           	if(item.name.includes('Protein')){
               item.strokeWidth = drawingOpts.proteinWidth;
           	}
           	else{
               item.strokeWidth = drawingOpts.fiberWidth;
           	}
       	})
		}

		return regions;
	}

	getMenuBounds(menuRef) {
		let menuBounds = new Group({
			name: 'menuBounds',
			children: [
				new Path.Line({
				  	from: [ menuRef.position.x, menuRef.position.y - 450 ],
				   	to: [ menuRef.position.x, menuRef.position.y + 450 ],
				   	strokeColor: new Color(0, 0, 0, 0),
				   	strokeWidth: 1,
				   	name: 'verticalBounds'
				}),
				new Path.Line({
				  	from: [ menuRef.position.x - 450, menuRef.position.y ],
				   	to: [ menuRef.position.x + 450, menuRef.position.y ],
				   	strokeColor: new Color(0, 0, 0, 0),
				   	strokeWidth: 1,
				   	name: 'horizontalBounds'
				})
			]
		});
		
		return menuBounds;
	}

/***************************/
/*	initMenu(mode, menuOpts) {
		var menu = new Group({ name: 'menu' + this.ID });
		
		var options = null;
		var totalFiberCount = 0;
		var arcAngle = 0;
		var fiberAngle = 0;
		var currFiberAngle = 0;
		var arcLength = 0;
		var textPos = 0;

		menuOpts.hasOwnProperty('options') ? options = menuOpts.options : options = this.groupNames;

		if(this.menu.mode === 'default'){
			totalFiberCount = this.getTotalFiberCount();
		}
		if(this.menu.mode.includes('exp')){
			totalFiberCount = this.getTotalFiberCount() - this.getFiberGroup(this.menu.mode).getNumFibers();
		} 
		
		//draw menu
		//reference radius for drawing menu
		var menuRadius = new Path.Circle({
			center: [ menuOpts.x, menuOpts.y ],
		    radius: 150,
			name: 'menuRadius'
		});
		this.menu.length = menuRadius.length;
		menuRadius.remove();

		//reference radius for drawing arc names
		var textRadius = new Path.Circle({
			center: [ menuOpts.x, menuOpts.y ],
		    radius: 117,
			name: 'textRadius'
		});
		textRadius.remove();

		options.forEach( (option, i) => {

			if(this.menu.mode === 'default' || this.menu.mode.includes('exp')){
				
				var selectedGroupSize = 0.8//menuOpts.arcLength;//0.8; //selected group fills 80% of the menu; all other groups take up 20% of the menu
				
				//get group fiber count
				var group = this.getFiberGroup(option);
				var groupFiberCount = group.getNumFibers();

				//create group arc
				var tempGroupArc = new Path();
				tempGroupArc.moveTo(menuRadius.position);
				tempGroupArc.lineTo(menuRadius.getPointAt(0));

				if(options.length > 1){
					if(this.menu.mode === 'default'){
						arcLength = (groupFiberCount/totalFiberCount) * menuRadius.length;
						textPos = (groupFiberCount/totalFiberCount) * textRadius.length;
					}
					else{
						if(this.menu.mode === option){
							arcLength = menuRadius.length * selectedGroupSize;
							textPos = textRadius.length * selectedGroupSize;
						}
						else{
							arcLength = (groupFiberCount/totalFiberCount)*(menuRadius.length*(1 - selectedGroupSize));
							textPos = (groupFiberCount/totalFiberCount)*(textRadius.length*(1 - selectedGroupSize));
						}
					}
					tempGroupArc.arcTo( menuRadius.getPointAt(arcLength/2), menuRadius.getPointAt(arcLength) );
					tempGroupArc.closePath();
					tempGroupArc.rotate( arcAngle, menuRadius.position );	
				}
				else{
					tempGroupArc.arcTo(menuRadius.getPointAt( menuRadius.length / 2 ), menuRadius.getPointAt( menuRadius.length - 0.1 ));
					tempGroupArc.closePath()
					textPos = textRadius.length;
				}

				//style group arc
				tempGroupArc.strokeColor = new Color(0, 0, 0, 1.0);
				tempGroupArc.strokeWidth = 0.3;
				tempGroupArc.fillColor = { hue: 50 * this.ID, saturation: 1, brightness: 0.8, alpha: 0.7 };//new Color(155/255, 89/255, 182/255, 1.0);

				
				let cutout = new Path.Circle({ center: menuRadius.position, radius: 85});
				var groupArc = tempGroupArc.subtract( cutout );
				groupArc.name = option + '_arc';

				tempGroupArc.remove();
				cutout.remove();

				//arc text
				let arcText = new PointText({
				    point: textRadius.getPointAt(textPos/2),
				    content: option,
				    fillColor: new Color(0, 0, 0, 1.0),
				    fontFamily: 'Calibri',
				    justification: 'center',
				    fontSize: '0.7em',
				    name: 'arcText',
				    rotation: 180 + (((textPos/2)/textRadius.length)*360)
				});
				arcText.rotate( arcAngle, menuRadius.position );
			

				let completeArc = new Group({ name: option + '_completeArc', children: [groupArc, arcText] });
				menu.addChild(completeArc);
				
				//arc selection touch event
				completeArc.on({
                    mousedown: event => {
                    	groupArc.fillColor.brightness = 1.0;
                    },
                    mouseup: event => {
                    	// var user = tuio.getUser(this.ID);
						var pos = this.getMenu().position;

						scene.remove('menu' + this.ID);

						if(completeArc.name.includes('exp')){
							this.updateMenu({ mode: completeArc.name.replace('_completeArc', '') });
							this.initMenu({ x: pos.x, y: pos.y, norm: this.getMenu('normalization'), arcLength: 0.8 });

                            sendToServer({ cmd: 'updateMenuHeading', target: 'mobile', data: { id: this.getID(), name: this.getMenu('mode') } });
						}
                    	groupArc.fillColor.brightness = 0.8;
                    }
                })
				
				
				//reference radius for drawing fibers
				var fiberRadius = new Path.Circle({
					center: menuRadius.position,
				    radius: 155,
					name: 'fiberRadius'
				});
				fiberRadius.remove();

				var tempFiberArc = new Path();
				tempFiberArc.moveTo(fiberRadius.getPointAt(0));

				if(options.length > 1){
					if(this.menu.mode === 'default'){
						arcLength = (groupFiberCount/totalFiberCount) * fiberRadius.length;
						fiberAngle = ( (groupFiberCount/totalFiberCount)*360 / groupFiberCount);
					}
					else{
						if(this.menu.mode === option){
							arcLength = fiberRadius.length * selectedGroupSize;
							fiberAngle = (360*selectedGroupSize) / groupFiberCount;
						}
						else{
							arcLength = (groupFiberCount/totalFiberCount)*(fiberRadius.length*(1 - selectedGroupSize));
							fiberAngle = ((groupFiberCount/totalFiberCount)*(360*(1-selectedGroupSize)))/groupFiberCount;
						}
					}
					tempFiberArc.arcTo( fiberRadius.getPointAt(arcLength/2), fiberRadius.getPointAt(arcLength) );
					tempFiberArc.rotate( arcAngle, fiberRadius.position );
					
				}
				else{
					tempFiberArc.arcTo(fiberRadius.getPointAt( fiberRadius.length / 2 ), fiberRadius.getPointAt( fiberRadius.length - 0.1 ));
				}			
					
				tempFiberArc.remove();

				//add fibers to group arc
				group.getAllFibers().forEach( (fiber, j) => {
					currFiberAngle += fiberAngle;

					let regions;
					if(menuOpts.hasOwnProperty('norm')){
						menuOpts.norm === true ? regions = fiber.getNormalizedRegions().clone() : regions = fiber.getRegions().clone();
					}
					regions.name += ('_' + option);
					regions.bounds.bottomCenter = tempFiberArc.getPointAt( (tempFiberArc.length / groupFiberCount) * (j+0.5) );
					regions.rotate( currFiberAngle - 90,  regions.bounds.bottomCenter);

					menu.addChild(regions);
				})

				//prep for next iteration
				if(this.menu.mode === 'default'){
					arcAngle += (groupFiberCount/totalFiberCount)*360;
				}
				else if(this.menu.mode === option){
					arcAngle += 360*selectedGroupSize;
				}
				else{
					arcAngle += (groupFiberCount/totalFiberCount)*(360*(1-selectedGroupSize));
				}

			}

			//all other menus; not fiber menu
			else{
				//create group arc
				var tempGroupArc = new Path();
				tempGroupArc.moveTo(menuRadius.position);
				tempGroupArc.lineTo(menuRadius.getPointAt(0));

				if(options.length > 1){
					arcLength = menuRadius.length/options.length;
					tempGroupArc.arcTo( menuRadius.getPointAt(arcLength/2), menuRadius.getPointAt(arcLength) );
					tempGroupArc.closePath();
					tempGroupArc.rotate( arcAngle, menuRadius.position );

					textPos = textRadius.length/options.length;
				}
				else{
					tempGroupArc.arcTo(menuRadius.getPointAt( menuRadius.length / 2 ), menuRadius.getPointAt( menuRadius.length - 0.1 ));
					tempGroupArc.closePath()

					textPos = textRadius.length;
				}

				tempGroupArc.strokeColor = new Color(0, 0, 0, 1.0);
				tempGroupArc.strokeWidth = 0.3;
				tempGroupArc.fillColor = { hue: 50 * this.ID, saturation: 1, brightness: 0.8, alpha: 0.7 };//new Color(155/255, 89/255, 182/255, 1.0);

			
				let cutout = new Path.Circle({ center: menuRadius.position, radius: 85});
				var groupArc = tempGroupArc.subtract( cutout );
				groupArc.name = option + '_arc';

				tempGroupArc.remove();
				cutout.remove();

				//arc text
				let arcText = new PointText({
				    point: textRadius.getPointAt(textPos/2),
				    content: option,
				    fillColor: new Color(0, 0, 0, 1.0),
				    fontFamily: 'Calibri',
				    justification: 'center',
				    fontSize: '0.7em',
				    name: 'arcText',
				    rotation: 180 + (((textPos/2)/textRadius.length)*360)
				});
				arcText.rotate( arcAngle, menuRadius.position );

				let completeArc = new Group({ name: option + '_completeArc', children: [groupArc, arcText] });
				menu.addChild(completeArc);
				
				//arc selection touch event
				completeArc.on({
                    mousedown: event => {
                    	groupArc.fillColor.brightness = 1.0;
                    },
                    mouseup: event => {
                    	// var user = tuio.getUser(this.ID);
						var pos = this.getMenu().position;

						scene.remove('menu' + this.ID);

						if(completeArc.name.replace('_completeArc', '') === 'normalized'){	
							this.updateMenu({ normalization: true });
						}
						else if(completeArc.name.replace('_completeArc', '') === 'non-normalized'){
							this.updateMenu({ normalization: false });
						}
						else if(completeArc.name.replace('_completeArc', '') === 'Unreplicated\nLength'){
							this.getAllGroups().forEach( group => {
								group.getAllFibers().sort( (a,b) => {
									return b.getUnreplicatedLength() - a.getUnreplicatedLength();
								})
							})
						}
						else if(completeArc.name.replace('_completeArc', '') === 'Fork\nLength'){
							this.getAllGroups().forEach( group => {
								group.getAllFibers().sort( (a,b) => {
									return b.getForksLength() - a.getForksLength();
								})
							})
						}
						else if(completeArc.name.replace('_completeArc', '') === 'Replicated\nLength'){
							this.getAllGroups().forEach( group => {
								group.getAllFibers().sort( (a,b) => {
									return b.getReplicatedLength() - a.getReplicatedLength();
								})
							})
						}
						else if(completeArc.name.replace('_completeArc', '') === 'Total\nLength'){
							this.getAllGroups().forEach( group => {
								group.getAllFibers().sort( (a,b) => {
									return b.getTotalLength() - a.getTotalLength();
								})
							})
						}
						else if(completeArc.name.replace('_completeArc', '') === 'Explore\nFibers'){
							this.updateMenu({ subMode: 'explore' });
							this.initMenu({ x: pos.x, y: pos.y, options: ['Back'] });

							sendToServer({ cmd: 'updateMenuHeading', target: 'mobile', data: { id: this.getID(), name: 'Explore Fibers' } });
						}
						else if(completeArc.name.replace('_completeArc', '') === 'Relocate\nFibers'){
							this.updateMenu({ subMode: 'relocate' });
							this.initMenu({ x: pos.x, y: pos.y, options: ['Back'] });

							sendToServer({ cmd: 'updateMenuHeading', target: 'mobile', data: { id: this.getID(), name: 'Relocate Fibers' } });
						}
						else if(completeArc.name.replace('_completeArc', '') === 'Adjust\nThresholds'){
							this.updateMenu({ subMode: 'thresholds' });
							this.initMenu({ 
								x: pos.x, 
								y: pos.y, 
								options: ['Replicated\nThreshold', 'Protein 1\nThreshold', 'Protein 2\nThreshold', 'Pixels in\nReplicated\nZone', 
										'Pixels in\nUnreplicated\nZone', 'Smoothing\nValue', 'Back'] 
							});

							sendToServer({ cmd: 'updateMenuHeading', target: 'mobile', data: { id: this.getID(), name: 'Adjust Thresholds' } });
						}
						else{

						}

						//reset to fiber menu after click for all scenarios except when in wall mode
						if(this.getMenu('mode') !== 'wallMenu'){
							this.updateMenu({ mode: 'default' });
							this.initMenu({ x: pos.x, y: pos.y, norm: this.getMenu('normalization') });
							sendToServer({ cmd: 'updatePage', target: 'mobile', data: { id: this.getID(), name: 'fiberMenu' } });
                    	}
                    	groupArc.fillColor.brightness = 0.8;
                    }
                })

				arcAngle += (360/options.length);

			}
			
		})

		let menuBounds = new Group({
			name: 'menuBounds',
			children: [
				new Path.Line({
				  	from: [ menuRadius.position.x, menuRadius.position.y - 350 ],
				   	to: [ menuRadius.position.x, menuRadius.position.y + 350 ],
				   	strokeColor: new Color(0, 0, 0, 0),
				   	strokeWidth: 1,
				   	name: 'verticalBounds'
				}),
				new Path.Line({
				  	from: [ menuRadius.position.x - 350, menuRadius.position.y ],
				   	to: [ menuRadius.position.x + 350, menuRadius.position.y ],
				   	strokeColor: new Color(0, 0, 0, 0),
				   	strokeWidth: 1,
				   	name: 'horizontalBounds'
				})
			]
		});
		menu.addChild(menuBounds);
		// menu.remove();
		// menu.rotate(126, menuRadius.position);
		this.menu.vis = menu;
	}

*/
}
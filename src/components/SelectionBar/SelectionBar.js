class SelectionBar {
  constructor() {
    this.init();
  }

  init() {
    const selectionBar = $('.selection-bar');
    const numChromosomes = 24;

    for(let i=0; i<numChromosomes; i++) {
      let id = 'chromosome' + (i+1);
      let img = '<img id="'+ id +'" class="chromosome not-selected" src="../assets/karyotypes/chromosome' + (i+1) + '.jpg" />';
      let span = () => {
        let name;
        if(i === 22) {
          name = 'X';
        } else if(i === 23) {
          name = 'Y';
        } else {
          name = i + 1;
        }
        return '<span class="imgName">' + name + '</span>';
      }
      let div = '<div class="imgBlock">' + img + span() + '</div>';
      selectionBar.append(div);

      $('#'+id).on('click', () => {
        new Menu(appHelper.getData(i+1))
      })
    }
  }
}

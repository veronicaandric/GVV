$(document).ready(() => {
  // Get data
  $.getJSON('testing/Sample_Rare05_Dmg_RESULT_Copy.json').done((d) => {
    console.log(d);

    /* Init Karyotype Header */
    const selectionBar = $('#selection-bar');
    const numChromosomes = 24;

    for (let i = 0; i < numChromosomes; i++) {
      const id = `chromosome${i + 1}`;
      const img = `<img id='${id}' class='chromosome not-selected' src='assets/karyotypes/chromosome${i + 1}.jpg' />`;
      selectionBar.append(img);
    }

    /* Init PaperJS Scene */
    const canvasOpts = {
      height: $(document).height() - (selectionBar.height() * 5),
      width: $(document).width() - 25,
    };

    const scene = new SceneManager();
    const canvas = scene.initCanvas('canvas', canvasOpts);

    $('.chromosome').on('click', ev => initChromosome(ev.target.id, scene, d));
  });
});

const initChromosome = (id, scene, d) => {
  // add border
  // $('#' + id).hasClass('selected') ? $('#' + id).removeClass('selected').addClass('not-selected') : $('#' + id).addClass('selected').removeClass('not-selected')

  /* Reset all borders */
  const numChromosomes = 24;

  $('.chromosome').removeClass('selected').addClass('not-selected');

  $(`#${id}`).addClass('selected').removeClass('not-selected');


  scene.removeAll();

  const dataKey = id.replace('chromosome', '');
  const menuOpts = {
    data: d[dataKey],
  };
  const menu = new Menu(menuOpts);
};

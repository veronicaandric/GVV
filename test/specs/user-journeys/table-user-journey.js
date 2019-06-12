describe('The table page', () => {
  before(() => {
    browser.url('/pages/table.html');
  });

  it('should have the right title', () => {
    const title = browser.getTitle();
    expect(title).to.equal('GVV - Table');
  });

  it('should have a selection bar', () => {
    const selectionBar = $('.selection-bar');
    expect(selectionBar.isExisting()).to.be.true;
  });

  it('should have a canvas', () => {
    const canvas = $('<canvas>');
    expect(canvas.isExisting()).to.be.true;
    expect(canvas.getAttribute('id')).to.equal('canvas');
  });
});

describe('The selection bar', () => {
  let imgBlocks;

  before(() => {
    browser.url('/pages/table.html');
    imgBlocks = $$('.imgBlock');
  });

  it('should consist of 24 image blocks', () => {
    expect(imgBlocks.length).to.equal(24);
  });

  describe('Each image block', () => {
    it('should contain a chromosome image', () => {
      imgBlocks.forEach(block => {
        let img = block.$('.chromosome');
        expect(img.getTagName()).to.equal('img');
      });
    });

    it('should contain a chromoson label', () => {
      imgBlocks.forEach((block, i) => {
        let label = block.$('.imgName');

        if(i === 22) {
          expect(label.getText()).to.equal('X');
        } else if(i === 23) {
          expect(label.getText()).to.equal('Y');
        } else {
          expect(label.getText()).to.equal(String(i + 1));
        }
      });
    });
  });
});

describe('When I navigate to the landing page', () => {
  before(() => {
    // Navigate to base url specified in config (http://localhost:8080)
    browser.url('/');
  });

  it('should have the right title', () => {
    const title = browser.getTitle();
    expect(title).to.equal('GVV');
  });

  it('should have a header title', () => {
    const header = $('.header-title');
    expect(header.isExisting()).to.be.true;
    expect(header.getText()).to.equal('GGV');
  });

  it('should have a header subtitle', () => {
    const subHeader = $('.header-subTitle');
    expect(subHeader.isExisting()).to.be.true;
    expect(subHeader.getText()).to.equal('GENE VARIANT VALIDATION');
  });

  it('should have a mobile-page link', () => {
    const link = $('#mobile-page-link');
    expect(link).to.exist;
    expect(link.getAttribute('href')).to.equal('http://localhost:8080/pages/mobile.html');
  });

  it('should have a table-page link', () => {
    const link = $('#table-page-link');
    expect(link).to.exist;
    expect(link.getAttribute('href')).to.equal('http://localhost:8080/pages/table.html');
  });

  it('should have a wall-page link', () => {
    const link = $('#wall-page-link');
    expect(link).to.exist;
    expect(link.getAttribute('href')).to.equal('http://localhost:8080/pages/wall.html');
  });

  xit('should navigate to the mobile page when I click on the mobile-page link', () => {
    const link = $('#mobile-page-link');
    link.click();
    expect(browser.getUrl()).to.equal('http://localhost:8080/pages/mobile.html');
  });

  it('should navigate to the table page when I click on the table-page link', () => {
    const link = $('#table-page-link');
    link.click();
    expect(browser.getUrl()).to.equal('http://localhost:8080/pages/table.html');
  });

  xit('should navigate to the wall page when I click on the wall-page link', () => {
    const link = $('#wall-page-link');
    link.click();
    expect(browser.getUrl()).to.equal('http://localhost:8080/pages/wall.html');
  });
});

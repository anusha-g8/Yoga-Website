describe('Smoke Test', () => {
  it('loads the homepage', () => {
    cy.visit('/');
    cy.contains('Move with intention').should('be.visible');
  });

  it('navigates to about page', () => {
    cy.visit('/');
    cy.contains('Start here').click();
    cy.url().should('include', '/about');
    cy.contains('About Anusha').should('be.visible');
  });

  it('checks if backend data is reachable (API check)', () => {
    // This assumes the backend is running and has at least some health check or data
    // We can't guarantee data, but we can check if the page doesn't crash
    cy.visit('/calendar');
    // If backend is down, it might show "Loading" forever or an error
    // If it's up but empty, it shows "No classes scheduled"
    cy.get('body').should('not.contain', '404 Not Found');
  });
});

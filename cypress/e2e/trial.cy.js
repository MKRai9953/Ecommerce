describe("trial-one", () => {
  it("passes", () => {
    cy.visit("http://localhost:3000/");
    // cy.get('[data-testid="trial"]').get("button").should("exist").click();
    cy.log("it has clicked");
    // cy.screenshot();
    cy.get("input").type("Mayank Rai");
    cy.get('[data-testid="input-click"]').click();
  });
});

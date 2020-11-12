const { assert } = require('chai');
const { findUserByEmail } = require('../helpers.js');


const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('findUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = findUserByEmail("user@example.com", testUsers);
    const expectedOutput = "userRandomID";
    assert.strictEqual(user.id, expectedOutput);
  });

  it("should return undefined when non-existing email was submitted", () => {
    const user = findUserByEmail("a@a.com", testUsers);
    const expectedOutput = null;

    assert.strictEqual(user, expectedOutput);
  });

});
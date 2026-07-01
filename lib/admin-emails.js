'use strict';

function parseAdminEmails(value) {
  return new Set(
    String(value || '')
      .split(',')
      .map(email => email.trim().toLowerCase())
      .filter(Boolean)
  );
}

module.exports = {
  parseAdminEmails,
};

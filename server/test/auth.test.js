import test from "node:test";
import assert from "node:assert/strict";
import { createRequireOwner } from "../src/middleware/requireOwner.js";

function responseRecorder() {
  return {
    statusCode: 200,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
  };
}

function requestWith(header = "") {
  return { get: (name) => name === "authorization" ? header : "" };
}

test("rejects requests without a bearer token", async () => {
  const middleware = createRequireOwner({
    authClient: () => ({ auth: { getUser: async () => ({ data: { user: null } }) } }),
    ownerId: () => "owner-id",
  });
  const response = responseRecorder();
  await middleware(requestWith(), response, () => assert.fail("next should not run"));
  assert.equal(response.statusCode, 401);
});

test("rejects an authenticated user who is not the owner", async () => {
  const middleware = createRequireOwner({
    authClient: () => ({ auth: { getUser: async () => ({ data: { user: { id: "someone-else" } }, error: null }) } }),
    ownerId: () => "owner-id",
  });
  const response = responseRecorder();
  await middleware(requestWith("Bearer valid-token"), response, () => assert.fail("next should not run"));
  assert.equal(response.statusCode, 403);
});

test("allows only the configured owner user id", async () => {
  const middleware = createRequireOwner({
    authClient: () => ({ auth: { getUser: async () => ({ data: { user: { id: "owner-id" } }, error: null }) } }),
    ownerId: () => "owner-id",
  });
  const request = requestWith("Bearer valid-token");
  let continued = false;
  await middleware(request, responseRecorder(), () => { continued = true; });
  assert.equal(continued, true);
  assert.equal(request.user.id, "owner-id");
});

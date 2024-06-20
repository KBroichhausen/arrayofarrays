import { PlatformTest } from "@tsed/common";
import SuperTest from "supertest";
import { ApiInputOutput, HelloWorldController } from "./HelloWorldController";
import { Server } from "../../Server";

describe("HelloWorldController", () => {
  beforeEach(
    PlatformTest.bootstrap(Server, {
      mount: {
        "/": [HelloWorldController],
      },
    })
  );
  afterEach(PlatformTest.reset);

  it("should call POST /hello-world/input", async () => {
    const request = SuperTest(PlatformTest.callback());
    const apiInput = new ApiInputOutput();
    apiInput.arrayOfArraysOfInternalStructure = [[{ field: "Test as Input" }]];
    const payload = { apiInputOutput: apiInput };
    const response = await request.post("/hello-world/input").send(payload);

    /**
     * Expected: "ok"
     * Received: "{\"name\":\"Error\",\"message\":\"can't resolve reference #/components/schemas/InternalStructure from id #\",\"status\":500,\"errors\":[]}"
     */
    expect(response.text).toEqual("ok");
  });

  it("should call GET /hello-world/output", async () => {
    const request = SuperTest(PlatformTest.callback());

    const expected = new ApiInputOutput();
    expected.arrayOfArraysOfInternalStructure = [[{ field: "Test as Output" }]];

    const response = await request.get("/hello-world/output").send().expect(200);

    expect(response.text).toEqual(JSON.stringify(expected));
  });
});

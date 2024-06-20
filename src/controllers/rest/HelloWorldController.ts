import { Controller } from "@tsed/di";
import { BodyParams } from "@tsed/platform-params";
import { Get, Post, Property, Required, Returns, Schema } from "@tsed/schema";

class InternalStructure {
  @Required()
  @Property(String)
  public field: string;
}

export class ApiInputOutput {
  // How to use Array<Array<InternalStructure>> ?
  @Required()
  /**
   * bad idea: 1. Relies on the fact that `InternalStructure` is exported by any other thing
   * 2. Only works as ouput but as input AJV throws validation error
   */
    @Schema({ type: "array", items: { type: "array", items: { $ref: "#/components/schemas/InternalStructure" } } })

  /**
   *  this approach works but is very bad because it includes a copy of `InternalStructure` schema, which means you need to manually
   * change it (and of course need to remember the loose connection in your source code)
   */
  //   @Schema({
  //     type: "array",
  //     items: { type: "array", items: { type: "object", properties: { field: { type: "string", minLength: 1 } }, required: ["field"] } },
  //   })
  public arrayOfArraysOfInternalStructure: Array<Array<InternalStructure>>;
}

@Controller("/hello-world")
export class HelloWorldController {
  @Post("/dummy")
  @Returns(200, String)
  public postDummyToExportInternalStrucutreToSwaggerJson(
    @Required() @BodyParams("internalStructure") internalStructure: InternalStructure
  ): string {
    return "ok";
  }

  @Post("/input")
  @Returns(200)
  public postApiAsInput(@Required() @BodyParams("apiInputOutput") apiInputOutput: ApiInputOutput): string {
    return "ok";
  }

  @Get("/output")
  @Returns(200, ApiInputOutput)
  public postApiAsOutput(): ApiInputOutput {
    const ret = new ApiInputOutput();
    ret.arrayOfArraysOfInternalStructure = [[{ field: "Test as Output" }]];

    return ret;
  }
}

import fs from "fs";
import path from "path";

// Function to create a module with dynamic files
const createModule = (moduleName: string): void => {
  const baseDir = path.join(__dirname, "../", "app", "modules", moduleName);
  console.log(__dirname, " dir name");

  // List of files to be created
  const files = [
    `${moduleName}.routes.ts`,
    `${moduleName}.controller.ts`,
    `${moduleName}.model.ts`,
    `${moduleName}.service.ts`,
    `${moduleName}.interface.ts`,
    `${moduleName}.validation.ts`,
  ];

  // Create the module directory
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
    console.log(`Directory created: ${baseDir}`);
  } else {
    console.log(`Directory already exists: ${baseDir}`);
  }

  // Create each file with basic content
  files.forEach((file) => {
    const filePath = path.join(baseDir, file);
    if (!fs.existsSync(filePath)) {
      let content = "";

      if (file.endsWith(".routes.ts")) {
        content = `import { Router } from "express";
import { ${moduleName}Controller } from "./${moduleName}.controller";

const router = Router();

// Define routes
router.get("/", ${moduleName}Controller.getAll${capitalize(moduleName)});

export const ${capitalize(moduleName)}Routes = router;`;
      } else if (file.endsWith(".controller.ts")) {
        content = `import { Request, Response } from "express";
import { ${moduleName}Service } from "./${moduleName}.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

const getAll${capitalize(moduleName)} = catchAsync(async (req: Request, res: Response) => {
  const data = await ${moduleName}Service.getAll${capitalize(moduleName)}FromDB();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "${capitalize(moduleName)} retrieved successfully",
    data,
  });
});

export const ${capitalize(moduleName)}Controller = { getAll${capitalize(moduleName)} };`;
      } else if (file.endsWith(".service.ts")) {
        content = `import ${capitalize(moduleName)}Model from "./${moduleName}.model";

const getAll${capitalize(moduleName)}FromDB = async () => {
  const result = await ${capitalize(moduleName)}Model.find({});
  return result;
};

export const ${capitalize(moduleName)}Service = { getAll${capitalize(moduleName)}FromDB };`;
      } else if (file.endsWith(".interface.ts")) {
        content = `import { Model } from "mongoose";

export type T${capitalize(moduleName)} = {
  name: string;
  id?: string;
};

export interface I${capitalize(moduleName)} extends Model<T${capitalize(moduleName)}> {
  is${capitalize(moduleName)}Exists(id: string): Promise<T${capitalize(moduleName)} | null>;
}`;
      } else if (file.endsWith(".validation.ts")) {
        content = `import { z } from "zod";

const create${capitalize(moduleName)}Validation = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name is required",
    }),
  }),
});

const update${capitalize(moduleName)}Validation = create${capitalize(moduleName)}Validation.partial();

export const ${capitalize(moduleName)}Validation = {
  create${capitalize(moduleName)}Validation,
  update${capitalize(moduleName)}Validation,
};`;
      } else if (file.endsWith(".model.ts")) {
        content = `import { Schema, model, Document } from "mongoose";
import { T${capitalize(moduleName)} } from "./${moduleName}.interface";

const ${moduleName}Schema = new Schema<T${capitalize(moduleName)}>(
  {
    name: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

${moduleName}Schema.statics.is${capitalize(moduleName)}Exists = async function (id: string) {
  return await ${capitalize(moduleName)}Model.findOne({ id });
};

const ${capitalize(moduleName)}Model = model<T${capitalize(moduleName)}>("${capitalize(moduleName)}s", ${moduleName}Schema);

export default ${capitalize(moduleName)}Model;`;
      }

      fs.writeFileSync(filePath, content, "utf-8");
      console.log(`File created: ${filePath}`);
    } else {
      console.log(`File already exists: ${filePath}`);
    }
  });
};

// Utility function to capitalize the module name
const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

// Get the module name from command-line arguments
const moduleName = process.argv[2];
if (!moduleName) {
  console.error("Please provide a module name.");
  process.exit(1);
}

// Execute the function
createModule(moduleName);

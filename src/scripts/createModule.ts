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
      const className = capitalize(moduleName);

      // Templates for each file
      if (file.endsWith(".routes.ts")) {
        content = `import { Router } from "express";
import { ${className}Controller } from "./${moduleName}.controller";

const router = Router();

// Define routes
router.get("/", ${className}Controller.getAll${className});

export const ${className}Routes = router;
`;
      } else if (file.endsWith(".controller.ts")) {
        content = `import { Request, Response } from "express";
import { ${className}Service } from "./${moduleName}.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

const getAll${className} = catchAsync(async (req: Request, res: Response) => {
  const data = await ${className}Service.getAll${className}FromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "${className} retrieved successfully",
    data,
  });
});

export const ${className}Controller = { getAll${className} };
`;
      } else if (file.endsWith(".service.ts")) {
        content = `import { get } from "http";

const getAll${className}FromDB = async () => {
  const result = await get("http://localhost:5000/api/v1/${moduleName}s");
  return result;
};

export const ${className}Service = { getAll${className}FromDB };
`;
      } else if (file.endsWith(".interface.ts")) {
        content = `export interface I${className} {
  id: string;
  name: string;
}
`;
      } else if (file.endsWith(".validation.ts")) {
        content = `import { z } from "zod";

const create${className}Validation = z.object({
  name: z.string().min(1, "Name is required"),
});

const update${className}Validation = create${className}Validation.partial();

export const ${className}Validation = { create${className}Validation, update${className}Validation };
`;
      } else if (file.endsWith(".model.ts")) {
        content = `import { Schema, model, Document } from "mongoose";

export interface I${className}Model extends Document {
  name: string;
  // add more fields here
}

const ${moduleName}Schema = new Schema<I${className}Model>({
  name: { type: String, required: true },
  // add more fields here
});

const ${className}Model = model<I${className}Model>('${className}', ${moduleName}Schema);

export default ${className}Model;
`;
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

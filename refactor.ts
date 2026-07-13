import { Project, SyntaxKind, ArrowFunction } from "ts-morph";
import * as fs from "fs";

const project = new Project();
project.addSourceFilesAtPaths("src/api/**/*.ts");

for (const sourceFile of project.getSourceFiles()) {
  let changed = false;
  
  // Find all property access expressions that look like `.handler(...)`
  const calls = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression);
  
  for (const call of calls) {
    const expr = call.getExpression();
    if (expr.getKind() === SyntaxKind.PropertyAccessExpression && expr.getText().endsWith(".handler")) {
      const args = call.getArguments();
      if (args.length > 0 && (args[0].getKind() === SyntaxKind.ArrowFunction || args[0].getKind() === SyntaxKind.FunctionExpression)) {
        const arrowFunc = args[0] as ArrowFunction;
        const body = arrowFunc.getBody();
        if (body.getKind() === SyntaxKind.Block) {
          const bodyText = body.getText();
          // Skip if already has a try block as the outer block (roughly)
          if (bodyText.includes("try {") && bodyText.includes("return { success: false")) continue;
          
          const innerContent = bodyText.substring(1, bodyText.length - 1);
          
          arrowFunc.setBodyText(`try { ${innerContent} } catch (e: any) { console.error("Server Error:", e); return { success: false, error: e.message || "Failed to process request" } }`);
          changed = true;
        }
      }
    }
  }
  
  if (changed) {
    sourceFile.saveSync();
    console.log("Refactored " + sourceFile.getFilePath());
  }
}

import { Project, SyntaxKind, ArrowFunction } from "ts-morph";

const project = new Project();
project.addSourceFilesAtPaths("src/api/**/*.ts");

for (const sourceFile of project.getSourceFiles()) {
  let changed = false;
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
          
          // Match the previous refactoring we did
          const match = bodyText.match(/^\{\s*try\s*\{([\s\S]*)\}\s*catch\s*\(e:\s*any\)\s*\{\s*console\.error\([^)]+\);\s*return\s*\{\s*success:\s*false,\s*error:\s*[^}]+\}\s*;\s*\}\s*\}$/);
          
          if (match) {
            const innerContent = match[1];
            // Rewrite the try/catch to throw a standard Error instead
            arrowFunc.setBodyText(`try {${innerContent}} catch (e: any) { console.error("Server Error:", e); throw new Error(e.message || "Failed to process request"); }`);
            changed = true;
          }
        }
      }
    }
  }
  
  if (changed) {
    sourceFile.saveSync();
    console.log("Refactored to throw Error in " + sourceFile.getFilePath());
  }
}

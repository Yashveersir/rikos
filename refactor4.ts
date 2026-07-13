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
          
          if (bodyText.includes("throw new Error(")) {
            // regex to match: try { ... } catch (e: any) { console.error("Server Error:", e); throw new Error(XXX); }
            const innerMatch = bodyText.match(/^\{\s*try\s*\{([\s\S]*?)\}\s*catch\s*\(e:\s*any\)\s*\{\s*console\.error\([^)]+\);\s*throw\s*new\s*Error\(([^)]+)\);\s*\}\s*\}$/);
            
            if (innerMatch) {
              const innerContent = innerMatch[1];
              const errorExpression = innerMatch[2].trim();
              
              arrowFunc.setBodyText(`try {${innerContent}} catch (e: any) { console.error("Server Error:", e); return { success: false, error: ${errorExpression} }; }`);
              changed = true;
            } else {
                console.log("Failed to match block in " + sourceFile.getFilePath());
            }
          }
        }
      }
    }
  }
  
  if (changed) {
    sourceFile.saveSync();
    console.log("Refactored to return success:false in " + sourceFile.getFilePath());
  }
}

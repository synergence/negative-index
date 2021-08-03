import ts, { factory } from 'typescript';

function transformNode(node: ts.Node, typeChecker: ts.TypeChecker): ts.Node | undefined {
	if (!ts.isElementAccessExpression(node)) return;

	const expressionType = typeChecker.getTypeAtLocation(node.expression);
	if (!(typeChecker as ts.TypeChecker & { isArrayType(type: ts.Type): boolean }).isArrayType(expressionType)) return;

	if (!ts.isPrefixUnaryExpression(node.argumentExpression)) return;

	const operator = node.argumentExpression.operator;
	if (operator !== ts.SyntaxKind.MinusToken) return;

	console.log('Found')

	return factory.createElementAccessExpression(
		node.expression,
		factory.createBinaryExpression(
			factory.createCallExpression(
				factory.createPropertyAccessExpression(
					node.expression,
					factory.createIdentifier("size")
				),
				undefined,
				[]
			),
			factory.createToken(ts.SyntaxKind.MinusToken),
			factory.createNumericLiteral(Number(node.argumentExpression.operand.getText()) + 1)
		)
	);
}

export default function transform(program: ts.Program, userConfiguration: {}) {
	const typeChecker = program.getTypeChecker();

	const transformFile: ts.TransformerFactory<ts.SourceFile> = context => {
		return sourceFile => {
			const visitor = (node: ts.Node): ts.Node => {
				const transformResult = transformNode(node, typeChecker);
				return transformResult ?? ts.visitEachChild(node, visitor, context);
			};

			return ts.visitNode(sourceFile, visitor);
		};
	};

	return transformFile;
}